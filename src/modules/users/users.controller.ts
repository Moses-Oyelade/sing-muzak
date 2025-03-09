import { Controller, Get, UseGuards, Request, Delete, Param, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UsersService } from './users.service';
import { User, VoicePart } from './interfaces/user.interface';
import { CreateUserFromAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) { }
  
  // Only Admins can access this route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get( )
  getAllUsers(@Request() req: any) {
    return { message: 'Only admins can see this', user: req.user };
  }

  // Both Admins and Members can access
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Member')
  @Get('profile')
  getProfile(@Request() req: any) {
    return { message: 'Accessible to both Admin and Member', user: req.user };
  }
  
  // To delete a user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Delete(':userId')
  async deleteFile(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get(':phoneNumber')
  async findByPhoneNumber(@Param('phoneNumber') phoneNumber: string): Promise<User> {
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('createUser')
  async createUserFromAdmin(@Body() createUserFromAdminDto: CreateUserFromAdminDto): Promise<User> {
    return await this.userService.createUser(createUserFromAdminDto);
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    if (updateData.voicePart){
      updateData.voicePart = updateData.voicePart as VoicePart;
    }
    return this.userService.updateUser(userId, updateData);
  }
}


