// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { SongService } from './songs.service';
// import { SongController } from './songs.controller';
// import { Song, SongSchema } from './schema/song.schema';
// import { Category, CategorySchema } from '../category/schema/category.schema';
// import { Notification, NotificationSchema } from '../notifications/schema/notification.schema';
// import { JwtService } from '@nestjs/jwt';
// import { NotificationsModule } from '../notifications/notifications.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Song.name, schema: SongSchema },
//       { name: Category.name, schema: CategorySchema },
//       { name: Notification.name, schema: NotificationSchema },
//     ]),
//     NotificationsModule,
//   ],
//   controllers: [SongController],
//   providers: [SongService, JwtService],
// })
// export class SongModule {}


import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SongService } from './songs.service';
import { SongController } from './songs.controller';
import { Song, SongSchema } from './schema/song.schema';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { Notification, NotificationSchema } from '../notifications/schema/notification.schema';
import { JwtService } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Song.name, schema: SongSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    AuthModule,
    forwardRef(() => NotificationsModule), // ✅ Fix circular dependency
  ],
  controllers: [SongController],
  providers: [SongService, JwtService],
  exports: [SongService], // ✅ Export services to prevent DI issues
})
export class SongModule {}
