import { Document, Types } from 'mongoose';
export type RehearsalDocument = Rehearsal & Document;
export declare class Rehearsal {
    date: Date;
    time: string;
    location: string;
    agenda: string;
    attendees: Types.ObjectId[];
    createdBy: Types.ObjectId;
    description?: string;
}
export declare const RehearsalSchema: import("mongoose").Schema<Rehearsal, import("mongoose").Model<Rehearsal, any, any, any, Document<unknown, any, Rehearsal, any> & Rehearsal & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Rehearsal, Document<unknown, {}, import("mongoose").FlatRecord<Rehearsal>, {}> & import("mongoose").FlatRecord<Rehearsal> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
