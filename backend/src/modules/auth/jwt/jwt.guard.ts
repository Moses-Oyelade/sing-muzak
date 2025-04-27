import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    
    console.log('Request Headers:', request.headers);
    console.log('Authorization Header:', authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('JWT is missing or malformed!');
      throw new UnauthorizedException('Authorization token is missing or malformed');
    }

    const token = authHeader?.split(' ')[1]; // Removes "Bearer "

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
      console.log('🔥 Incoming user from JWT:', request.user)

      return true;
    } catch (e) {
      console.error('JWT verification failed:', e.message);
      throw new UnauthorizedException();
    }
  }
}
