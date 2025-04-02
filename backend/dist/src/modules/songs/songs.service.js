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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const song_schema_1 = require("./schema/song.schema");
const suggestion_schema_1 = require("./schema/suggestion.schema");
const category_schema_1 = require("../category/schema/category.schema");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_gateway_1 = require("../notifications/notification.gateway");
const google_drive_service_1 = require("../../google-drive/google-drive.service");
const users_schema_1 = require("../users/schema/users.schema");
let SongService = class SongService {
    constructor(categoryModel, songModel, suggestionModel, userModel, notificationService, notificationGateway, googleDriveService) {
        this.categoryModel = categoryModel;
        this.songModel = songModel;
        this.suggestionModel = suggestionModel;
        this.userModel = userModel;
        this.notificationService = notificationService;
        this.notificationGateway = notificationGateway;
        this.googleDriveService = googleDriveService;
    }
    async suggestSong(suggestSongDto) {
        const { title, artist, suggestedBy, songId } = suggestSongDto;
        let song;
        if (songId) {
            song = await this.songModel.findById(songId);
            if (!song) {
                throw new common_1.NotFoundException('Song not found');
            }
        }
        else {
            song = await this.songModel.findOne({ title, artist });
            if (!song) {
                song = new this.songModel({
                    ...suggestSongDto,
                    uploadedBy: new mongoose_2.Types.ObjectId(suggestedBy),
                    suggestedBy: new mongoose_2.Types.ObjectId(suggestedBy),
                    status: 'Pending',
                    _id: new mongoose_2.Types.ObjectId()
                });
                await song.save();
            }
        }
        const suggestion = new this.suggestionModel({
            song: song._id,
            suggestedBy,
        });
        await suggestion.save();
        return {
            message: 'Song suggestion submitted successfully',
            song,
            suggestion,
        };
    }
    async createSong(createSongDto, file, userId) {
        const { title, artist, category, uploadedBy } = createSongDto;
        let audioUrl;
        let sheetMusicUrl;
        const existingSong = await this.songModel.findOne({ title, artist });
        if (existingSong) {
            throw new common_1.BadRequestException('Song already exist!');
        }
        const songCategory = await this.categoryModel.findOne({ name: category });
        if (!songCategory) {
            throw new common_1.NotFoundException(`Category "${category}" does not exist.`);
        }
        if (file) {
            const uploadedFile = await this.googleDriveService.uploadFile(file);
            audioUrl = uploadedFile.webViewLink;
        }
        const newSong = new this.songModel({
            ...createSongDto,
            uploadedBy: new mongoose_2.Types.ObjectId(uploadedBy),
            suggestedBy: 'Not Assigned',
            category: songCategory._id,
            audioUrl: audioUrl,
            _id: new mongoose_2.Types.ObjectId(),
        });
        await newSong.save();
        return {
            message: 'Song uploaded successfully',
            newSong,
        };
    }
    async getAllSongs(status) {
        const filter = status ? { status } : {};
        return this.songModel.find(filter);
    }
    async getAllSongsByCategory(category) {
        const filter = category ? { category } : {};
        return this.songModel.find(filter);
    }
    async findById(id) {
        return this.songModel.findById(id).exec();
    }
    async updateSongStatus(songId, status, adminId) {
        if (!['Approved', 'Postponed'].includes(status)) {
            throw new common_1.ForbiddenException('Invalid status');
        }
        const song = await this.songModel.findById(songId);
        if (!song)
            throw new common_1.NotFoundException('Song not found!');
        song.status = status;
        song.approvedBy = adminId;
        await song.save();
        const message = `Your song "${song.title}" has been ${status}.`;
        await this.notificationService.sendNotification(song.uploadedBy.toString(), message);
        this.notificationGateway.sendNotification(song.uploadedBy.toString(), message);
        return { song };
    }
    async deleteSong(songId) {
        try {
            await this.songModel.findByIdAndDelete(songId);
            return `song ${songId} deleted successfully.`;
        }
        catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
};
exports.SongService = SongService;
exports.SongService = SongService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(song_schema_1.Song.name)),
    __param(2, (0, mongoose_1.InjectModel)(suggestion_schema_1.Suggestion.name)),
    __param(3, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService,
        notification_gateway_1.NotificationGateway,
        google_drive_service_1.GoogleDriveService])
], SongService);
//# sourceMappingURL=songs.service.js.map