import { GoogleDriveService } from './google-drive.service';
import { Response } from 'express';
export declare class GoogleDriveController {
    private readonly googleDriveService;
    constructor(googleDriveService: GoogleDriveService);
    uploadFile(file: Express.Multer.File): Promise<any>;
    streamfile(fileId: string, res: Response): Promise<void>;
    downloadFile(fileId: string, res: Response): Promise<void>;
    deleteFile(fileId: string): Promise<string>;
}
