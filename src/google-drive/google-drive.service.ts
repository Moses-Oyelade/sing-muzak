import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class GoogleDriveService {
  private driveClient: any;

  constructor() {
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
}
