import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SongService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  // Suggest a song (Any authenticated user)
  @UseGuards(JwtAuthGuard)
  @Post('suggest')
  suggestSong(@Body() body, @Request() req) {
    return this.songService.suggestSong(body.title, body.artist, body.category, req.user.id);
  }

  // Get all songs (Admins can filter by status)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  getAllSongs(@Query('status') status?: string) {
    return this.songService.getAllSongs(status);
  }

  // Approve or postponed a song (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Patch(':id/status')
  updateSongStatus(@Param('id') id: string, @Body() body, @Request() req) {
    return this.songService.updateSongStatus(id, body.status, req.user.id);
  }
}
