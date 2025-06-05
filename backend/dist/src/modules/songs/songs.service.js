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
    async suggestOrCreateSong(suggestSongDto, userId) {
        const { title, artist, suggestedBy, category, } = suggestSongDto;
        userId = suggestedBy;
        let existingSong;
        existingSong = await this.songModel.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            artist: { $regex: new RegExp(`^${artist}$`, 'i') },
        });
        const songCategory = await this.categoryModel.findOne({
            name: { $regex: new RegExp(`^${category}$`, 'i') },
        });
        if (!songCategory) {
            const newCategory = "Others";
            return newCategory;
        }
        if (existingSong) {
            if (existingSong.suggestedBy === userId) {
                throw new common_1.ConflictException('You have already suggested this song.');
            }
            else {
                existingSong.suggestedBy = new mongoose_2.Types.ObjectId(userId);
                await existingSong.save();
                return { message: 'Song already exists, suggestion recorded.', data: existingSong };
            }
        }
        else if (!existingSong && !songCategory) {
            const newCategory = 'Others';
            existingSong = new this.songModel({
                ...suggestSongDto,
                uploadedBy: new mongoose_2.Types.ObjectId(userId),
                suggestedBy: new mongoose_2.Types.ObjectId(userId),
                category: newCategory,
                status: 'Pending',
                _id: new mongoose_2.Types.ObjectId()
            });
        }
        else {
            existingSong = new this.songModel({
                ...suggestSongDto,
                uploadedBy: new mongoose_2.Types.ObjectId(userId),
                suggestedBy: new mongoose_2.Types.ObjectId(userId),
                category: category,
                status: 'Pending',
                _id: new mongoose_2.Types.ObjectId()
            });
            await existingSong.save();
        }
        const suggestion = new this.suggestionModel({
            song: existingSong._id,
            suggestedBy: userId,
        });
        await suggestion.save();
        this.notificationGateway.broadcastNewSong(suggestion);
        return {
            message: 'New song created and suggestion submitted successfully',
            existingSong,
            suggestion,
        };
    }
    async uploadSong(createSongDto, files, userId) {
        const { title, artist, category } = createSongDto;
        const uploadedBy = userId;
        if (!title || !artist || !category) {
            throw new common_1.BadRequestException('Missing required fields');
        }
        const existingSong = await this.songModel.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            artist: { $regex: new RegExp(`^${artist}$`, 'i') },
        });
        if (existingSong) {
            throw new common_1.BadRequestException('Song already exist!');
        }
        const songCategory = await this.categoryModel.findOne({ name: category });
        if (!songCategory) {
            throw new common_1.NotFoundException(`Category "${category}" does not exist.`);
        }
        let audioUrl;
        if (files?.audio?.[0]) {
            const audioUpload = await this.googleDriveService.uploadFile(files.audio[0]);
            audioUrl = audioUpload.webViewLink;
        }
        let sheetMusicUrl;
        if (files?.pdf?.[0]) {
            const pdfUpload = await this.googleDriveService.uploadFile(files.pdf[0]);
            sheetMusicUrl = pdfUpload.webViewLink;
        }
        const newSong = new this.songModel({
            ...createSongDto,
            category: songCategory.name,
            uploadedBy: new mongoose_2.Types.ObjectId(uploadedBy),
            suggestedBy: (0, mongoose_2.isValidObjectId)(createSongDto.suggestedBy) ? new mongoose_2.Types.ObjectId(createSongDto.suggestedBy) : null,
            audioUrl,
            sheetMusicUrl,
            status: 'Pending',
            _id: new mongoose_2.Types.ObjectId(),
        });
        console.log('createSongDto:', createSongDto);
        console.log('suggestedBy valid:', (0, mongoose_2.isValidObjectId)(createSongDto.suggestedBy));
        await newSong.save();
        this.notificationGateway.broadcastNewSong(newSong);
        return {
            message: 'Song uploaded successfully',
            newSong,
        };
    }
    async getAllSongs(status) {
        const filter = status ? { status } : {};
        return this.songModel
            .find(filter)
            .populate('suggestedBy', 'name email')
            .sort({ createdAt: -1 });
    }
    async getAllSongsByCategory(category) {
        const filter = category ? { category } : {};
        return this.songModel
            .find(filter);
    }
    async getSuggestions() {
        return this.suggestionModel
            .find()
            .populate('song', 'title artist')
            .sort({ createdAt: -1 });
    }
    async searchSongs(term) {
        return this.songModel.find({
            $or: [
                { title: new RegExp(term, 'i') },
                { artist: new RegExp(term, 'i') },
                { category: new RegExp(term, 'i') },
            ],
        });
    }
    async findById(id) {
        return await this.songModel.findById(id).exec();
    }
    async getSuggestionsByUser(userId) {
        const existingUser = await this.userModel.findById(userId);
        if (!existingUser) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const suggestedBy = await this.songModel
            .find({ suggestedBy: existingUser._id })
            .populate('suggestedBy')
            .sort({ createdAt: -1 }).exec();
        return suggestedBy;
    }
    async updateSongStatus(songId, updateSongStatusDto, adminId) {
        const { status } = updateSongStatusDto;
        if (!['Approved', 'Postponed'].includes(status)) {
            throw new common_1.ForbiddenException('Invalid status');
        }
        const song = await this.songModel.findById(songId);
        if (!song)
            throw new common_1.NotFoundException('Song not found!');
        song.status = status;
        song.approvedBy = adminId;
        await song.save();
        this.notificationGateway.broadcastStatusUpdate(song);
        const message = `Your song "${song.title}" has been ${status}.`;
        await this.notificationService.sendNotification(song.uploadedBy.toString(), message);
        this.notificationGateway.sendNotification(song.uploadedBy.toString(), message);
        return { updatedStatus: song };
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
    async findAll({ status, search, page = 1, limit = 10, category, }) {
        const query = this.songModel.find().populate("suggestedBy", "name");
        if (status && status !== 'All') {
            query.where('status').equals(status);
        }
        if (search) {
            query.where('title', new RegExp(search, 'i'));
        }
        if (category && category !== "All") {
            query.where("category").equals(category);
        }
        const totalItems = await query.clone().countDocuments();
        const songs = await query
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: songs,
            meta: {
                currentPage: page,
                totalPages,
                totalItems,
            },
        };
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