import { Model } from 'mongoose';
import { Announcement } from './schema/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsService {
    private announcementModel;
    constructor(announcementModel: Model<Announcement>);
    createAnnouncement(createAnnouncementDto: CreateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, Announcement, {}> & Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAnnouncements(): Promise<(import("mongoose").Document<unknown, {}, Announcement, {}> & Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAnnouncementById(id: string): Promise<import("mongoose").Document<unknown, {}, Announcement, {}> & Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateAnnouncement(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, Announcement, {}> & Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteAnnouncement(id: string): Promise<string>;
}
