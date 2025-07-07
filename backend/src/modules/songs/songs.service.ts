import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Song } from './schema/song.schema';
import { Suggestion } from './schema/suggestion.schema';
import { Category } from '../category/schema/category.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../notifications/notification.gateway';
import { CreateSongDto, SuggestSongDto, } from './dto/create-song.dto';
import { GoogleDriveService } from '../../google-drive/google-drive.service';
import { User } from '../users/schema/users.schema';
import { UpdateSongStatusDto } from './dto/update-song';


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
  
  // To Suggest/Create a song
  async suggestOrCreateSong(suggestSongDto: SuggestSongDto, userId: string) {
  let { title, artist, category, songId } = suggestSongDto;

  // Ensure userId is present
  if (!userId) {
    throw new BadRequestException('User ID is required');
  }

  // Validate category or fallback to "Others"
  const existingCategory = await this.categoryModel.findOne({
    name: { $regex: new RegExp(`^${category}$`, 'i') },
  });

  if (!existingCategory) {
    category = 'Others';
  }

  // If songId is provided, try to fetch the song directly
  let existingSong;
  if (songId) {
    existingSong = await this.songModel.findById(songId);
    if (!existingSong) {
      throw new BadRequestException('Song not found with provided ID.');
    }

    // Already suggested by this user?
    if (existingSong.suggestedBy?.toString() === userId) {
      throw new ConflictException('You have already suggested this song.');
    }

    // Update suggestedBy
    existingSong.suggestedBy = new Types.ObjectId(userId);
    await existingSong.save();

    // Save to suggestions collection
    const suggestion = new this.suggestionModel({
      song: existingSong._id,
      suggestedBy: userId,
    });

    await suggestion.save();
    this.notificationGateway.broadcastNewSong(suggestion);

    return {
      message: 'Suggestion recorded for existing song.',
      existingSong,
      suggestion,
    };
  }

  // If no songId, search for existing song by title & artist
  if (!title || !artist) {
    throw new BadRequestException('Title and artist are required for new songs');
  }

  existingSong = await this.songModel.findOne({
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    artist: { $regex: new RegExp(`^${artist}$`, 'i') },
  });

  if (existingSong) {
    // Already suggested by this user?
    if (existingSong.suggestedBy?.toString() === userId) {
      throw new ConflictException('You have already suggested this song.');
    }

    // Update suggestion
    existingSong.suggestedBy = new Types.ObjectId(userId);
    await existingSong.save();

    const suggestion = new this.suggestionModel({
      song: existingSong._id,
      suggestedBy: userId,
    });

    await suggestion.save();
    this.notificationGateway.broadcastNewSong(suggestion);

    return {
      message: 'Song already exists. Suggestion recorded.',
      existingSong,
      suggestion,
    };
  }

  // Create new song (with a generated _id)
  const newSong = new this.songModel({
    _id: new Types.ObjectId(),
    title,
    artist,
    category,
    uploadedBy: new Types.ObjectId(userId),
    suggestedBy: new Types.ObjectId(userId),
    status: 'Pending',
  });

  await newSong.save();

  const suggestion = new this.suggestionModel({
    song: newSong._id,
    suggestedBy: userId,
  });

  await suggestion.save();
  this.notificationGateway.broadcastNewSong(suggestion);

  return {
    message: 'New song created and suggestion submitted successfully.',
    existingSong: newSong,
    suggestion,
  };
}


  // To Upload a song
  async uploadSong(
    createSongDto: CreateSongDto, 
    files: { audio?: Express.Multer.File[], pdf?: Express.Multer.File[] }, 
    userId: string
  ) {
    const { title, artist, category } = createSongDto;
    
    const uploadedBy = userId;
    // Basic field validation
    if (!title || !artist || !category) {
      throw new BadRequestException('Missing required fields');
    }
    // const existingSong = await this.songModel.findOne({ title, artist });
    const existingSong = await this.songModel.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      artist: { $regex: new RegExp(`^${artist}$`, 'i') },
     });
     
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
      category: songCategory.name,
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
      .populate('suggestedBy')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  // Get all songs (Admin can filter by category)
  async getAllSongsByCategory(category?: string) {
    const filter = category ? { category } : {};
    return this.songModel
      .find(filter);
      // .populate('category');
  }

  //Get suggestion
  async getSuggestions(){
    return this.suggestionModel
    .find()
    .populate('song', 'title artist uploadedBy')
    .sort({ createdAt: -1 });
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
    return await this.songModel.findById(id).exec();
  }
  
  //Get suggestions by User
  async getSuggestionsByUser(userId: string){

    const suggestion = await this.suggestionModel
      .find({ suggestedBy: userId })
      .populate('suggestedBy')
      .populate({
        path: 'song',
        match: { _id: { $ne: null } }
      })
      // .populate('song', 'title artist uploadedBy')
      .sort({ createdAt: -1 }).exec();
    return suggestion.filter(s => s.song !== null);
    // return suggestion
  }

  // Approve or Postpone a song (Admin only)
  async updateSongStatus(songId: string, updateSongStatusDto: UpdateSongStatusDto, adminId: any) {
    const { status } = updateSongStatusDto;

    if (!['Approved', 'Postponed'].includes(status)) {
      throw new ForbiddenException('Invalid status');
    }

    const song = await this.songModel.findById(songId);
    if (!song) throw new NotFoundException('Song not found!');

    song.status = status;
    song.approvedBy = adminId;

  
    await song.save();

    this.notificationGateway.broadcastStatusUpdate(song); // after approving/postponing

    const message = `Your song "${song.title}" has been ${status}.`
    
    // Send notification to the uploader
    await this.notificationService.sendNotification(
      song.uploadedBy.toString(),
      message
    );
    this.notificationGateway.sendNotification(song.uploadedBy.toString(), message);
    return { updatedStatus: song };
  }

  async deleteSong(songId: string): Promise<string> {
    try{
      await this.songModel.findByIdAndDelete( songId );
      await this.suggestionModel.deleteMany({ song: songId });
      return `song ${songId} deleted successfully.`;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  sync 

  // Songs with filter, status and pagination
  async findAll({
    status,
    search,
    page = 1,
    limit = 10,
    category,
  }: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    category?: string;
  }) {
    const query = this.songModel.find().populate("suggestedBy", "name");
  
    if (status && status !== 'All') {
      query.where('status').equals(status);
      // query.where('status', new RegExp(status, 'i'));
    }
  
    if (search) {
      query.where('title', new RegExp(search, 'i')); // Case-insensitive search
    }

    if (category && category !== "All") {
      query.where("category").equals(category);
    }

    const totalItems = await query.clone().countDocuments();
    const songs = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }) // Optional: most recent first
      
  
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      data: songs,
      meta: {
        currentPage: page,
        totalPages,
        totalItems,
      },
    };
  }
  
  //To Download Song File
  async downloadSongFile(songId: string, res: any, inline = true) {

    let fileId: string;
    const song = await this.songModel.findById(songId);
    if (!song || !song.audioUrl || !song.sheetMusicUrl) {
      throw new NotFoundException('Song or file not found');
    }

    fileId = song.sheetMusicUrl;
    fileId = song.audioUrl
  
    return this.googleDriveService.downloadFile(fileId, res, inline);
  }
  
