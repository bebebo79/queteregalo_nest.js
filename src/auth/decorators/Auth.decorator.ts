
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './Role-protected.decorator';
import { ValidateRoles } from '../interfaces';
import { AuthGuard } from '@nestjs/passport';
import { UseRoleGuard } from '../guards/use-role/use-role.guard';

export function Auth(...roles: ValidateRoles[]) {

   //composicion de decoradores 
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UseRoleGuard),
    
  );
}
