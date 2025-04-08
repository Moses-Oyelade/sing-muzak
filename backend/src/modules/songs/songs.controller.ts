import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request, Delete, NotFoundException, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { SongService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Song } from './schema/song.schema';
import { CreateSongDto, SuggestSongDto } from './dto/create-song.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  // Suggest a song (Any authenticated user)
  @UseGuards(JwtAuthGuard)
  @Post('suggest')
  suggestSong(@Body() suggestSongDto: SuggestSongDto) {
    return this.songService.suggestSong(suggestSongDto);
  }

  // Upload/Create a song (Any authenticated user)
  // @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'audio', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]))
  CreateSong(
    @UploadedFile() file: { audio?: Express.Multer.File[], pdf?: Express.Multer.File[] },
    @Body() createSongDto: CreateSongDto,
    @Req() req: any,
  ) {
    return this.songService.uploadSong(createSongDto, file, req.user.id);
  }

  // GET /songs?search=choir
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) {
      return this.songService.searchSongs(search);
    }
    return this.songService.getAllSongs();
  }

  // Get all songs (Admins can filter by status)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get()
  getAllSongs(@Query('status') status?: string) {
    return this.songService.getAllSongs(status);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Get()
  async getSongs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.songService.getAllSongsWithFilters(+page, +limit, status, category);
  }

  // Get all songs (Admins can filter by status)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('category')
  getAllSongsByCategory(@Query('category') category?: string) {
    return this.songService.getAllSongsByCategory(category);
  }
  
  // Get a song by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get(':id')
  getSongById(@Param('id') id: string) {
    const song = this.songService.findById(id);
    if (!song) {
      throw new NotFoundException(`Song not found`);
    }
    return song;
  }

  // Approve or postponed a song (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateSongStatus(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.songService.updateSongStatus(id, body.status, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':songId')
  async delete(@Param('id') songId: string) {
    return await this.songService.deleteSong(songId);
  }

}
