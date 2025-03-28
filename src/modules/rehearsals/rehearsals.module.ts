import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RehearsalService } from './rehearsals.service';
import { RehearsalController } from './rehearsals.controller';
import { Rehearsal, RehearsalSchema } from './schema/rehearsal.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
    { name: Rehearsal.name, schema: RehearsalSchema },
    { name: User.name, schema: UserSchema }
  ]),
  AuthModule,
],
  controllers: [RehearsalController],
  providers: [RehearsalService],
  exports: [RehearsalService],
})
export class RehearsalModule {}
