import { OnApplicationBootstrap } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
export declare class AdminSeederService implements OnApplicationBootstrap {
    private readonly authService;
    private readonly configService;
    private readonly usersService;
    constructor(authService: AuthService, configService: ConfigService, usersService: UsersService);
    onApplicationBootstrap(): Promise<void>;
}
