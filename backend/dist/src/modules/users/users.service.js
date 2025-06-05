"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_schema_1 = require("./schema/users.schema");
const mongoose_2 = require("mongoose");
const user_interface_1 = require("./interfaces/user.interface");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findByPhoneNumber(phone) {
        return this.userModel.findOne({ phone }).exec();
    }
    async getAllPhoneNumbers() {
        const users = await this.userModel.find().select('phone -_id');
        return users.map((user) => (user.name, user.phone));
    }
    async getAllPhoneNumbersOwners() {
        const users = await this.userModel.find().select('name phone -_id');
        const phoneBook = {};
        users.forEach(user => {
            phoneBook[user.name] = user.phone;
        });
        return phoneBook;
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async updateUser(userId, updateData) {
        if (updateData.voicePart) {
            updateData.voicePart = updateData.voicePart;
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async getUserByField(field, value) {
        const user = await this.userModel.findOne({ [field]: value }).exec();
        return user;
    }
    async getAllUsers() {
        return this.userModel.find().sort({ createdAt: -1 }).exec();
    }
    async createUser(createUserFromAdminDto) {
        const createdUser = new this.userModel({
            ...createUserFromAdminDto,
            role: user_interface_1.UserRole.MEMBER,
            _id: new mongoose_2.Types.ObjectId(),
        });
        return createdUser.save();
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.userModel.updateOne({ _id: userId }, { refreshToken }).exec();
    }
    async deleteUser(userId) {
        try {
            await this.userModel.findByIdAndDelete(userId);
            return `user ${userId} deleted successfully.`;
        }
        catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
    async findAll({ vocalPart, search, role, page = 1, limit = 10, }) {
        const query = this.userModel.find();
        if (vocalPart && vocalPart !== 'All') {
            query.where('status').equals(vocalPart);
        }
        if (search) {
            query.where('name', new RegExp(search, 'i'));
        }
        if (role && role !== "All") {
            query.where("category").equals(role);
        }
        const totalItems = await query.clone().countDocuments();
        const users = await query
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: users,
            meta: {
                currentPage: page,
                totalPages,
                totalItems,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map