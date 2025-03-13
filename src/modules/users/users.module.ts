import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ])
  ],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule], // Export UsersService for other modules
})
export class UsersModule {}

export { User };
