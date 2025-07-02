import { User } from './schema/users.schema';
import { Model, Types } from 'mongoose';
import { CreateUserFromAdminDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    findByEmail(email: string): Promise<User | null>;
    findByPhoneNumber(phone: string): Promise<User | null>;
    getAllPhoneNumbers(): Promise<string[]>;
    getAllPhoneNumbersOwners(): Promise<{}>;
    findById(id: string): Promise<User | null>;
    updateUser(userId: string, updateData: Partial<User>): Promise<User>;
    getUserByField(field: keyof User, value: any): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    createUser(createUserFromAdminDto: CreateUserFromAdminDto): Promise<User>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    deleteUser(userId: string): Promise<string>;
    findAll({ voicePart, search, role, page, limit, }: {
        voicePart?: string;
        search?: string;
        role?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, User> & User & Required<{
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
