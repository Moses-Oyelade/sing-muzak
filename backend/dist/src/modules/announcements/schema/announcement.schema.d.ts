import { Document } from 'mongoose';
export declare class Announcement extends Document {
    title: string;
    content: string;
    publishedAt: Date;
}
export declare const AnnouncementSchema: import("mongoose").Schema<Announcement, import("mongoose").Model<Announcement, any, any, any, Document<unknown, any, Announcement> & Announcement & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Announcement, Document<unknown, {}, import("mongoose").FlatRecord<Announcement>> & import("mongoose").FlatRecord<Announcement> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
