import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '/config/jwt.config'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/users.schema';
// import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Load secret from .env
        signOptions: { expiresIn: '1h' },
      }),
    }),
    // UsersModule,
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
