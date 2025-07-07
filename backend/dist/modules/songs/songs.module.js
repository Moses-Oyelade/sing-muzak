"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const songs_service_1 = require("./songs.service");
const songs_controller_1 = require("./songs.controller");
const song_schema_1 = require("./schema/song.schema");
const category_schema_1 = require("../category/schema/category.schema");
const notification_schema_1 = require("../notifications/schema/notification.schema");
const notifications_module_1 = require("../notifications/notifications.module");
const auth_module_1 = require("../auth/auth.module");
const suggestion_schema_1 = require("./schema/suggestion.schema");
const google_drive_module_1 = require("../../google-drive/google-drive.module");
const users_module_1 = require("../users/users.module");
const users_schema_1 = require("../users/schema/users.schema");
let SongModule = class SongModule {
};
exports.SongModule = SongModule;
exports.SongModule = SongModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: song_schema_1.Song.name, schema: song_schema_1.SongSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                { name: suggestion_schema_1.Suggestion.name, schema: suggestion_schema_1.SuggestionSchema },
                { name: users_module_1.User.name, schema: users_schema_1.UserSchema },
            ]),
            auth_module_1.AuthModule,
            google_drive_module_1.GoogleDriveModule,
            (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule),
        ],
        controllers: [songs_controller_1.SongController],
        providers: [songs_service_1.SongService],
        exports: [songs_service_1.SongService],
    })
], SongModule);
//# sourceMappingURL=songs.module.js.map