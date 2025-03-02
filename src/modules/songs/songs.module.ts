import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SongService } from './songs.service';
import { SongController } from './songs.controller';
import { Song, SongSchema } from './schema/song.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }])],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}
