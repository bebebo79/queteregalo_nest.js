import { Controller, Get, Post, Body,  UseGuards, Req, SetMetadata, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.entity';

import { UseRoleGuard } from './guards/use-role/use-role.guard';

import { ValidateRoles } from './interfaces';
import { Auth, GetUser, RoleProtected } from './decorators';




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
    @GetUser() user : User){
    return this.authService.checkAtuhStatus(user)
  }

  @Post('confirm-acount/:token')  // url que se manda desde el mail para confirmar
  confirmAccount(
    @Param('token') token: string){
    return this.authService.confirmAccount(token)
  }

  @Post('forgot-password')
  forgotPassword(
    @Body('email') email: string
  ){
    return this.authService.forgotPassword(email)
  }

  @Post('reset-password/:token')
  resetPassord(
    @Param('token') token : string,
    @Body() ResetPasswordDto : ResetPasswordDto
  ){
    return this.authService.resetPassword(token,  ResetPasswordDto)
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
