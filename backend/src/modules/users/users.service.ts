import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model, Types } from 'mongoose';
import { UserRole, VoicePart } from './interfaces/user.interface';
import { CreateUserFromAdminDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
      @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  
  async findByEmail(email: string): Promise<User| null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhoneNumber(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  // to check only all the phone numbers
  async getAllPhoneNumbers() {
    // const users = await this.userModel.find({}, { phone: 1, _id: 0 }).lean();
    const users = await this.userModel.find().select('phone -_id');
    return users.map((user: { name: string; phone: string }) => (user.name, user.phone))
  }
 
  // To check their names and phone numbers
  async getAllPhoneNumbersOwners() {
    const users = await this.userModel.find().select('name phone -_id'); 
    // Convert to key-value pair (name: phone)
    const phoneBook = {};
    users.forEach(user => {
      phoneBook[user.name] = user.phone;
    });
  
    return phoneBook;
  }
  

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    if (updateData.voicePart) {
      updateData.voicePart = updateData.voicePart as VoicePart;
    }
    
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
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async createUser(createUserFromAdminDto: CreateUserFromAdminDto): Promise<User> {
    const createdUser = new this.userModel({
      ...createUserFromAdminDto,
      role: UserRole.MEMBER,
      _id: new Types.ObjectId(),
    });
    return createdUser.save();
  }


  // Use for logging Out
  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { refreshToken }).exec();
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
