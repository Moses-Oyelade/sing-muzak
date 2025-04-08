import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
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
          // suggestedBy: song.suggestedBy.name,
          status: 'Pending', // You can add a 'pending' status for admin approval
          _id: new Types.ObjectId()
        });
  
        await song.save();
      }
    }
  
    // Save the suggestion entry
    const suggestion = new this.suggestionModel({
      song: song._id,
      suggestedBy: new Types.ObjectId(suggestedBy),
    });
  
    await suggestion.save();
  
    return {
      message: 'Song suggestion submitted successfully',
      song,
      suggestion,
    };
  }

  async uploadSong(
    createSongDto: CreateSongDto, 
    files: { audio?: Express.Multer.File[], pdf?: Express.Multer.File[] }, 
    userId: string
  ) {
    const { title, artist, category, uploadedBy } = createSongDto;
    
    // Basic field validation
    if (!title || !artist || !category) {
      throw new BadRequestException('Missing required fields');
    }

    // const existingSong = await this.songModel.findOne(createSongDto);
    const existingSong = await this.songModel.findOne({ title, artist });
    if (existingSong){
      throw new BadRequestException('Song already exist!');
    }

    const songCategory = await this.categoryModel.findOne({ name: category });
    if (!songCategory){
      throw new NotFoundException(`Category "${category}" does not exist.`);
    }

    // Upload audio if present
    let audioUrl: string | undefined;
    if (files?.audio?.[0]) {
      // Upload file to Google Drive
      const audioUpload = await this.googleDriveService.uploadFile(files.audio[0]);
      audioUrl = audioUpload.webViewLink; // Get the Google Drive URL
    }

    // Upload PDF if present
    let sheetMusicUrl: string | undefined;
    if (files?.pdf?.[0]) {
      // Upload file to Google Drive
      const pdfUpload = await this.googleDriveService.uploadFile(files.pdf[0]);
      sheetMusicUrl = pdfUpload.webViewLink; // Get the Google Drive URL
    }

    const newSong = new this.songModel({
      ...createSongDto,
      category: songCategory._id,
      uploadedBy: new Types.ObjectId(uploadedBy),
      suggestedBy: isValidObjectId(createSongDto.suggestedBy) ? new Types.ObjectId(createSongDto.suggestedBy) : null,
      audioUrl,
      sheetMusicUrl,
      status: 'Pending',
      _id: new Types.ObjectId(),
    });
    console.log('createSongDto:', createSongDto);
    console.log('suggestedBy valid:', isValidObjectId(createSongDto.suggestedBy));


    await newSong.save();
    this.notificationGateway.broadcastNewSong(newSong); // after saving new song
    
    // return `New Song ${newSong.title}`;
    return {
      message: 'Song uploaded successfully',
      newSong,
    };
  }
  

  // Get all songs (Admin can filter by status)
  async getAllSongs(status?: string) {
    const filter = status ? { status } : {};
    return this.songModel
      .find(filter)
      .populate('suggestedBy', 'name email');
  }

  // Get all songs (Admin can filter by category)
  async getAllSongsByCategory(category?: string) {
    const filter = category ? { category } : {};
    return this.songModel
      .find(filter);
      // .populate('category');
  }

  //Search songs by title, artist and category
  async searchSongs(term: string) {
    return this.songModel.find({
      $or: [
        { title: new RegExp(term, 'i') },
        { artist: new RegExp(term, 'i') },
        { category: new RegExp(term, 'i') },
      ],
    });
  }
  

  async findById(id: string): Promise<Song | null> {
    return this.songModel.findById(id).exec();
  }

  // Get Suggestions by User
  async getSuggestionsByUser(userId: string) {
    return this.songModel.find({ suggestedBy: userId });
  }

  // Approve or reject a song (Admin only)
  async updateSongStatus(songId: string, status: string, adminId: string) {
    if (!['Approved', 'Postponed'].includes(status)) {
      throw new ForbiddenException('Invalid status');
    }

    const song = await this.songModel.findById(songId);
    if (!song) throw new NotFoundException('Song not found!');

    const admin = await this.userModel.findById(adminId)
    if (!admin) throw new NotFoundException('User not found!');

    song.status = status;
    song.approvedBy = admin._id;
    // song.approvedBy = adminId;
    await song.save();

    this.notificationGateway.broadcastStatusUpdate(song); // after approving/postponing

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

  //songs with filters and pagination
  async getAllSongsWithFilters(
    page: number,
    limit: number,
    status?: string,
    categoryName?: string,
  ) {
    const filter: any = {};
  
    if (status) {
      filter.status = status;
    }
  
    if (categoryName) {
      const category = await this.categoryModel.findOne({ name: categoryName });
      if (category) {
        filter.category = category._id;
      } else {
        // No category match found
        return { data: [], total: 0 };
      }
    }
  
    const total = await this.songModel.countDocuments(filter);
    const songs = await this.songModel
      .find(filter)
      .populate('category', 'name')
      .populate('suggestedBy', 'fullName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // Latest first
  
    return {
      data: songs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
}
