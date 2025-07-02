import { Types } from 'mongoose';
import { AbstractDocument } from 'src/modules/common/abstract.schema';
import { User } from 'src/modules/users/users.module';
export declare class Song extends AbstractDocument {
    title: string;
    artist: string;
    category: Types.ObjectId;
    status: string;
    uploadedBy: Types.ObjectId;
    suggestedBy: Types.ObjectId | null;
    audioUrl: string;
    sheetMusicUrl: string;
    approvedBy?: Types.ObjectId | User;
}
export declare const SongSchema: import("mongoose").Schema<Song, import("mongoose").Model<Song, any, any, any, import("mongoose").Document<unknown, any, Song> & Song & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Song, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Song>> & import("mongoose").FlatRecord<Song> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
