import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model, Types } from 'mongoose';
import { UserRole } from './interfaces/user.interface';
import { CreateUserFromAdminDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
      @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async getUserByField(field: keyof User, value: any): Promise<User | null> {
    const user = await this.userModel.findOne({ [field]: value }).exec();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    // console.log('Querying users...');
    return this.userModel.find().exec();
  }

  async createUser(createUserFromAdminDto: CreateUserFromAdminDto): Promise<User> {
    const createdUser = new this.userModel({
      ...createUserFromAdminDto,
      role: UserRole.MEMBER,
      _id: new Types.ObjectId(),
    });
    return createdUser.save();
  }


  async deleteUser(userId: string): Promise<string> {
    try {
      await this.userModel.findByIdAndDelete( userId );
      return `user ${userId} deleted successfully.`;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

}
