import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './schema/song.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';

@Injectable()
export class SongService {

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Song.name) private songModel: Model<Song>,
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

  async findById(id: string): Promise<Song | null> {
    return this.songModel.findById(id).exec();
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

    const message = `Your song "${song.title}" has been ${status}.`
    
    // Send notification to the uploader
    await this.notificationService.sendNotification(
      song.uploadedBy,
      message
    );

    // // Store notification in database
    // await this.notificationService.sendNotification(song.uploadedBy, message);

    // Send real-time notification via WebSocket
    this.notificationGateway.sendNotification(song.uploadedBy, message);
    return song;
  }

  async deleteSong(songId: string): Promise<string> {
    try{
      await this.songModel.findByIdAndDelete( songId );
      return `song ${songId} deleted successfully.`;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
  
}
