import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePresentDto } from './dto/create-present.dto';
import { UpdatePresentDto } from './dto/update-present.dto';
import { Present } from './entities/present.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { isUUID } from 'class-validator';

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

  async findByUserId(userId: string) {
      
    const present =await this.presentRepository.find({
      where : {user : {id:userId}}
    })

    return present
    
  }

  update(id: number, updatePresentDto: UpdatePresentDto) {
    return `This action updates a #${id} present`;
  }

  remove(id: number) {
    return `This action removes a #${id} present`;
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




