import { Types } from 'mongoose';
export declare class AbstractDocument {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
