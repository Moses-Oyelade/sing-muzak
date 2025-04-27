import { UsersService } from './users.service';
import { CreateUserFromAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/users.schema';
import { SongService } from '../songs/songs.service';
export declare class UsersController {
    private readonly userService;
    private readonly songService;
    constructor(userService: UsersService, songService: SongService);
    getAllUsers(): Promise<User[]>;
    getMySuggestions(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../songs/schema/song.schema").Song> & import("../songs/schema/song.schema").Song & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getProfile(user: User): {
        message: string;
        user: User;
    };
    getAllPhoneNumbers(): Promise<string[]>;
    getAllPhoneNumbersOwners(): Promise<{}>;
    getUser(id: string): Promise<User>;
    findByPhoneNumber(phone: string): Promise<User>;
    createUserFromAdmin(createUserFromAdminDto: CreateUserFromAdminDto): Promise<User>;
    updateUser(userId: string, updateData: UpdateUserDto): Promise<User>;
    deleteFile(userId: string): Promise<string>;
}
