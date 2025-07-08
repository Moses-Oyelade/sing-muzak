import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../users/schema/users.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private userModel;
    constructor(jwtService: JwtService, usersService: UsersService, userModel: Model<User>);
    validateUser(phone: string, password: string): Promise<User>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: any;
    }>;
    registerAdmin(adminData: Partial<User>): Promise<{
        access_token: string;
        user: any;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<string>;
    logout(userId: string): Promise<void>;
}
