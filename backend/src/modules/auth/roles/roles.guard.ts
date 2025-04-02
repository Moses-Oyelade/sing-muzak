import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
  // ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      console.log('Access Denied!');
    throw new ForbiddenException('You do not have permission to access this resource');

    }
    console.log('User Roles:', user?.role);
    console.log('Required Roles:', requiredRoles); // Debugging
    
    // return requiredRoles.some(role => user.role === role || user.roles?.includes(role));
  
    return true;
  }
}