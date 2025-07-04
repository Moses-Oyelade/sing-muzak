import { UsersService } from './users.service';
import { CreateUserFromAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/users.schema';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getAllUsers(): Promise<User[]>;
    getProfile(user: User): {
        message: string;
        user: User;
    };
    searchAll(voicePart?: string, search?: string, role?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, User> & User & Required<{
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
    getAllPhoneNumbers(): Promise<string[]>;
    getAllPhoneNumbersOwners(): Promise<{}>;
    getUser(id: string): Promise<User>;
    findByPhoneNumber(phone: string): Promise<User>;
    createUserFromAdmin(createUserFromAdminDto: CreateUserFromAdminDto): Promise<User>;
    updateUser(userId: string, updateData: UpdateUserDto): Promise<User>;
    deleteFile(userId: string): Promise<string>;
}
