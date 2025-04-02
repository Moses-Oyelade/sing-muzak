import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schema/users.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: any;
    }>;
    login(loginDto: {
        phone: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(req: any): any;
    registerAdmin(adminData: Partial<User>): Promise<{
        access_token: string;
        user: any;
    }>;
    testAuth(req: any): Promise<{
        message: string;
    }>;
    refresh(refreshDto: {
        userId: string;
        refreshToken: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
