import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { CreatePresentDto } from './dto/create-present.dto';
import { UpdatePresentDto } from './dto/update-present.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';


@Controller('presents')
export class PresentsController {
  constructor(
    private readonly presentsService: PresentsService
  ) {}

  @Post()
  @Auth()
  create(
    @Body() 
    createPresentDto: CreatePresentDto, 
    @GetUser() user : User,
  ) {
    return this.presentsService.create(createPresentDto, user);
  }
45
  @Get()
  findAll() {
    return this.presentsService.findAll();
  }

  @Get(':userId')
  @Auth()
  findOne(@Param('userId') userId: string) {
    return this.presentsService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresentDto: UpdatePresentDto) {
    return this.presentsService.update(+id, updatePresentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentsService.remove(+id);
  }
}
