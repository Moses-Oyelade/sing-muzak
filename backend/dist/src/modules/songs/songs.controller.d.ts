import { SongService } from './songs.service';
import { Song } from './schema/song.schema';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
export declare class SongController {
    private readonly songService;
    constructor(songService: SongService);
    suggestSong(suggestSongDto: SuggestSongDto): Promise<{
        message: string;
        song: any;
        suggestion: import("mongoose").Document<unknown, {}, import("./schema/suggestion.schema").Suggestion> & import("./schema/suggestion.schema").Suggestion & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    CreateSong(file: Express.Multer.File, createSongDto: CreateSongDto, req: any): Promise<{
        message: string;
        newSong: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getAllSongs(status?: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAllSongsByCategory(category?: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSongById(id: string): Promise<Song | null>;
    updateSongStatus(id: string, body: any, req: any): Promise<{
        song: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    delete(songId: string): Promise<string>;
}
