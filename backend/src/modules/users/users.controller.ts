import { Controller, Get, UseGuards, Request, Delete, Param, NotFoundException, Post, Body, BadRequestException, Query, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UsersService } from './users.service';
import { UserRole, VoicePart } from './interfaces/user.interface';
import { CreateUserFromAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/users.schema';
import { GetUser } from '../auth/get-user.decorator';


@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) { }
  
  // Only Admins can access this route
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  // @Get( )
  // getAllUsers(@Request() req: any) {
  //   return { message: 'Only admins can see this', user: req.user };
  // }

  // Only Admins can access this route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get( )
  async getAllUsers(): Promise<User[]> {
    try{
      const users = await this.userService.getAllUsers()
      return users;
    } catch (error){
      throw new BadRequestException(error.message);
      // return `Only admins can see this, ${message}`
    }
  };



  // Both Admins and Members can access
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'member')
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return { message: 'Profile Data', user: user };
  }
  
  // Filter to get voice-part, search and role
  @Get("/filter")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'member')
  async searchAll(
    @Query('voicePart') voicePart?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.userService.findAll({ voicePart, search, role, page, limit });
  } 


  // Find by Phone No.
  @Get('all-phone')
  async getAllPhoneNumbers() {
    const users = await this.userService.getAllPhoneNumbers();
    console.log(`all phones ${users}`)
    return users;
  }
  
  @Get('all-phone-names')
  async getAllPhoneNumbersOwners() {
    return this.userService.getAllPhoneNumbersOwners();
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
  @Roles('admin')
  @Get(':phoneNumber')
  async findByPhoneNumber(@Param('phone') phone: string): Promise<User> {
    const user = await this.userService.findByPhoneNumber(phone);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('createUser')
  async createUserFromAdmin(@Body() createUserFromAdminDto: CreateUserFromAdminDto): Promise<User> {
    return await this.userService.createUser(createUserFromAdminDto);
  }
  
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    if (updateData.voicePart){
      updateData.voicePart = updateData.voicePart as VoicePart;
    }
    if (updateData.role){
      updateData.role = updateData.role as UserRole;
    }
    return this.userService.updateUser(userId, updateData);
  }
  
  // To delete a user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':userId')
  async deleteFile(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

   
  
}


