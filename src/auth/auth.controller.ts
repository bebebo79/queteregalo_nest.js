import { Controller, Get, Post, Body,  UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.entity';

import { UseRoleGuard } from './guards/use-role/use-role.guard';

import { ValidateRoles } from './interfaces';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { Express } from 'express';





@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    
    @GetUser() user : User
  
    )
  {
    return this.authService.checkAtuhStatus(user)
      
  }




  // //creamos una router private
  // @Get('private')
  // @UseGuards(AuthGuard())
  // testingRouterPrivate(
  //   @Req() request : Express.Request,
  //   @RawHeaders() rawHeaders : string[],
  //   @GetUser() user : User,
  //   @GetUser('email') userMail:string 
  //   ){
  //     console.log(request)
  //       return {
  //         ok: true, 
  //         user,
  //         userMail,
  //         rawHeaders
            
  //   }
  // }

  // usando decoradores que hemos creado 
  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidateRoles.admin) 
  @UseGuards(AuthGuard(), UseRoleGuard)
  privateRouter2(
    @GetUser() user : User,
 
  ){
    return {
      ok: true, 
      user
    }
  }

  //usando una composicion de decoradores
  @Get('private3')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @Auth(ValidateRoles.admin)
  privateRouter3(
    @GetUser() user : User,
 
  ){
    return {
      ok: true, 
      user
    }
  }
  
  

}
