import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RehearsalService } from './rehearsals.service';
import { RehearsalController } from './rehearsals.controller';
import { Rehearsal, RehearsalSchema } from './schema/rehearsal.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Rehearsal.name, schema: RehearsalSchema }
  ]),
  AuthModule,
],
  controllers: [RehearsalController],
  providers: [RehearsalService, JwtService],
  exports: [RehearsalService],
})
export class RehearsalModule {}
