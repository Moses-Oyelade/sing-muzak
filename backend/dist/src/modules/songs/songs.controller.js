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
exports.SongController = void 0;
const common_1 = require("@nestjs/common");
const songs_service_1 = require("./songs.service");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const create_song_dto_1 = require("./dto/create-song.dto");
const platform_express_1 = require("@nestjs/platform-express");
const update_song_1 = require("./dto/update-song");
const mongoose_1 = require("mongoose");
let SongController = class SongController {
    constructor(songService) {
        this.songService = songService;
    }
    suggestSong(suggestSongDto, req) {
        const userId = req.user.sub;
        return this.songService.suggestOrCreateSong(suggestSongDto, userId);
    }
    CreateSong(file, createSongDto, req) {
        return this.songService.uploadSong(createSongDto, file, req.user.sub);
    }
    async findAll(search) {
        if (search) {
            return this.songService.searchSongs(search);
        }
        return this.songService.getAllSongs();
    }
    async searchAll(status, search, page = 1, limit = 10) {
        return this.songService.findAll({ status, search, page, limit });
    }
    getAllSongsByCategory(category) {
        return this.songService.getAllSongsByCategory(category);
    }
    getSongById(id) {
        const song = this.songService.findById(id);
        if (!song) {
            throw new common_1.NotFoundException(`Song not found`);
        }
        return song;
    }
    async getSuggestions() {
        return this.songService.getSuggestions();
    }
    async getMySuggestions(req) {
        console.log("🔥 Authenticated user:", req.user);
        try {
            const userId = req.user.sub;
            const suggestions = await this.songService.getSuggestionsByUser(userId);
            return suggestions;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    updateSongStatus(id, updateSongStatusDto, req) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid song ID format.');
        }
        const adminId = req.user.id;
        return this.songService.updateSongStatus(id, updateSongStatusDto, adminId);
    }
    async delete(songId) {
        return await this.songService.deleteSong(songId);
    }
};
exports.SongController = SongController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('suggest'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_song_dto_1.SuggestSongDto, Object]),
    __metadata("design:returntype", void 0)
], SongController.prototype, "suggestSong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'audio', maxCount: 1 },
        { name: 'pdf', maxCount: 1 }
    ])),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_song_dto_1.CreateSongDto, Object]),
    __metadata("design:returntype", void 0)
], SongController.prototype, "CreateSong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/filter"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "searchAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('category'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SongController.prototype, "getAllSongsByCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SongController.prototype, "getSongById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('suggestions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getSuggestions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, common_1.Get)('me/suggestions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getMySuggestions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_song_1.UpdateSongStatusDto, Object]),
    __metadata("design:returntype", void 0)
], SongController.prototype, "updateSongStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Delete)(':songId'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "delete", null);
exports.SongController = SongController = __decorate([
    (0, common_1.Controller)('songs'),
    __metadata("design:paramtypes", [songs_service_1.SongService])
], SongController);
//# sourceMappingURL=songs.controller.js.map