import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ExclusionMetadata } from 'typeorm/metadata/ExclusionMetadata.js';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProfileService {
//para el manejo de errore
private readonly logger = new Logger('profileService')

//creamos el constructor e inyectamos las repos
constructor(
  @InjectRepository(Profile)
  private readonly profileRepository : Repository<Profile>
){}

async create(createProfileDto: CreateProfileDto, user: User) {
  try {
    //creamos el perfil con los datos del dto
    const profile = this.profileRepository.create({
      ...createProfileDto, 
      user
    })
    //guardamos en la base de datos
    await this.profileRepository.save(profile)
    //lo que retorna
    return {profile, user:user.id}
    
  } catch (error) {
    this.handleDBExpections(error)
  }

    
  }

  async findOne(userId: string) {
    //comprobamos que el usuario exista
    const profile = await this.profileRepository.findOne({
      where: {user : {id: userId}}
    })
     if(!profile) throw new NotFoundException(`El usuario con id: ${userId} no tiene perfil`) 
  
    return profile
  }

  
  async findByName(userName: string){
    //quitamos los espacios de fullName en el caso que tenga
    const clearName =  userName.trim()
    //comprobamos que el nombre exista
    const profiles = await this.profileRepository.find({
      where: {user : {fullName: ILike(`%${clearName}%`)}}
    })
    if(profiles.length ===0) throw new NotFoundException(`El perfil de  ${userName} No existe`)
    
    return profiles
  }

 

  async update(id: string, updateProfile:UpdateProfileDto, user: User){
    //comprobamos que el perfil EXISTE?????
    const profileExist = await this.profileRepository.findOne({
      where: {id},
      relations: {user: true}
    })
    if(!profileExist) throw new NotFoundException(`El perfil con id: ${id} no existe`)
    
    // comprobamos que el perfil es del usuarios que buscamos
    if(profileExist.user.id !== user.id) throw new ForbiddenException(`Este perfil no es del usuario que buscas`)
    
    //creamos el regalo nuevo
    const profile = await this.profileRepository.preload({
      id,
      ...updateProfile
    })
    //importante comprobar que no sea undefined 
    if(!profile) throw new NotFoundException(`El perfil con id: ${id} no existe`)
    
   // Grabamos en la base de datos
   try {
    await this.profileRepository.save(profile)
    return  profile
    
   } catch (error) {
    this.handleDBExpections(error)
   }

  }



  //para el manejo de errores
  //metodo privado para manejo de errores 
    private handleDBExpections(error:any){
      if(error.code === '23505'){
          throw new BadRequestException(error.detail)
        }
        //llamamos al logger
        this.logger.error(error)
        throw new InternalServerErrorException('Uniexpected error, check server')
      
    }
}
