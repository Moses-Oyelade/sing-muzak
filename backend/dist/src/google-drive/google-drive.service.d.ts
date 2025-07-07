import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class GoogleDriveService {
    private configService;
    private driveClient;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<any>;
    downloadFile(fileId: string, res: Response, inline?: boolean): Promise<void>;
    deleteFile(fileId: string): Promise<string>;
}
