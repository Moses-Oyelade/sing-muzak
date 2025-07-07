import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationGateway } from './notification.gateway';
export declare class NotificationsService {
    private notificationModel;
    private notificationGateway;
    constructor(notificationModel: Model<Notification>, notificationGateway: NotificationGateway);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllNotifications(): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    sendNotification(userId: string, message: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getUserNotifications(userId: string): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getNotificationById(id: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateNotification(id: string, updateNotificationDto: UpdateNotificationDto): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteNotification(id: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
