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
    getAllPhoneNumbers(): Promise<string[]>;
    getAllPhoneNumbersOwners(): Promise<{}>;
    getUser(id: string): Promise<User>;
    findByPhoneNumber(phone: string): Promise<User>;
    createUserFromAdmin(createUserFromAdminDto: CreateUserFromAdminDto): Promise<User>;
    updateUser(userId: string, updateData: UpdateUserDto): Promise<User>;
    deleteFile(userId: string): Promise<string>;
}
