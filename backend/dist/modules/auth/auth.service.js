"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("../users/schema/users.schema");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcryptjs"));
const user_interface_1 = require("../users/interfaces/user.interface");
let AuthService = class AuthService {
    constructor(jwtService, usersService, userModel) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.userModel = userModel;
    }
    async validateUser(phone, password) {
        console.log('Validating user with phone:', phone);
        const user = await this.usersService.findByPhoneNumber(phone);
        if (!user) {
            console.log('User not found!');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log('User found:', user);
        console.log('User password:', user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isPasswordValid);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    async login(user) {
        const payload = { sub: user._id, phone: user.phone, role: user.role };
        const token = this.jwtService.sign(payload);
        console.log('Generated Token:', token);
        return {
            access_token: token,
            user,
        };
    }
    async register(createUserDto) {
        const { name, email, password, phone } = createUserDto;
        const userExists = await this.userModel.findOne({ $or: [{ email }, { phone }] }).exec();
        if (userExists)
            throw new common_1.UnauthorizedException('User with this email or phone already exists');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            email,
            password: hashedPassword,
            name,
            phone,
            role: user_interface_1.UserRole.MEMBER,
            _id: new mongoose_2.Types.ObjectId(),
        });
        await user.save();
        return this.login(user);
    }
    async registerAdmin(adminData) {
        if (!adminData.password) {
            throw new common_1.BadRequestException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const admin = new this.userModel({
            ...adminData,
            role: user_interface_1.UserRole.ADMIN,
            password: hashedPassword,
            _id: new mongoose_2.Types.ObjectId(),
        });
        await admin.save();
        return this.login(admin);
    }
    async changePassword(userId, oldPassword, newPassword) {
        console.log('Changing password for user:', userId);
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        console.log('Password validation result:', isPasswordValid);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid old password');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        console.log('Password changed successfully!');
        return "Password changed successfully!";
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
        console.log('Refresh token cleared successfully!');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map