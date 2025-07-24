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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./schema/notification.schema");
const notification_gateway_1 = require("./notification.gateway");
let NotificationsService = class NotificationsService {
    constructor(notificationModel, notificationGateway) {
        this.notificationModel = notificationModel;
        this.notificationGateway = notificationGateway;
    }
    async createNotification(createNotificationDto) {
        const notification = new this.notificationModel(createNotificationDto);
        await notification.save();
        this.notificationGateway.sendNotification(createNotificationDto.userId, createNotificationDto.message);
        return notification;
    }
    async getAllNotifications() {
        return this.notificationModel.find().sort({ createdAt: -1 });
    }
    async sendNotification(userId, message) {
        return await this.notificationModel.create({ userId, message });
    }
    async getUserNotifications(userId) {
        return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
    }
    async getNotificationById(id) {
        const notification = await this.notificationModel.findById(id);
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        return notification;
    }
    async markAsRead(notificationId) {
        const notification = await this.notificationModel.findById(notificationId);
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        notification.isRead = true;
        return notification.save();
    }
    async updateNotification(id, updateNotificationDto) {
        const updatedNotification = await this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true });
        if (!updatedNotification)
            throw new common_1.NotFoundException('Notification not found');
        return updatedNotification;
    }
    async deleteNotification(id) {
        const notification = await this.notificationModel.findByIdAndDelete(id);
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        return notification;
    }
    async deleteAllNotifications() {
        const result = await this.notificationModel.deleteMany({});
        return { message: `${result.deletedCount} notifications deleted` };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notification_gateway_1.NotificationGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map