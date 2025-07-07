import { Controller, Post, Get, Param, Res, UseGuards, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from './google-drive.service';
// import { JwtAuthGuard } from '../modules/auth/jwt/jwt.guard';
import { Express, Response } from 'express';
// import { Request } from 'express';
// import { Multer } from 'multer';  // Import Multer separately


// @UseGuards(JwtAuthGuard)
@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    //   const fileUrl = await this.googleDriveService.uploadFile(file);
    //   return { url: fileUrl, message: 'File uploaded successfully' };
      // console.log(file); // Debugging
      // return { message: 'File uploaded successfully' };
      return await this.googleDriveService.uploadFile(file);
  }

//   To stream file
  @Get('stream/:fileId')
  async streamfile(@Param('fileId') fileId: string, @Res() res: Response) {
    return this.googleDriveService.downloadFile(fileId, res, true);
  }

//   To download file
  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
    return this.googleDriveService.downloadFile(fileId, res, false);
  }
  
  // To delete file from google drive
  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    return this.googleDriveService.deleteFile(fileId);
  }

}
