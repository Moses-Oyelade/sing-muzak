import { Document, Types } from 'mongoose';
export type SuggestionDocument = Suggestion & Document;
export declare class Suggestion {
    song: Types.ObjectId;
    suggestedBy: Types.ObjectId;
}
export declare const SuggestionSchema: import("mongoose").Schema<Suggestion, import("mongoose").Model<Suggestion, any, any, any, Document<unknown, any, Suggestion> & Suggestion & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Suggestion, Document<unknown, {}, import("mongoose").FlatRecord<Suggestion>> & import("mongoose").FlatRecord<Suggestion> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
