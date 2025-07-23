import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rehearsal, RehearsalDocument } from './schema/rehearsal.schema';
import { Parser } from 'json2csv';
import { User } from '../users/schema/users.schema';
import { CreateRehearsalDto } from './dto/create-rehearsal.dto';
import { UpdateRehearsalDto } from './dto/update-rehearsal.dto';

@Injectable()
export class RehearsalService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Rehearsal.name) private readonly rehearsalModel: Model<RehearsalDocument>
) {}

  // Admin schedules a new rehearsal
  async scheduleRehearsal(createRehearsalDto: CreateRehearsalDto): Promise<Rehearsal> {
    const rehearsal = new this.rehearsalModel(createRehearsalDto);
    return await rehearsal.save();
  }

  // Get all rehearsals
  async getRehearsals() {
    return await this.rehearsalModel.find().populate('attendees', 'name phone').sort({ createdAt: -1 }).exec();
  }

  async markAttendance(rehearsalId: string, userId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);
    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    const alreadyMarked = rehearsal.attendees.some(attendee =>
      attendee.equals(userObjectId),
    );

    if (alreadyMarked) {
      throw new ForbiddenException('Attendance already marked');
    }

    rehearsal.attendees.push(userObjectId);
    await rehearsal.save();

    return {
      message: 'Attendance marked successfully',
      rehearsalId: rehearsal._id,
      attendees: rehearsal.attendees,
    };
  }
  
  // Admin marks attendance for members
  async markAttendanceForMember(rehearsalId: string, memberId: string, adminId) {
    const rehearsalObjectId = new Types.ObjectId(rehearsalId);
    const memberObjectId = new Types.ObjectId(memberId);
  
    const rehearsal = await this.rehearsalModel.findById(rehearsalObjectId);
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');
  
    // Check if member is already in attendees
    // if (rehearsal.attendees.some(attendee => attendee?.equals(memberObjectId))) {
    if (rehearsal.attendees.some(attendee => attendee.equals(memberObjectId))) {
      throw new ForbiddenException('Member already marked present');
    }
  
    rehearsal.attendees.push(memberObjectId);
    await rehearsal.save();

    return {
      message: 'Member marked present successfully',
      rehearsalId: rehearsal._id,
      attendees: rehearsal.attendees,
    };
  }
  

  // Admin removes attendance for members
  async removeAttendanceForMember(rehearsalId: string, memberId: string, adminId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);

    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }

    const memberObjectId = new Types.ObjectId(memberId);

    if (!rehearsal.attendees.some(att => att.equals(memberObjectId))) {
      throw new ForbiddenException('Member is not marked present');
    }

    rehearsal.attendees = rehearsal.attendees.filter(att => !att.equals(memberObjectId));
    await rehearsal.save();

    return {
      message: 'Member unmarked successfully',
      rehearsalId: rehearsal._id,
      attendees: rehearsal.attendees,
    };
  }


  // Admin gets attendance list
  async getAttendance(rehearsalId: string) {
    const rehearsal = await this.rehearsalModel.findById(new Types.ObjectId(rehearsalId)).populate('attendees', 'name phone').exec();
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');

    return rehearsal.attendees;
  }

  async getAttendanceReport(rehearsalId: string) {
    const rehearsal = await this.rehearsalModel
      .findById(rehearsalId)
      .populate({ path: 'attendees', select: 'name voicePart', model: 'User'}) // Ensure user fields are populated
      .exec();
  
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');
    

    const missingUsers = await this.userModel.find({
      _id: { $in: rehearsal.attendees },
    });
    
    if (missingUsers.length === 0) {
      console.warn('No matching users found for attendees!');
    }
    
    return {
      rehearsalId: rehearsal._id,
      date: rehearsal.date,
      attendees: rehearsal.attendees.map((member: any) => ({
        id: member._id,
        name: member.name || 'Unknown', // Default fallback if missing
        voicePart: member.voicePart || 'Not Specified',
      }))
    };
  }
  

  async getAttendanceReportByDateRange(startDate: string, endDate: string) {
    const rehearsals = await this.rehearsalModel
      .find({
        createdBy: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
      .populate('attendees', 'name voicePart').exec();

    return rehearsals.map(rehearsal => ({
      rehearsalId: rehearsal._id,
      date: rehearsal.date,
      attendees: rehearsal.attendees.map((member: any) => ({
        id: member._id,
        name: member.name,
        // role: member.role
        voicePart: member.voicePart
      }))
    }));
  }

  // Admin gets CSV attendance files and can download
  async exportAttendanceReportToCSV(startDate: string, endDate: string) {
    const data = await this.getAttendanceReportByDateRange(startDate, endDate);

    // Convert data to CSV format
    const fields = ['rehearsalId', 'date', 'attendees.id', 'attendees.name', 'attendees.voicePart'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    return csv;
  }

  async getAttendanceTrends(startDate: string, endDate: string) {
    const rehearsals = await this.rehearsalModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Generate trend data
    const trends = rehearsals.map(rehearsal => ({
      date: rehearsal.date,
      totalAttendees: rehearsal.attendees.length
    }));

    return trends;
  }

  // Get rehearsal by ID with optional attendee and creator details
  async getRehearsalById(id: string): Promise<Rehearsal> {
    const rehearsal = await this.rehearsalModel.findById(id).populate('attendees').populate('createdBy');
    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }
    return rehearsal;
  }

  // Get attendance statistics directly from the rehearsal document
  async getAttendanceStats(rehearsalId: string) {
    if (!Types.ObjectId.isValid(rehearsalId)) {
      throw new BadRequestException("Invalid rehearsal ID");
    }

    const rehearsalObjectId = new Types.ObjectId(rehearsalId);

    const rehearsal = await this.rehearsalModel.findById(rehearsalObjectId).lean();
      if (!rehearsal) {
        throw new NotFoundException('Rehearsal not found');
      }

    const totalMembers = await this.userModel.countDocuments({ role: 'member' });
    const present = rehearsal.attendees?.length ?? 0;
    const absent = totalMembers - present;

    return {
      rehearsalId,
      totalMembers,
      present,
      absent,
    };
  }

  // DELETE
  async deleteRehearsal(id: string): Promise<{ deleted: boolean }> {
    const res = await this.rehearsalModel.deleteOne({ _id: id });
    return { deleted: res.deletedCount > 0 };
  }

  // UPDATE
  async updateRehearsal(id: string, updateRehearsalDto: UpdateRehearsalDto): Promise<Rehearsal> {
    const updatedRehearsal = await this.rehearsalModel.findByIdAndUpdate(id, updateRehearsalDto, { new: true });
    if (!updatedRehearsal) {
        throw new NotFoundException('Rehearsal not found');
      }
    return updatedRehearsal;
  }


}
