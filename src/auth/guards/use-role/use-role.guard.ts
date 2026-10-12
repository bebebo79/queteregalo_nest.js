import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';
import { META_ROLES } from '../../decorators/Role-protected.decorator';

@Injectable()
export class UseRoleGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

   const validateRoles :string[] = this.reflector.get(META_ROLES, context.getHandler()) // en la documentacion
   if(!validateRoles) return true  // si no existe los roles
   if(validateRoles.length === 0 ) return true  // si el array de roles esta vacio

   //necesitamos el usuario para ver si tiene algun rol que definimos 
    const req = context.switchToHttp().getRequest()
    const user = req.user as User
    //comprobamos el que usuario exista
    if(!user) throw new BadRequestException('User not found')
    
   // buscamos entre los roles del usuario si tiene uno de los validateRoles
   for(const role of user.roles){
    if( validateRoles.includes(role)){
      return true
    }
   }   
    throw new ForbiddenException(`User ${user.fullName} need a valid role: [ ${validateRoles}]`)

   

    
  }
}
