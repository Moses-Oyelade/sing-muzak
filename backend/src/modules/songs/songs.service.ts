import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Song } from './schema/song.schema';
import { Suggestion } from './schema/suggestion.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { CreateSongDto, SuggestSongDto, } from './dto/create-song.dto';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { User } from '../users/schema/users.schema';

@Injectable()
export class SongService {
  

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Song.name) private songModel: Model<Song>,
    @InjectModel(Suggestion.name) private suggestionModel: Model<Suggestion>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationService: NotificationsService,
    private readonly notificationGateway: NotificationGateway,
    private readonly googleDriveService: GoogleDriveService, //Inject Google drive service
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
  
    let song: any;
  
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
          ...suggestSongDto,
          uploadedBy: new Types.ObjectId(suggestedBy), // Set the user who suggested as uploader
          suggestedBy: new Types.ObjectId(suggestedBy),
          status: 'Pending', // You can add a 'pending' status for admin approval
          _id: new Types.ObjectId()
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

  async createSong(createSongDto: CreateSongDto, file: Express.Multer.File, userId: string) {

    const { title, artist, category, uploadedBy } = createSongDto;
    
    let audioUrl: any;
    let sheetMusicUrl: any;

    // const existingSong = await this.songModel.findOne(createSongDto);
    const existingSong = await this.songModel.findOne({ title, artist });
    if (existingSong){
      throw new BadRequestException('Song already exist!');
    }

    const songCategory = await this.categoryModel.findOne({ name: category });
    if (!songCategory){
      throw new NotFoundException(`Category "${category}" does not exist.`);
    }

    if (file) {
      // Upload file to Google Drive
      const uploadedFile = await this.googleDriveService.uploadFile(file);
      audioUrl = uploadedFile.webViewLink; // Get the Google Drive URL
    }

    const newSong = new this.songModel({
      ...createSongDto,
      uploadedBy: new Types.ObjectId(uploadedBy),
      suggestedBy: 'Not Assigned',
      category: songCategory._id,
      audioUrl: audioUrl,
      _id: new Types.ObjectId(),
    });

    await newSong.save();
    
    // return `New Song ${newSong.title}`;
    return {
      message: 'Song uploaded successfully',
      newSong,
    };
  }
  

  // Get all songs (Admin can filter by status)
  async getAllSongs(status?: string) {
    const filter = status ? { status } : {};
    return this.songModel.find(filter);
  }

  // Get all songs (Admin can filter by category)
  async getAllSongsByCategory(category?: string) {
    const filter = category ? { category } : {};
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
    if (!song) throw new NotFoundException('Song not found!');

    // const user = await this.userModel.findById(adminId)
    // if (!user) throw new NotFoundException('User not found!');

    song.status = status;
    // song.approvedBy = user._id;
    song.approvedBy = adminId;
    await song.save();

    const message = `Your song "${song.title}" has been ${status}.`
    
    // Send notification to the uploader
    await this.notificationService.sendNotification(
      song.uploadedBy.toString(),
      message
    );
    this.notificationGateway.sendNotification(song.uploadedBy.toString(), message);
    return { song };
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
