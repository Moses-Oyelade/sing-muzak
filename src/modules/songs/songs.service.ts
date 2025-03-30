import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Song } from './schema/song.schema';
import { Suggestion } from './schema/suggestion.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { SuggestSongDto } from './dto/create-song.dto';

@Injectable()
export class SongService {

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Song.name) private songModel: Model<Song>,
    @InjectModel(Suggestion.name) private suggestionModel: Model<Suggestion>,
    private notificationService: NotificationsService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // Suggest a new song (Default: Pending)
  // async suggestSong(title: string, artist: string, category: string, userId: string) {
  //   const existingCategory = await this.categoryModel.findOne({ name: category });
  //   if (!existingCategory) throw new NotFoundException('Category does not exist');
  //   const newSong = new this.songModel({ title, artist, category, suggestedBy: userId });
  //   return await newSong.save();
  // }

  async suggestSong(suggestSongDto: SuggestSongDto) {
    const { title, artist, suggestedBy, songId } = suggestSongDto;
  
    let song;
  
    if (songId) {
      // Check if song exists
      song = await this.songModel.findById(songId);
      if (!song) {
        throw new NotFoundException('Song not found');
      }
    } else {
      // Check if a song with the same title & artist exists
      song = await this.songModel.findOne({ title, artist });
  
      if (!song) {
        // If song does not exist, create it
        song = new this.songModel({
          title,
          artist,
          uploadedBy: suggestedBy, // Set the user who suggested as uploader
          suggestedBy: suggestedBy,
          status: 'pending' // You can add a 'pending' status for admin approval
        });
  
        await song.save();
      }
    }
  
    // Save the suggestion entry
    const suggestion = new this.suggestionModel({
      song: song._id,
      suggestedBy,
    });
  
    await suggestion.save();
  
    return {
      message: 'Song suggestion submitted successfully',
      song,
      suggestion,
    };
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
      song.uploadedBy.toString(),
      message
    );
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
