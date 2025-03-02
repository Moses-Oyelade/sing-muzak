import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument } from './schema/song.schema';

@Injectable()
export class SongService {
  constructor(@InjectModel(Song.name) private songModel: Model<SongDocument>) {}

  // Suggest a new song (Default: Pending)
  async suggestSong(title: string, artist: string, category: string, userId: string) {
    const newSong = new this.songModel({ title, artist, category, suggestedBy: userId });
    return await newSong.save();
  }

  // Get all songs (Admin can filter by status)
  async getAllSongs(status?: string) {
    const filter = status ? { status } : {};
    return this.songModel.find(filter);
  }

  // Approve or reject a song (Admin only)
  async updateSongStatus(songId: string, status: string, adminId: string) {
    if (!['Approved', 'Rejected'].includes(status)) {
      throw new ForbiddenException('Invalid status');
    }

    const song = await this.songModel.findById(songId);
    if (!song) throw new NotFoundException('Song not found');

    song.status = status;
    song.approvedBy = adminId;
    return song.save();
  }
}
