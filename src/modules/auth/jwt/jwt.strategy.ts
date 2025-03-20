import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secretKey = configService.get<string>('JWT_SECRET');

    console.log('Loaded JWT_SECRET:', secretKey); // <-- Debug log
    
    if (!secretKey) {
      throw new Error('JWT_SECRET is missing in environment variables!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: secretKey,  // Ensure it's defined
    });
  }
  
  async validate(payload: any) {
    console.log('Decoded JWT Payload:', payload);
    return { userId: payload.sub, phone: payload.phone, role: payload.role };
  }
}
