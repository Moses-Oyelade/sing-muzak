import { Controller, Post, Body, UseGuards, Request, BadRequestException, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schema/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    return this.authService.validateUser(loginDto.phone, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
  
  // @UseGuards(JwtAuthGuard)
  @Post('register-admin')
  async registerAdmin(@Body() adminData: Partial<User>) {
      return this.authService.registerAdmin(adminData);
  }

  @Get('protected-route')
  async testAuth(@Req() req: any) {
    console.log(req.user); // Check if the user is attached to the request
    return { message: 'You have access!' };
  }

}
