import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request, Delete, NotFoundException, UseInterceptors, UploadedFile, Req, BadRequestException, Res } from '@nestjs/common';
import { SongService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Song } from './schema/song.schema';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateSongStatusDto } from './dto/update-song';
import { isValidObjectId } from 'mongoose';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  // Suggest a song (Any authenticated user)
  @UseGuards(JwtAuthGuard)
  @Post('suggest')
  suggestSong(
    @Body() suggestSongDto: SuggestSongDto,
    @Request() req: any
  ) {
    const userId = req.user.sub
    return this.songService.suggestOrCreateSong(suggestSongDto, userId);
  }

  //Unsuggest a song (Any authenticated user)
  @Post('unsuggest')
  @UseGuards(JwtAuthGuard)
  async unsuggestSong(
    @Body() body: { songId: string }, 
    @Request() req: any
  ) {
    return this.songService.unsuggestSong(body.songId, req.user._id);
  }

  // Upload/Create a song (Any authenticated user)
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'audio', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]))
  uploadSong(
    @UploadedFile() file: { audio?: Express.Multer.File[], pdf?: Express.Multer.File[] },
    @Body() createSongDto: CreateSongDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub
    return this.songService.uploadSong(createSongDto, file, userId);
  }

  // GET /songs?search=choir
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'member')
  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) {
      return this.songService.searchSongs(search);
    }
    return this.songService.getAllSongs();
  }

@Get("/filter")
async filterSongs(
  @Query('status') status?: string,
  @Query('search') search?: string,
  @Query('category') category?: string,
  @Query('page') page = 1,
  @Query('limit') limit = 10
) {
  try {
    console.log({ status, search, category, page, limit });
    return await this.songService.findAll({ status, search, category, page, limit });
  } catch (err) {
    console.error("FILTER ERROR:", err);
    throw new BadRequestException("Invalid query parameters");
  }
}

  // Get all songs (Admins can filter by category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('category')
  getAllSongsByCategory(@Query('category') category?: string) {
    return this.songService.getAllSongsByCategory(category);
  }
  
  // Get a song by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'member')
  @Get(':id')
  getSongById(@Param('id') id: string) {
    const song = this.songService.findById(id);
    if (!song) {
      throw new NotFoundException(`Song not found`);
    }
    return song;
  }

  //Get Suggestions
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('suggestions')
  async getSuggestions(){
    return this.songService.getSuggestions()
  }

  //Get User's Song Suggestions
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'member')
  @Get( 'me/suggestions')
  async getMySuggestions(@Request() req: any ) {
    console.log("🔥 Authenticated user:", req.user);
    try{
        // const userId = req.user.userId
        const userId = req.user.sub
        const suggestions = await this.songService.getSuggestionsByUser(userId);
        return suggestions;
    } catch (error){
      throw new BadRequestException(error.message);
      // return `Only admins can see this, ${message}`
    }
  }

  // Approve or postponed a song (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  updateSongStatus(
    @Param('id') id: string, 
    @Body() updateSongStatusDto: UpdateSongStatusDto, 
    @Request() req: any
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid song ID format.');
    }
    const adminId = req.user.id
    return this.songService.updateSongStatus(id, updateSongStatusDto, adminId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':songId')
  async delete(@Param('id') songId: string) {
    return await this.songService.deleteSong(songId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async downloadSong(
    @Param('id') songId: string,
    @Res() res: Response,
    @Query('inline') inline?: string,
  ) {
    const displayInline = inline === 'false' ? false : true; // defaults to true
    return this.songService.downloadSongFile(songId, res, displayInline);
  }

}

