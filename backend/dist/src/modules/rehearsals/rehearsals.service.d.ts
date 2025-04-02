import { Model, Types } from 'mongoose';
import { Rehearsal, RehearsalDocument } from './schema/rehearsal.schema';
import { User } from '../users/schema/users.schema';
export declare class RehearsalService {
    private readonly userModel;
    private readonly rehearsalModel;
    constructor(userModel: Model<User>, rehearsalModel: Model<RehearsalDocument>);
    scheduleRehearsal(date: Date, time: string, location: string, agenda: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, RehearsalDocument> & Rehearsal & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getRehearsals(): Promise<(import("mongoose").Document<unknown, {}, RehearsalDocument> & Rehearsal & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markAttendance(rehearsalId: string, userId: string): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: Types.ObjectId[];
    }>;
    markAttendanceForMember(rehearsalId: string, memberId: string, adminId: string): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: Types.ObjectId[];
    }>;
    removeAttendanceForMember(rehearsalId: string, memberId: string, adminId: string): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: Types.ObjectId[];
    }>;
    getAttendance(rehearsalId: string): Promise<Types.ObjectId[]>;
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
