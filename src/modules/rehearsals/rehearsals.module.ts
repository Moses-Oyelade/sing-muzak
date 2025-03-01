import { Module } from '@nestjs/common';
import { RehearsalsService } from './rehearsals.service';
import { RehearsalsController } from './rehearsals.controller';

@Module({
  providers: [RehearsalsService],
  controllers: [RehearsalsController]
})
export class RehearsalsModule {}
