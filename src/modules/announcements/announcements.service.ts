import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement } from './schema/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name) private announcementModel: Model<Announcement>,
  ) {}

  // Create a new announcement
  async createAnnouncement(createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = new this.announcementModel(createAnnouncementDto);
    return announcement.save();
  }

  // Get all announcements
  async getAnnouncements() {
    return this.announcementModel.find().sort({ publishedAt: -1 });
  }

  // Get a single announcement by ID
  async getAnnouncementById(id: string) {
    const announcement = await this.announcementModel.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }

  // Update an announcement
  async updateAnnouncement(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
    const updatedAnnouncement = await this.announcementModel.findByIdAndUpdate(
      id,
      updateAnnouncementDto,
      { new: true },
    );

    if (!updatedAnnouncement) throw new NotFoundException('Announcement not found');
    return updatedAnnouncement;
  }

  // Delete an announcement
  async deleteAnnouncement(id: string) {
    const deletedAnnouncement = await this.announcementModel.findByIdAndDelete(id);
    if (!deletedAnnouncement) throw new NotFoundException('Announcement not found');
    return deletedAnnouncement;
  }
}
