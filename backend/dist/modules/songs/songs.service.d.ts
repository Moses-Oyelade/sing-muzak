import { Model, Types } from 'mongoose';
import { Song } from './schema/song.schema';
import { Suggestion } from './schema/suggestion.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
import { GoogleDriveService } from '../../google-drive/google-drive.service';
import { User } from '../users/schema/users.schema';
import { UpdateSongStatusDto } from './dto/update-song';
export declare class SongService {
    private categoryModel;
    private songModel;
    private suggestionModel;
    private userModel;
    private notificationService;
    private readonly notificationGateway;
    private readonly googleDriveService;
    constructor(categoryModel: Model<Category>, songModel: Model<Song>, suggestionModel: Model<Suggestion>, userModel: Model<User>, notificationService: NotificationsService, notificationGateway: NotificationGateway, googleDriveService: GoogleDriveService);
    suggestOrCreateSong(suggestSongDto: SuggestSongDto, userId: string): Promise<{
        message: string;
        existingSong: any;
        suggestion: import("mongoose").Document<unknown, {}, Suggestion> & Suggestion & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    uploadSong(createSongDto: CreateSongDto, files: {
        audio?: Express.Multer.File[];
        pdf?: Express.Multer.File[];
    }, userId: string): Promise<{
        message: string;
        newSong: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getAllSongs(status?: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAllSongsByCategory(category?: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSuggestions(): Promise<(import("mongoose").Document<unknown, {}, Suggestion> & Suggestion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    searchSongs(term: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<Song | null>;
    getSuggestionsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Suggestion> & Suggestion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateSongStatus(songId: string, updateSongStatusDto: UpdateSongStatusDto, adminId: any): Promise<{
        updatedStatus: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteSong(songId: string): Promise<string>;
    sync: any;
    findAll({ status, search, page, limit, category, }: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
        category?: string;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
    }>;
    downloadSongFile(songId: string, res: any, inline?: boolean): Promise<void>;
    removeSuggestion(suggestionId: string, userId: string): Promise<{
        message: string;
    }>;
}
