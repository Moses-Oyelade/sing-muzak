import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/users.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

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

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user and save
    // const user = new this.userModel({ name, email, phone, password: hashedPassword });
    const user = new this.userModel(createUserDto);
    await user.save();

    // Login the user after registration
    return this.login(user);
  }
}
