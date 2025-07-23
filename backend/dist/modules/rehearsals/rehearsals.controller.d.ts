import { RehearsalService } from './rehearsals.service';
import { UpdateRehearsalDto } from './dto/update-rehearsal.dto';
import { CreateRehearsalDto } from './dto/create-rehearsal.dto';
export declare class RehearsalController {
    private readonly rehearsalService;
    constructor(rehearsalService: RehearsalService);
    create(createRehearsalDto: CreateRehearsalDto): Promise<import("./schema/rehearsal.schema").Rehearsal>;
    getRehearsals(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/rehearsal.schema").RehearsalDocument, {}> & import("./schema/rehearsal.schema").Rehearsal & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markAttendance(rehearsalId: string, userId: string): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: import("mongoose").Types.ObjectId[];
    }>;
    markAttendanceForMember(rehearsalId: string, adminId: string, memberId: string): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: import("mongoose").Types.ObjectId[];
    }>;
    removeAttendanceForMember(rehearsalId: string, memberId: string, req: any): Promise<{
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
    getRehearsalById(id: string): Promise<{
        data: import("./schema/rehearsal.schema").Rehearsal;
    }>;
    getAttendanceStats(id: string): Promise<{
        rehearsalId: string;
        totalMembers: number;
        present: number;
        absent: number;
    }>;
    deleteRehearsal(id: string): Promise<{
        deleted: boolean;
    }>;
    update(id: string, updateRehearsalDto: UpdateRehearsalDto): Promise<import("./schema/rehearsal.schema").Rehearsal>;
}
