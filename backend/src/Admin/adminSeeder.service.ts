import { Controller, Get, OnApplicationBootstrap, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt/jwt.guard';
import { RolesGuard } from '../modules/auth/roles/roles.guard';
import { Roles } from '../modules/auth/roles/roles.decorator';
import { AuthService } from 'src/modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/modules/users/interfaces/user.interface';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminSeederService implements OnApplicationBootstrap {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {}
  
    async onApplicationBootstrap() {
      const email = this.configService.get<string>('ADMIN_EMAIL');
      const password = this.configService.get('ADMIN_PASSWORD');
      const phone = this.configService.get('PHONE');
      const admin = await this.usersService.getUserByField('phone', phone);
      // const hashedPassword = await bcrypt.hash(password, 10);
      if (!admin) {
        await this.authService.registerAdmin(<any>{
            email,
            password,
            phone,
            name: 'sing-muzak',
            roles: UserRole.ADMIN,
            
        });
      } else {
        await this.usersService.updateUser(admin._id.toString(), {
            name: 'sing-muzak',
            
        });
      }
      console.log('********* WELCOME ADMIN *********')
  }

}