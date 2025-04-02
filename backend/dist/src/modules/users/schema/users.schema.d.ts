import { UserRole, VoicePart } from '../interfaces/user.interface';
import { AbstractDocument } from 'src/modules/common/abstract.schema';
export declare class User extends AbstractDocument {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    role: UserRole;
    voicePart: VoicePart;
    refreshToken?: string;
    validatePassword(password: string): Promise<boolean>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
