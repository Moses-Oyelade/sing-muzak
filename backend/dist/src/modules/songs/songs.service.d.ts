import { Model, Types } from 'mongoose';
import { Song } from './schema/song.schema';
import { Suggestion } from './schema/suggestion.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
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
    suggestSong(suggestSongDto: SuggestSongDto): Promise<{
        message: string;
        song: any;
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
    searchSongs(term: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<Song | null>;
    getSuggestionsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: Types.ObjectId;
    }> & {
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
    findAll({ status, search, page, limit, }: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
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
}
