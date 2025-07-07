import { Injectable, NotFoundException } from '@nestjs/common';
import { google } from 'googleapis';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { Express } from 'express';

@Injectable()
export class GoogleDriveService {
  private driveClient: any;
//   private drive: any;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.JWT(
        this.configService.get('GOOGLE_DRIVE_CLIENT_EMAIL'),
        undefined,
        this.configService.get('GOOGLE_DRIVE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/drive']
      );

    this.driveClient = google.drive({ version: 'v3', auth });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const { originalname, mimetype, buffer } = file;

      // Convert buffer to Readable Stream
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const response = await this.driveClient.files.create({
        requestBody: {
          name: originalname,
          mimeType: mimetype,
        },
        media: {
          mimeType: mimetype,
          body: stream, // Ensure body is a Readable stream
        },
      });

      return response.data;
    } catch (error) {
      console.error('Google Drive Upload Error:', error);
      throw error;
    }
  }

//   To download Files
// async downloadFile(fileId: string, res: Response) {
async downloadFile(fileId: string, res: Response, inline = true) {
    try {
      // Get file metadata (name and MIME type)
      const fileMetadata = await this.driveClient.files.get({
        fileId,
        fields: 'name, mimeType',
      });

      const fileName = fileMetadata.data.name;
      const mimeType = fileMetadata.data.mimeType;

      // Stream the file content
      const response = await this.driveClient.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      // Set headers based on file type
      res.header('Content-Type', mimeType);
      res.header(
        'Content-Disposition',
        `${inline ? 'inline' : 'attachment'}; filename="${fileName}"`
      );
     
      // // Stream the file to response
      // return response.data.pipe(res);

      // Stream the file
    response.data
    .on('end', () => res.end())
    .on('error', (err: any) => {
      console.error('Streaming error:', err);
      res.status(500).send('Stream failed.');
    })
    .pipe(res);
    } catch (error) {
      console.error('Download error:', error?.message || error);
      throw new NotFoundException('File not found or inaccessible');
    }
  }

  async deleteFile(fileId: string): Promise<string> {
    try {
      await this.driveClient.files.delete({ fileId });
      return `File with ID ${fileId} deleted successfully.`;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
