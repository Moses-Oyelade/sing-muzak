import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';
export declare class NotificationGateway {
    private notificationsService;
    server: Server;
    constructor(notificationsService: NotificationsService);
    sendNotification(userId: string, message: string): void;
    handleJoin(userId: string, client: any): void;
}
