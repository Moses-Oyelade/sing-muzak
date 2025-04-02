import { Controller, Post, Body, UseGuards, Request, BadRequestException, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schema/users.schema';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{ access_token: string; user: any }> {
    try {
      const user = await this.authService.register(createUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: { phone: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.phone, loginDto.password);
    // return this.authService.login(user.phone, user.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('register-admin')
  async registerAdmin(@Body() adminData: Partial<User>) {
      return this.authService.registerAdmin(adminData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('protected-route')
  async testAuth(@Req() req: any) {
    console.log(req.user); // Check if the user is attached to the request
    return { message: 'Access granted!' };
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(refreshDto.userId, refreshDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const user = req.user;
    await this.authService.logout(user.sub);
    return { message: 'Logout successful' };
  }

}
