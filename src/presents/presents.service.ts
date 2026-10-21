import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePresentDto } from './dto/create-present.dto';
import { UpdatePresentDto } from './dto/update-present.dto';
import { Present } from './entities/present.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { isUUID } from 'class-validator';
import { throws } from 'assert';

@Injectable()
export class PresentsService {
  // para el manejo de errore
  private readonly logger =  new Logger('PresentService')

  //patron repositorio en el constructor
  constructor(
    @InjectRepository(Present)
    private readonly presentRepository : Repository<Present>,
    @InjectRepository(Category)
    private readonly categoryRepository : Repository<Category>
  ){}


  async create(createPresentDto: CreatePresentDto, user: User) {
    try{
      const {categoryId, ...presentData} = createPresentDto

      const category  =await this.categoryRepository.findOne({where:{id : categoryId}})
      // comprobar que la categoria existe
      if(!category) throw new BadRequestException(`Categoría con id ${categoryId} no es valida`)
          
      const present = this.presentRepository.create({
        ...presentData,
        user,
        category
      })  
      //guardamos en la base de datos

      await this.presentRepository.save(present)

      //retornamos present
      return {present, category: category.name, user: user.id};
    } catch(error){
      this.handleDBExpections(error)
    }
  }



  async findAll() {
    const presents =  await this.presentRepository.find()
    
    return presents;
  }

  async findByUserId(userId: string)  {
      
    const present =await this.presentRepository.find({
      where : {user : {id:userId}}
    })
    // VALIDACIONES DE USERID Y DE PRESENT 
    //comprobamos que el usuario exista
    if(!userId) throw new NotFoundException(`El usuario ${userId} no existe`)
    //comprobamos que haya regalos en el user
    if(!present) throw new NotFoundException(`El usuario ${userId} no tiene regalos`)

    return present
    
  }

  async update(id: string, updatePresentDto: UpdatePresentDto, user : User) {
    //comprobamos que el regalo exista
    const presentExist = await this.presentRepository.findOne({
      where : {id},
      relations : {user: true}
    })
    //VALIDACIONES
    //validamos que el regalo exista
    if(!presentExist) throw new NotFoundException(`El regalo con id  ${id} no existe`)
    // validamos que el regalo sea del usuario que lo creo
    if(presentExist.user.id !== user.id) throw new ForbiddenException('No puedes editar un regalo que no es tuyo')  

    //crear el regalo nuevo
    const {categoryId, ...toUpdate} = updatePresentDto

    const present = await this.presentRepository.preload({
      id,
      ...toUpdate
    })
    
    if(!present) throw new NotFoundException(`El regalo con ${id} no existe`)

    if(categoryId){
      const category = await this.categoryRepository.findOne({
        where : {id:categoryId}
      })
      if(!category) throw new NotFoundException(`La categoría con id  ${categoryId} no es valida`)
      present.category = category  
    }
    
    try {
      await this.presentRepository.save(present)
      return present
    } catch (error) {
      this.handleDBExpections(error)
    }
        
  }

  async remove(id: string, user:User) {
    const present = await this.presentRepository.findOne({
      where: {id},
      relations : {user:true}
    })
    //validamos present
    if(!present) throw new NotFoundException(`El regalo con id: ${id} no existe`)
    //validamos user
    if(present.user.id !== user.id) throw new ForbiddenException(`El usuario con id ${user.id} no puede eliminar este regalo`)
        
    await this.presentRepository.remove(present)
    return `Regalo con id: ${id} ha sido eliminado`
  }

 



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




