import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import { AuthModule } from '../auth/auth.module';
import { Song, SongSchema } from '../songs/schema/song.schema';
import { Suggestion, SuggestionSchema } from '../songs/schema/suggestion.schema';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { GoogleDriveModule } from '../../google-drive/google-drive.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SongService } from '../songs/songs.service';
import { NotificationGateway } from '../notifications/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Song.name, schema: SongSchema },
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
   AuthModule,
   GoogleDriveModule,
   NotificationsModule,
  ],
  providers: [UsersService, SongService, NotificationGateway],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule], // Export UsersService for other modules
})
export class UsersModule {}

export { User };
