import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Auth()
  create(
    @Body() createProfileDto: CreateProfileDto,
    @GetUser() user: User) {
    return this.profileService.create(createProfileDto, user);
  }


  
  @Get(':userId')
  @Auth()
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.profileService.findOne(userId);
  }

  @Get('search/:userName')
  @Auth()
  findByName(@Param('userName') userName:string){
    return this.profileService.findByName(userName)
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user:User)  {
    return this.profileService.update(id, updateProfileDto, user);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }
}
