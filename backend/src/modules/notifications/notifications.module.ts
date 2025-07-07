import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationsController } from './notifications.controller';
// import { JwtService } from '@nestjs/jwt';
import { SongModule } from '../songs/songs.module'; // Import SongModule
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    forwardRef(() => SongModule), // ✅ Fix circular dependency
  AuthModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationGateway], // ✅ Ensure all services are here
  exports: [NotificationsService, NotificationGateway], // ✅ Export everything needed
})
export class NotificationsModule {}
