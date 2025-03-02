import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SongModule } from './modules/songs/songs.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/choir-app'),
    AuthModule, 
    UsersModule, 
    SongModule, 
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './modules/auth/jwt.guard';
// import { RolesGuard } from './modules/auth/roles.guard';
import { CategoryModule } from './modules/category/category.module';

// @Module({
//   providers: [
//     {
//       provide: APP_GUARD,
//       useClass: JwtAuthGuard,
//     },
//     {
//       provide: APP_GUARD,
//       useClass: RolesGuard,
//     },
//   ],
// })
// export class AppModule {}
