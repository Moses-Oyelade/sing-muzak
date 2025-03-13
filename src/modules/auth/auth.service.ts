import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../users/schema/users.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(phone: string, password: string) {
    console.log('Validating user with phone:', phone);
    
    const user = await this.usersService.findByPhoneNumber(phone);
    if (!user) {
      console.log('User not found!');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('User found:', user);

    // Use bcrypt to compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  // Login handle/function
  // async login(phone: string, password: string) {
  async login(user: any) {
    // const user = await this.validateUser(phone, password)
    const payload = { sub: user._id, phone: user.phone, role: user.role };
    
    const token = this.jwtService.sign(payload);
    console.log('Generated Token:', token)
    return {
      access_token: token,
      user, // Includes full user data
    };
  }

  async register(createUserDto: CreateUserDto): Promise<{ access_token: string; user: User }> {
    const { name, email, password, phone } = createUserDto;

    // Check if user already exists
    const userExists = await this.userModel.findOne({ $or: [{ email }, { phone }] });
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (userExists) {
      if (await userExists.validatePassword(password)) {
        throw new UnauthorizedException('User already exists');
      } else {
        userExists.email = email;
        userExists.password = hashedPassword;
        userExists.name = name;
      }
      await userExists.save();
    }
    
    // If the user does not exist, Create new user and save
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      phone,
      _id: new Types.ObjectId(),
    });
    await user.save();

    // Login the user after registration
    return this.login(user);
  }

  async registerAdmin(adminData: Partial<User>): Promise<{ access_token: string; user: User}> {
  // async registerAdmin(adminData: Partial<User>): Promise<User> {
    if (!adminData.password) {
      throw new BadRequestException('Password is required'); // Import BadRequestException from @nestjs/common
    }
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    // Create new user and save
    const admin = new this.userModel({
      ...adminData,
      role: UserRole.ADMIN,
      password: hashedPassword,
      _id: new Types.ObjectId(),
    });
    // return admin.save();
    await admin.save();
  
    // Login the user after registration
    return this.login(admin);
  }


  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    console.log('Changing password for user:', userId);
    
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log('Password changed successfully!');

    return "Password changed successfully!";
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new BadRequestException('Invalid token');

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new BadRequestException('Invalid token');

    const payload = { sub: user._id, phoneNumber: user.phone };

    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '60m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    console.log('New Tokens Generated:', { newAccessToken, newRefreshToken });
    
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.usersService.updateRefreshToken(user._id.toString(), hashedNewRefreshToken);

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    console.log('Refresh token cleared successfully!');
  }

}
