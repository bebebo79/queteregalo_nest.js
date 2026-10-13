import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Present } from './entities/present.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PresentsController],
  providers: [PresentsService],
  imports : [
    TypeOrmModule.forFeature([Present]),
    AuthModule
  ],
  exports: [PresentsService, TypeOrmModule]
})
export class PresentsModule {}
