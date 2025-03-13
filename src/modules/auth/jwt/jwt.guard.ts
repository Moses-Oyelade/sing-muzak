import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Removes "Bearer "
    
    
    console.log('Received JWT:', token);
    const payload = this.jwtService.decode(token);
    console.log('Decoded JWT:', payload);
    if (payload?.exp) {
      console.log('Token Expiration:', new Date(payload.exp * 1000));
    }

    // if (!token) return false;
    if (!token) {
      console.log('JWT is missing!');
    } else {
      console.log('Decoding JWT:', token);
    }

    try {
      request.user = this.jwtService.verify(token);
      console.log('Verified JWT:', payload);
      return true;
    } catch (e) {
      console.error('JWT verification failed:', e.message);
      return false;
    }
  }
}
