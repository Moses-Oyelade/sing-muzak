import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SongModule } from './modules/songs/songs.module';
import { RehearsalModule } from './modules/rehearsals/rehearsals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { JwtStrategy } from './modules/auth/jwt/jwt.strategy';
import databaseConfig from '../config/database.config';
import { GoogleDriveModule } from './google-drive/google-drive.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // Loads database configuration
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string), // Connects to MongoDB
    AuthModule, // Handles authentication & JWT
    UsersModule, // Manages user profiles & roles
    SongModule, // Manages song catalog & uploads
    RehearsalModule, // Handles rehearsals & attendance
    NotificationsModule, // Manages notifications
    GoogleDriveModule, // Manages files saving and retrieval
  ],
  providers: [JwtStrategy], // Global JWT strategy
})
export class AppModule {}
