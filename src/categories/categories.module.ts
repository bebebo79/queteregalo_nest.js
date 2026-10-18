import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Present } from 'src/presents/entities/present.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports : [
    TypeOrmModule.forFeature([Category,Present])
  ],
  exports : [CategoriesService, TypeOrmModule]
})
export class CategoriesModule {}
