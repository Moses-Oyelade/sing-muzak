import { RehearsalService } from './rehearsals.service';
export declare class RehearsalController {
    private readonly rehearsalService;
    constructor(rehearsalService: RehearsalService);
    scheduleRehearsal(body: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schema/rehearsal.schema").RehearsalDocument, {}> & import("./schema/rehearsal.schema").Rehearsal & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
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
}
