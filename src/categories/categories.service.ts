import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';



@Injectable()
export class CategoriesService {
  // para el manejo de errore
  private readonly logger = new Logger('CategoryService')

  //patron repositorio en el constructor
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository : Repository<Category>
  ){}

 

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      //desestructuramos el details
    const {name} = createCategoryDto
    const category = this.categoryRepository.create({name})

    //guardamos en la base de datos
    await this.categoryRepository.save(category)

    //retornamos la categoria
    return category

    } catch (error) {
      this.handleDBExpections(error)
    }
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
