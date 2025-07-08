import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsController {
    private announcementsService;
    constructor(announcementsService: AnnouncementsService);
    createAnnouncement(createAnnouncementDto: CreateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/announcement.schema").Announcement, {}> & import("./schema/announcement.schema").Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllAnnouncements(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/announcement.schema").Announcement, {}> & import("./schema/announcement.schema").Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAnnouncement(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/announcement.schema").Announcement, {}> & import("./schema/announcement.schema").Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateAnnouncement(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/announcement.schema").Announcement, {}> & import("./schema/announcement.schema").Announcement & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteAnnouncement(id: string): Promise<string>;
}
