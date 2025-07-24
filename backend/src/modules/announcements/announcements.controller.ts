import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { ConfirmDeleteGuard } from 'modules/common/guards/confirm-delete.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Roles('admin')
  @Post()
  async createAnnouncement(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.createAnnouncement(createAnnouncementDto);
  }

  @Roles('admin', 'member')
  @Get()
  async getAllAnnouncements() {
    return this.announcementsService.getAnnouncements();
  }

  @Roles('admin', 'member')
  @Get(':id')
  async getAnnouncement(@Param('id') id: string) {
    return this.announcementsService.getAnnouncementById(id);
  }

  @Roles('admin')
  @Patch(':id')
  async updateAnnouncement(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.announcementsService.updateAnnouncement(id, updateAnnouncementDto);
  }

  @Roles('admin')
  @Delete(':id')
  async deleteAnnouncement(@Param('id') id: string) {
    return this.announcementsService.deleteAnnouncement(id);
  }

  // *** Delete All ***
  @Delete("all")
  @Roles('admin')
  @UseGuards(ConfirmDeleteGuard)
  async deleteAllAnnouncements() {
    return this.announcementsService.deleteAllAnnouncements();
  }

}
