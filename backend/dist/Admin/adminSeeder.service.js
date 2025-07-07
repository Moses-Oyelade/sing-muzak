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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeederService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../modules/auth/auth.service");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../modules/users/users.service");
const user_interface_1 = require("../modules/users/interfaces/user.interface");
let AdminSeederService = class AdminSeederService {
    constructor(authService, configService, usersService) {
        this.authService = authService;
        this.configService = configService;
        this.usersService = usersService;
    }
    async onApplicationBootstrap() {
        const email = this.configService.get('ADMIN_EMAIL');
        const password = this.configService.get('ADMIN_PASSWORD');
        const phone = this.configService.get('PHONE');
        const admin = await this.usersService.getUserByField('phone', phone);
        if (!admin) {
            await this.authService.registerAdmin({
                email,
                password,
                phone,
                name: 'sing-muzak',
                roles: user_interface_1.UserRole.ADMIN,
            });
        }
        else {
            await this.usersService.updateUser(admin._id.toString(), {
                name: 'sing-muzak',
            });
        }
        console.log('********* WELCOME ADMIN *********');
    }
};
exports.AdminSeederService = AdminSeederService;
exports.AdminSeederService = AdminSeederService = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AdminSeederService);
//# sourceMappingURL=adminSeeder.service.js.map