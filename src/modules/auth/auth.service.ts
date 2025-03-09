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
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(phone: string, pass: string) {
    const user = await this.usersService.findByPhoneNumber(phone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Use bcrypt to compare the password
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Convert user to object and exclude password
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }


  // Login handle/function
  async login(user: any) {
    const payload = { phone: user.phone, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user, // Includes full user data
    };
  }

  async register(createUserDto: CreateUserDto): Promise<{ access_token: string; user: any }> {
    const { name, email, password, phone } = createUserDto;

    // Check if user already exists
    const userExists = await this.userModel.findOne({ $or: [{ email }, { phone }] });
    if (userExists) throw new UnauthorizedException('User already exists');

    // Create new user and save
    const user = new this.userModel(createUserDto);
    await user.save();

    // Login the user after registration
    return this.login(user);
  }

  async registerAdmin(adminData: Partial<User>): Promise<{ access_token: string; user: any }> {
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
    await admin.save();
  
    // Login the user after registration
    return this.login(admin);
  }


  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return "Password changed successfully!";
  }

}
