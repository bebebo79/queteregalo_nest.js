import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Present } from './entities/present.entity';

@Module({
  controllers: [PresentsController],
  providers: [PresentsService],
  imports : [
    TypeOrmModule.forFeature([Present])
  ]
})
export class PresentsModule {}
