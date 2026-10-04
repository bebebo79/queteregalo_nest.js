import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePresentDto } from './dto/create-present.dto';
import { UpdatePresentDto } from './dto/update-present.dto';
import { Present } from './entities/present.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PresentsService {
  // para el manejo de errore
  private readonly logger =  new Logger('PresentService')

  //patron repositorio en el constructor
  constructor(
    @InjectRepository(Present)
    private readonly presentRepository : Repository<Present>
  ){}


  async create(createPresentDto: CreatePresentDto) {
    try{
      const {description, option} = createPresentDto
      const present = this.presentRepository.create({description,option})

      //guardamos en la base de datos
      await this.presentRepository.save(present)

      //retornamos present
      return present;
    } catch(error){
      this.handleDBExpections(error)
    }
  }



  async findAll() {
    const presents =  await this.presentRepository.find()
    
    return presents;
  }

  findOne(id: number) {
    return `This action returns a #${id} present`;
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




