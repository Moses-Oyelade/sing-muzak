import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Roles('admin')
  @Post()
  createAnnouncement(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.createAnnouncement(createAnnouncementDto);
  }

  @Roles('admin', 'user')
  @Get()
  getAllAnnouncements() {
    return this.announcementsService.getAnnouncements();
  }

  @Roles('admin', 'user')
  @Get(':id')
  getAnnouncement(@Param('id') id: string) {
    return this.announcementsService.getAnnouncementById(id);
  }

  @Roles('admin')
  @Patch(':id')
  updateAnnouncement(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.announcementsService.updateAnnouncement(id, updateAnnouncementDto);
  }

  @Roles('admin')
  @Delete(':id')
  deleteAnnouncement(@Param('id') id: string) {
    return this.announcementsService.deleteAnnouncement(id);
  }
}
