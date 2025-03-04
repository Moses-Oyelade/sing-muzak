import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SongService } from './songs.service';
import { SongController } from './songs.controller';
import { Song, SongSchema } from './schema/song.schema';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { Notification, NotificationSchema } from '../notifications/schema/notification.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Song.name, schema: SongSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [SongController],
  providers: [SongService, JwtService, NotificationsService, NotificationGateway],
})
export class SongModule {}
