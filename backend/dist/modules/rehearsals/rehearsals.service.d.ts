import { Model, Types } from 'mongoose';
import { Rehearsal, RehearsalDocument } from './schema/rehearsal.schema';
import { User } from '../users/schema/users.schema';
import { CreateRehearsalDto } from './dto/create-rehearsal.dto';
import { UpdateRehearsalDto } from './dto/update-rehearsal.dto';
export declare class RehearsalService {
    private readonly userModel;
    private readonly rehearsalModel;
    constructor(userModel: Model<User>, rehearsalModel: Model<RehearsalDocument>);
    scheduleRehearsal(createRehearsalDto: CreateRehearsalDto): Promise<Rehearsal>;
    getRehearsals(): Promise<(import("mongoose").Document<unknown, {}, RehearsalDocument, {}> & Rehearsal & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    markAttendance(rehearsalId: string, userId: string): Promise<{
        message: string;
        rehearsalId: unknown;
        attendees: Types.ObjectId[];
    }>;
    markAttendanceForMember(rehearsalId: string, memberId: string, adminId: any): Promise<{
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
    getRehearsalById(id: string): Promise<Rehearsal>;
    getAttendanceStats(rehearsalId: string): Promise<{
        rehearsalId: string;
        totalMembers: number;
        present: number;
        absent: number;
    }>;
    deleteRehearsal(id: string): Promise<{
        deleted: boolean;
    }>;
    updateRehearsal(id: string, updateRehearsalDto: UpdateRehearsalDto): Promise<Rehearsal>;
}
