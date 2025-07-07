import { SongService } from './songs.service';
import { Song } from './schema/song.schema';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
import { UpdateSongStatusDto } from './dto/update-song';
export declare class SongController {
    private readonly songService;
    constructor(songService: SongService);
    suggestSong(suggestSongDto: SuggestSongDto, req: any): Promise<{
        message: string;
        existingSong: any;
        suggestion: import("mongoose").Document<unknown, {}, import("./schema/suggestion.schema").Suggestion> & import("./schema/suggestion.schema").Suggestion & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    uploadSong(file: {
        audio?: Express.Multer.File[];
        pdf?: Express.Multer.File[];
    }, createSongDto: CreateSongDto, req: any): Promise<{
        message: string;
        newSong: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    findAll(search?: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    filterSongs(status?: string, search?: string, category?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
    }>;
    getAllSongsByCategory(category?: string): Promise<(import("mongoose").Document<unknown, {}, Song> & Song & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSongById(id: string): Promise<Song | null>;
    getSuggestions(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/suggestion.schema").Suggestion> & import("./schema/suggestion.schema").Suggestion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getMySuggestions(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schema/suggestion.schema").Suggestion> & import("./schema/suggestion.schema").Suggestion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateSongStatus(id: string, updateSongStatusDto: UpdateSongStatusDto, req: any): Promise<{
        updatedStatus: import("mongoose").Document<unknown, {}, Song> & Song & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    delete(songId: string): Promise<string>;
    downloadSong(songId: string, res: Response, inline?: string): Promise<void>;
    unsuggestSong(suggestionId: string, req: any): Promise<{
        message: string;
    }>;
}
