import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // constructor(private jwtService: JwtService, private reflector: Reflector) {}
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    
    console.log('Request Headers:', request.headers);
    console.log('Authorization Header:', authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('JWT is missing or malformed!');
      return false;
    }

    const token = authHeader?.split(' ')[1]; // Removes "Bearer "
    
    
    // console.log('Received JWT:', token);
    // const payload = this.jwtService.decode(token);
    // console.log('Decoded JWT:', payload);
    // if (payload?.exp) {
    //   console.log('Token Expiration:', new Date(payload.exp * 1000));
    // }

    console.log('Decoded JWT:', this.jwtService.decode(token));


    // if (!token) return false;
    if (!token) {
      console.log('JWT is missing!');
      return false;
    } else {
      console.log('Decoding JWT:', token);
    }

    try {
      const decoded = this.jwtService.verify(token);
      console.log('Verified JWT:', decoded);

      request.user = decoded //Attached user to request
      console.log('User after settings:', request.user)

      return true;
    } catch (e) {
      console.error('JWT verification failed:', e.message);
      return false;
    }
  }
}
