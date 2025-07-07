"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_schema_1 = require("./schema/notification.schema");
const notifications_service_1 = require("./notifications.service");
const notification_gateway_1 = require("./notification.gateway");
const notifications_controller_1 = require("./notifications.controller");
const songs_module_1 = require("../songs/songs.module");
const auth_module_1 = require("../auth/auth.module");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema }]),
            (0, common_1.forwardRef)(() => songs_module_1.SongModule),
            auth_module_1.AuthModule,
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService, notification_gateway_1.NotificationGateway],
        exports: [notifications_service_1.NotificationsService, notification_gateway_1.NotificationGateway],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map