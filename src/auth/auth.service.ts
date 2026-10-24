import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ParseUUIDPipe, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt.payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/resetPassword -use.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    private readonly jWtService : JwtService,
    private readonly mailService : MailService
  ){}

  async create(createUserhDto: CreateUserDto) {
   
    try {
      //desestructuramos para separar el password de los demas
      const { password, ...userData} = createUserhDto
      
      //lo creamos
      const user = this.userRepository.create({
        ...userData,
  
        password: bcrypt.hashSync(password, 10)
      })
      

      //lo guardamos
      await this.userRepository.save(user)

      //creamos el token
      const token = this.getJwtToken({id: user.id})
      
      //mandamos el token
      await this.mailService.sendConfirmationEmail(user.email, token)
      
      //lo que retorna
      return 'Comprueba tu correo para activar cuenta'
        

    } catch (error) {
      this.handleDBError(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const {password, email} =  loginUserDto

   
    const user= await this.userRepository.findOne({
      where: {email},
      select : {password:true, email: true, id:true}

    })

    // comprobar que el mail esta en la base de datod
    if(!user) throw new UnauthorizedException('Credentials are not valid (email)')
    //comprobar que el password es correcto
    if(!bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException('Credentials are not valid (password)')


    return {
      ...user,
      token : this.getJwtToken({id: user.id})
    }

  }

  async confirmAccount(token:string){
    let payload : {id:string} //contiene lo guardado en user.id 
    try {
      payload = this.jWtService.verify(token) //si existe o si ha caducado
      if(!payload) throw new NotFoundException(`El token ${token} No es Valido`)
      //que el usuario exista con ese token
      const user = await this.userRepository.findOneBy({id: payload.id})
      if(!user) throw new NotFoundException(' El usuario No encontrado')
      //que el usuario no este ya activo
      if(user.isActive === true) return 'El Usuario ya esta Confirmado'
      //dejamos activo el usuario y grabamos los cambios
      user.isActive = true
      await this.userRepository.save(user)
      return 'Cliente Confirmado'
          
      
    } catch (error) {
      this.handleDBError(error)
    }

  }

  async forgotPassword(email : string){
    //consultamos el mail del user
    const user = await this.userRepository.findOneBy({email})
    //validaciones
    if(!user) throw new NotFoundException(' El usuario No encontrado')
    //que el usuario no este ya activo
    if(user.isActive === false) return 'El Usuario No esta Confirmado'
    //dejamos activo el usuario y grabamos los cambios

    //generamos token
    const token = this.getJwtToken({id : user.id})
    //mandamos el token
    await this.mailService.sendPasswordResetEmail(user.email, token)

    //return
    return 'Comprueba tu correo y sigue las instrucciones'

  }

  async resetPassword(token:string, ResetPasswordDto:ResetPasswordDto){
     let payload : {id:string}
     //VALIDAMOS con el payload que el token existe
     try {
      payload = this.jWtService.verify(token) //si existe o si ha caducado
     } 
    catch(error){
      throw new UnauthorizedException('El token no es valido')
    }
      //VALIDACIONES
      //que el usuario exista con ese token
      const user = await this.userRepository.findOneBy({id: payload.id})
      if(!user) throw new NotFoundException(' El usuario No encontrado')
      //que el usuario  este ya activo
      if(user.isActive === false) return 'El Usuario No esta Confirmado'
      
      //guardamos el password del body
      const newPassword = bcrypt.hashSync(ResetPasswordDto.newPassword,10)
      user.password =  newPassword

      //Grabamos en la base de datos
      try{
      await this.userRepository.save(user)
      return 'Password Cambiado Correctamente'
      }catch (error) {
      this.handleDBError(error)
    }
  }

  //metodo para llamar al jwt
  private getJwtToken(payload : JwtPayload){
    const token = this.jWtService.sign(payload)
    return token
  }


  //metodo para los errores

  private handleDBError(error: any): never {   //: never no retorna ningun valor
    if(error.code === '23505') 
      throw new BadRequestException (error.detail)
    
    console.log(error)
    throw new InternalServerErrorException('please check server logs')
  }



   async checkAtuhStatus(user: User) {

    return {
      ...user,
      token : this.getJwtToken({id: user.id})
    }

  }
  
}
