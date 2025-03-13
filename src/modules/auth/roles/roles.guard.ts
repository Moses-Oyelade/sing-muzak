import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredRoles.some(role => user.roles?.includes(role));
  }
  // canActivate(context: ExecutionContext): boolean {
  //   const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
  //   if (!requiredRoles) return true; // If no roles are required, allow access

  //   // const request = context.switchToHttp().getRequest();
  //   const req = context.switchToHttp().getRequest();
  //   const user = req.user;

  //   console.log('User Role:', user?.role); // Check user role
  //   return user?.role === 'admin'; // Adjust role as needed

  //   // if (!user || !requiredRoles.includes(user.role)) {
  //   //   throw new ForbiddenException('You do not have permission to access this resource');
  //   // }

  //   // return true;
  // }
}
