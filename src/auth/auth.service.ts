import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt.payload.interfaces';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    private readonly jWtService : JwtService
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
    
      //lo que retorna
      return {
        ...userData, 
        token: this.getJwtToken({id: user.id})
      }

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
