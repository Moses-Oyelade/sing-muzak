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
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const notifications_service_1 = require("./notifications.service");
const common_1 = require("@nestjs/common");
let NotificationGateway = class NotificationGateway {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    sendNotification(userId, message) {
        this.server.emit(`Notification: ${userId}`, { message });
    }
    handleJoin(userId, client) {
        client.join(userId);
    }
    broadcastNewSong(song) {
        this.server.emit('notification', {
            type: 'new_upload',
            songId: song._id,
            song,
        });
    }
    broadcastStatusUpdate(song) {
        this.server.emit('notification', {
            type: 'status_update',
            songId: song._id,
            status: song.status,
        });
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleJoin", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*', }, }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map