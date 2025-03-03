import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RehearsalService } from './rehearsals.service';
import { RehearsalController } from './rehearsals.controller';
import { Rehearsal, RehearsalSchema } from './schema/rehearsal.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rehearsal.name, schema: RehearsalSchema }])],
  controllers: [RehearsalController],
  providers: [RehearsalService],
  exports: [RehearsalService],
})
export class RehearsalModule {}
