"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const mongoose_1 = require("@nestjs/mongoose");
const users_schema_1 = require("./schema/users.schema");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return users_schema_1.User; } });
const auth_module_1 = require("../auth/auth.module");
const song_schema_1 = require("../songs/schema/song.schema");
const suggestion_schema_1 = require("../songs/schema/suggestion.schema");
const category_schema_1 = require("../category/schema/category.schema");
const google_drive_module_1 = require("../../google-drive/google-drive.module");
const notifications_module_1 = require("../notifications/notifications.module");
const songs_service_1 = require("../songs/songs.service");
const notification_gateway_1 = require("../notifications/notification.gateway");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: users_schema_1.User.name, schema: users_schema_1.UserSchema },
                { name: song_schema_1.Song.name, schema: song_schema_1.SongSchema },
                { name: suggestion_schema_1.Suggestion.name, schema: suggestion_schema_1.SuggestionSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
            ]),
            auth_module_1.AuthModule,
            google_drive_module_1.GoogleDriveModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [users_service_1.UsersService, songs_service_1.SongService, notification_gateway_1.NotificationGateway],
        controllers: [users_controller_1.UsersController],
        exports: [users_service_1.UsersService, mongoose_1.MongooseModule],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map