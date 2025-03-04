import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ phone });
    if (user && (await user.validatePassword(pass))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    const userExists = await this.userModel.findOne({ email: userData.email });
    const userExists2 = await this.userModel.findOne({ phone: userData.phone });
    if (userExists || userExists2) throw new UnauthorizedException('User already exists');
    const user = new this.userModel(userData);
    await user.save();
    return this.login(user);
  }
}

