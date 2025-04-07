// import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { NotificationsService } from './notifications.service';
// import { Injectable } from '@nestjs/common';

// @WebSocketGateway({ cors: true })
// @Injectable()
// export class NotificationGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(private notificationsService: NotificationsService) {}

//   sendNotification(userId: string, message: string) {
//     this.server.to(userId).emit('newNotification', { message });
//   }

//   @SubscribeMessage('join')
//   // handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
//   handleJoin(@MessageBody() userId: string, client: any) {
//     client.join(userId);
//     console.log(`User ${userId} joined their notification room.`);
//   }
// }

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

  sendNotification(userId: string, message: string) {
    // this.server.to(userId).emit('newNotification', message);
    this.server.emit(`Notification: ${userId}`, {message});
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, client: any) {
    client.join(userId);
  }

  broadcastNewSong(song: any) {
    this.server.emit('notification', {
      type: 'new_upload',
      songId: song._id,
      song,
    });
  }

  broadcastStatusUpdate(song: any) {
    this.server.emit('notification', {
      type: 'status_update',
      songId: song._id,
      status: song.status,
    });
  }
}


