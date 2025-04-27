
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { Inject, forwardRef } from '@nestjs/common';

// @WebSocketGateway({ cors: true })
@WebSocketGateway({ cors: { origin: '*', }, })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(forwardRef(() => NotificationsService)) private notificationsService: NotificationsService) {} // Fix DI issue
  afterInit(client: any) {
    console.log('WebSocket Gateway initialized:', client.id);
  }

  sendNotification(userId: string, message: string) {
    // this.server.to(userId).emit('newNotification', message);
    this.server.emit(`Notification: ${userId}`, {message});
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, client: any) {
    client.join(userId);
  }

  broadcastNewSong(@MessageBody()  song: any) {
    this.server.emit('notification', {
      type: 'new_song',
      songId: song._id,
      song,
    });
  }

  broadcastStatusUpdate(@MessageBody() song: any) {
    this.server.emit('notification', {
      type: 'status_update',
      songId: song._id,
      status: song.status,
    });
  }
  
  // Handle song removal
  broadcastSongRemove(@MessageBody() song: any) {
    this.server.emit('notification', {
      type: 'song_removed',
      songId: song._id,
      song,
    });
  }
  
}


