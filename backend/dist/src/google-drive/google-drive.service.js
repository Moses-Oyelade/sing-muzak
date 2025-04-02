"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
const stream_1 = require("stream");
let GoogleDriveService = class GoogleDriveService {
    constructor(configService) {
        this.configService = configService;
        const auth = new googleapis_1.google.auth.JWT(this.configService.get('GOOGLE_DRIVE_CLIENT_EMAIL'), undefined, this.configService.get('GOOGLE_DRIVE_PRIVATE_KEY').replace(/\\n/g, '\n'), ['https://www.googleapis.com/auth/drive']);
        this.driveClient = googleapis_1.google.drive({ version: 'v3', auth });
    }
    async uploadFile(file) {
        try {
            const { originalname, mimetype, buffer } = file;
            const stream = new stream_1.Readable();
            stream.push(buffer);
            stream.push(null);
            const response = await this.driveClient.files.create({
                requestBody: {
                    name: originalname,
                    mimeType: mimetype,
                },
                media: {
                    mimeType: mimetype,
                    body: stream,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Google Drive Upload Error:', error);
            throw error;
        }
    }
    async downloadFile(fileId, res) {
        try {
            const fileMetadata = await this.driveClient.files.get({
                fileId,
                fields: 'name, mimeType',
            });
            const fileName = fileMetadata.data.name;
            const mimeType = fileMetadata.data.mimeType;
            const response = await this.driveClient.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
            res.setHeader('Content-Type', mimeType);
            if (mimeType === 'application/pdf') {
                res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            }
            else if (mimeType.startsWith('audio/') || mimeType.startsWith('video/')) {
                res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            }
            else {
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            }
            response.data.pipe(res);
        }
        catch (error) {
            throw new common_1.NotFoundException('File not found');
        }
    }
    async deleteFile(fileId) {
        try {
            await this.driveClient.files.delete({ fileId });
            return `File with ID ${fileId} deleted successfully.`;
        }
        catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
};
exports.GoogleDriveService = GoogleDriveService;
exports.GoogleDriveService = GoogleDriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleDriveService);
//# sourceMappingURL=google-drive.service.js.map