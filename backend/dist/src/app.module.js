"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const songs_module_1 = require("./modules/songs/songs.module");
const rehearsals_module_1 = require("./modules/rehearsals/rehearsals.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const database_config_1 = require("../config/database.config");
const google_drive_module_1 = require("./google-drive/google-drive.module");
const announcements_module_1 = require("./modules/announcements/announcements.module");
const adminSeeder_service_1 = require("./Admin/adminSeeder.service");
const jwt_1 = require("@nestjs/jwt");
const categories_module_1 = require("./modules/category/categories.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            songs_module_1.SongModule,
            rehearsals_module_1.RehearsalModule,
            notifications_module_1.NotificationsModule,
            google_drive_module_1.GoogleDriveModule,
            announcements_module_1.AnnouncementsModule,
            categories_module_1.CategoriesModule
        ],
        providers: [adminSeeder_service_1.AdminSeederService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map