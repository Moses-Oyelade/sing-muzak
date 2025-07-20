import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';
export declare class NotificationGateway {
    private notificationsService;
    server: Server;
    constructor(notificationsService: NotificationsService);
    afterInit(client: any): void;
    sendNotification(userId: string, message: string): void;
    handleJoin(userId: string, client: any): void;
    broadcastNewSong(song: any): void;
    broadcastStatusUpdate(song: any): void;
    broadcastSongRemove(song: any): void;
}