//   // User Cancels own song Suggestion
//   async cancelUserSuggestion(songId: string, userId: string) {
//   const song = await this.songModel.findById(songId);
//   if (!song) throw new NotFoundException('Song not found');

//   if (!userId) throw new BadRequestException('User not authenticated');

//   if (!song.suggestedBy) {
//     return song; // nothing to cancel
//   }

//   if (song.suggestedBy?.toString() !== userId) {
//     throw new ForbiddenException('You cannot cancel another user’s suggestion.');
//   }

//   song.suggestedBy = null;
//   await song.save();


  
//   return {
//     message: 'Suggestion cancelled successfully',
//     song,
//   };
// }

// Removing song from suggestion list
async removeSuggestion(suggestionId: string, userId: string) {
  const suggestion = await this.suggestionModel.findById(suggestionId);

  if (!suggestion) {
    throw new NotFoundException('Suggestion not found');
  }

  if (suggestion.suggestedBy.toString() !== userId) {
    throw new ForbiddenException('You can only delete your own suggestion');
  }

  // Optionally remove the suggestedBy field from the song
  await this.songModel.updateOne(
    { _id: suggestion.song },
    { $unset: { suggestedBy: '' } }
  );

  await this.suggestionModel.findByIdAndDelete(suggestionId);

  return { message: 'Suggestion removed successfully' };
}


}
