import { Model, Types } from 'mongoose';
import { Song } from './schema/song.schema';
import { Suggestion } from './schema/suggestion.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { User } from '../users/schema/users.schema';
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
    createSong(createSongDto: CreateSongDto, file: Express.Multer.File, userId: string): Promise<{
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
    findById(id: string): Promise<Song | null>;
    updateSongStatus(songId: string, status: string, adminId: string): Promise<{
        song: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteSong(songId: string): Promise<string>;
}
