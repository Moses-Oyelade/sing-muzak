import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from './google-drive.service';
import { Request } from 'express';
import { Multer } from 'multer';  // Import Multer separately



@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.googleDriveService.uploadFile(file);
    return { url: fileUrl };
    // console.log(file); // Debugging
    // return { message: 'File uploaded successfully' };
  }
}
