import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { GoogleDriveController } from './google-drive.controller';

@Module({
  controllers: [GoogleDriveController],
  providers: [GoogleDriveService],
  exports: [GoogleDriveService],
})
export class GoogleDriveModule {}
