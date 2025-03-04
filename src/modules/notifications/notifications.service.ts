import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schema/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

//   async createNotification(data: any) {
//     const newNotification = new this.notificationModel(data);
//     return newNotification.save();  // To save in the database
//   }

  async sendNotification(userId: string, message: string) {
    return await this.notificationModel.create({ userId, message });
  }

//   async getUserNotifications(userId: string) {
//     return await this.notificationModel.find({ userId }).sort({ createdAt: -1 });
//   }

//   async markAsRead(notificationId: string) {
//     return await this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
//   }
  async getUserNotifications(userId: string) {
    return await this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');

    notification.isRead = true;
    return notification.save();
  }

}
