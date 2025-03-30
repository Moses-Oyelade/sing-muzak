import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request, Delete, NotFoundException } from '@nestjs/common';
import { SongService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Song } from './schema/song.schema';
import { SuggestSongDto } from './dto/create-song.dto';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  // Suggest a song (Any authenticated user)
  @UseGuards(JwtAuthGuard)
  @Post('suggest')
  suggestSong(@Body() suggestSongDto: SuggestSongDto) {
    return this.songService.suggestSong(suggestSongDto);
  }

  // Get all songs (Admins can filter by status)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  getAllSongs(@Query('status') status?: string) {
    return this.songService.getAllSongs(status);
  }

  // Get a song by id
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
  @Roles('Admin')
  @Patch(':id/status')
  updateSongStatus(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.songService.updateSongStatus(id, body.status, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Delete(':songId')
  async delete(@Param('id') songId: string) {
    return await this.songService.deleteSong(songId);
  }

}
