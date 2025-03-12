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

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(forwardRef(() => NotificationsService)) private notificationsService: NotificationsService) {} // ✅ Fix DI issue

  sendNotification(userId: string, message: string) {
    this.server.to(userId).emit('newNotification', message);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, client: any) {
    client.join(userId);
  }
}


