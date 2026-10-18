import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Present } from './entities/present.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  controllers: [PresentsController],
  providers: [PresentsService],
  imports : [
    TypeOrmModule.forFeature([Present,Category]),
    AuthModule
  ],
  exports: [PresentsService, TypeOrmModule]
})
export class PresentsModule {}
