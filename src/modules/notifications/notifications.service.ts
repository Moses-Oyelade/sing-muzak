import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async sendNotification(userId: string, message: string) {
    return await this.notificationModel.create({ userId, message });
  }

  async getUserNotifications(userId: string) {
    return await this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string) {
    return await this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }
}
