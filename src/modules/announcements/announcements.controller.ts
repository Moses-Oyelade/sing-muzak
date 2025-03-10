import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  createAnnouncement(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.createAnnouncement(createAnnouncementDto);
  }

  @Get()
  getAllAnnouncements() {
    return this.announcementsService.getAnnouncements();
  }

  @Get(':id')
  getAnnouncement(@Param('id') id: string) {
    return this.announcementsService.getAnnouncementById(id);
  }

  @Patch(':id')
  updateAnnouncement(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.announcementsService.updateAnnouncement(id, updateAnnouncementDto);
  }

  @Delete(':id')
  deleteAnnouncement(@Param('id') id: string) {
    return this.announcementsService.deleteAnnouncement(id);
  }
}
