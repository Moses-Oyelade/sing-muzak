import { RehearsalService } from './rehearsals.service';
import { UpdateRehearsalDto } from './dto/update-rehearsal.dto';
import { CreateRehearsalDto } from './dto/create-rehearsal.dto';
export declare class RehearsalController {
    private readonly rehearsalService;
    constructor(rehearsalService: RehearsalService);
    scheduleRehearsal(createRehearsalDto: CreateRehearsalDto, req: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("./schema/rehearsal.schema").RehearsalDocument, {}> & import("./schema/rehearsal.schema").Rehearsal & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, never>>;
    getRehearsals(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/rehearsal.schema").RehearsalDocument, {}> & import("./schema/rehearsal.schema").Rehearsal & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markAttendance(rehearsalId: string, req: any): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: import("mongoose").Types.ObjectId[];
    }>;
    markAttendanceForMembers(rehearsalId: string, attendees: string | string[], req: any): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: import("mongoose").Types.ObjectId[];
        createdBy: import("mongoose").Types.ObjectId;
    }>;
    removeAttendanceForMembers(rehearsalId: string, attendees: string[] | string, req: any): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: import("mongoose").Types.ObjectId[];
    }>;
    getAttendance(rehearsalId: string): Promise<import("mongoose").Types.ObjectId[]>;
    getAttendanceReport(rehearsalId: string): Promise<{
        rehearsalId: unknown;
        date: Date;
        attendees: {
            id: any;
            name: any;
            voicePart: any;
        }[];
    }>;
    getAttendanceReportByDateRange(startDate: string, endDate: string): Promise<{
        rehearsalId: unknown;
        date: Date;
        attendees: {
            id: any;
            name: any;
            voicePart: any;
        }[];
    }[]>;
    exportAttendanceReportToCSV(startDate: string, endDate: string): Promise<string>;
    getAttendanceTrends(startDate: string, endDate: string): Promise<{
        date: Date;
        totalAttendees: number;
    }[]>;
    getRehearsalById(id: string): Promise<import("./schema/rehearsal.schema").Rehearsal | null>;
    getAttendanceStats(id: string): Promise<{
        rehearsalId: string;
        totalMembers: number;
        present: number;
        absent: number;
    }>;
    deleteRehearsal(id: string): Promise<{
        deleted: boolean;
    }>;
    updateRehearsal(id: string, updateRehearsalDto: UpdateRehearsalDto): Promise<import("./schema/rehearsal.schema").Rehearsal>;
    deleteAllRehearsals(): Promise<{
        message: string;
    }>;
}
