import { Injectable, NotFoundException } from '@nestjs/common';
import { google } from 'googleapis';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private driveClient: any;
  private drive: any;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.JWT(
        this.configService.get('GOOGLE_DRIVE_CLIENT_EMAIL'),
        undefined,
        this.configService.get('GOOGLE_DRIVE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/drive']
      );

    this.driveClient = this.initializeDriveClient();
  }

  private initializeDriveClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/your-service-account.json', // Update with the correct path
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    return google.drive({ version: 'v3', auth });
  }

  async uploadFile(file: Express.Multer.File) {
    const { originalname, buffer } = file;
    
    const fileMetadata = { name: originalname };
    const media = { mimeType: file.mimetype, body: Readable.from(buffer) };

    const response = await this.driveClient.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    return `https://drive.google.com/uc?id=${response.data.id}`;
  }

//   To download Files
async downloadFile(fileId: string, res: Response) {
    try {
      // Get file metadata (name and MIME type)
      const fileMetadata = await this.drive.files.get({
        fileId,
        fields: 'name, mimeType',
      });

      const fileName = fileMetadata.data.name;
      const mimeType = fileMetadata.data.mimeType;

      // Stream the file content
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      // Set headers based on file type
      res.setHeader('Content-Type', mimeType);

      if (mimeType === 'application/pdf') {
        // Display PDFs in the browser but allow download
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      } else if (mimeType.startsWith('audio/') || mimeType.startsWith('video/')) {
        // Stream media files (MP3, MP4, etc.)
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      } else {
        // Default to download for other file types
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      }

      // Stream the file to response
      response.data.pipe(res);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
