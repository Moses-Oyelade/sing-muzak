import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument } from './schema/song.schema';
import { Category, CategoryDocument } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';

@Injectable()
export class SongService {

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    private notificationService: NotificationsService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // Suggest a new song (Default: Pending)
  async suggestSong(title: string, artist: string, category: string, userId: string) {
    const existingCategory = await this.categoryModel.findOne({ name: category });
    if (!existingCategory) throw new NotFoundException('Category does not exist');
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
    if (!['Approved', 'Postponed'].includes(status)) {
      throw new ForbiddenException('Invalid status');
    }

    const song = await this.songModel.findById(songId);
    if (!song) throw new NotFoundException('Song not found');

    song.status = status;
    song.approvedBy = adminId;
    await song.save();

    // Send notification to the uploader
    await this.notificationService.sendNotification(
      song.uploadedBy,
      `Your song "${song.title}" has been ${status}.`
    );

    // // Store notification in database
    // await this.notificationService.sendNotification(song.uploadedBy, message);

    // // Send real-time notification via WebSocket
    // this.notificationGateway.sendNotification(song.uploadedBy, message);


    return song;
  }
  
}
