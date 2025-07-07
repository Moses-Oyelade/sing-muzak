
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
import { Suggestion, SuggestionSchema } from './schema/suggestion.schema';
import { GoogleDriveModule } from '../../google-drive/google-drive.module';
import { User } from '../users/users.module';
import { UserSchema } from '../users/schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Song.name, schema: SongSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    GoogleDriveModule,
    forwardRef(() => NotificationsModule), // Fix circular dependency
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService], // Export services to prevent DI issues
})
export class SongModule {}
