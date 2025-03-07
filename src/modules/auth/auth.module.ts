import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'config/jwt.config'; 
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../users/schema/users.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
