// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Notification, NotificationSchema } from './schema/notification.schema';
// import { NotificationsService } from './notifications.service';
// import { NotificationsController } from './notifications.controller';
// import { JwtService } from '@nestjs/jwt';
// import { NotificationGateway } from './notification.gateway';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
//   ],
//   // controllers: [NotificationsController],
//   // providers: [NotificationsService, JwtService, NotificationGateway],
//   providers: [NotificationsService, NotificationGateway],
//   exports: [NotificationsService, NotificationGateway], // Make sure to export it if used in other modules
// })
// export class NotificationsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationsController } from './notifications.controller';
import { JwtService } from '@nestjs/jwt';
import { SongModule } from '../songs/songs.module'; // Import SongModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    forwardRef(() => SongModule), // ✅ Fix circular dependency
  ],
  providers: [NotificationsService, NotificationGateway, JwtService], // ✅ Ensure all services are here
  exports: [NotificationsService, NotificationGateway], // ✅ Export everything needed
})
export class NotificationsModule {}
