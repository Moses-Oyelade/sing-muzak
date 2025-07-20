import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllNotifications(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getUserNotifications(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getNotificationById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateNotification(id: string, updateNotificationDto: UpdateNotificationDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteNotification(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification, {}> & import("./schema/notification.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
