import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private notificationGateway: NotificationGateway,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);
    await notification.save();

    // Emit real-time notification
    this.notificationGateway.sendNotification(createNotificationDto.userId, createNotificationDto.message);

    return notification;
  }

  async getAllNotifications() {
    return this.notificationModel.find().sort({ createdAt: -1 });
  }

  async sendNotification(userId: string, message: string) {
    return await this.notificationModel.create({ userId, message });
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getNotificationById(id: string) {
    const notification = await this.notificationModel.findById(id);
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');

    notification.isRead = true;
    return notification.save();
  }

  async updateNotification(id: string, updateNotificationDto: UpdateNotificationDto) {
    const updatedNotification = await this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true });
    if (!updatedNotification) throw new NotFoundException('Notification not found');
    return updatedNotification;
  }

  async deleteNotification(id: string) {
    const notification = await this.notificationModel.findByIdAndDelete(id);
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  // *** Delete all notifications ***
  async deleteAllNotifications() {
    const result = await this.notificationModel.deleteMany({});
    return { message: `${result.deletedCount} notifications deleted` };
  }

}
