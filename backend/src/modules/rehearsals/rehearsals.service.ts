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
  async scheduleRehearsal(dto: CreateRehearsalDto, adminId: string) {
  const created = await this.rehearsalModel.create({
    ...dto,
    createdBy: adminId, 
  });

  return created.populate('createdBy'); // optionally return with admin info
}

  // Get all rehearsals
  async getRehearsals() {
    return await this.rehearsalModel.find().populate('attendees', 'name phone').sort({ createdAt: -1 }).exec();
  }

  // Member mark their own attendance
  async markAttendance(rehearsalId: string, userId: string) {
  const rehearsal = await this.rehearsalModel.findById(rehearsalId);
  if (!rehearsal) throw new NotFoundException('Rehearsal not found');

  const userObjectId = new Types.ObjectId(userId);

  // Correctly compare ObjectIds in attendees
  const alreadyMarked = rehearsal.attendees.some(
    (att) => att.toString() === userObjectId.toString()
  );

  if (alreadyMarked) {
    throw new ForbiddenException('Attendance already marked by you or an admin');
  }

  rehearsal.attendees.push(userObjectId);
  await rehearsal.save();

  const updatedRehearsal = await this.rehearsalModel.findById(rehearsalId).populate({
    path: 'attendees',
    select: '_id name voicePart email',
  });

  if (!updatedRehearsal) {
    throw new InternalServerErrorException('Failed to retrieve updated rehearsal');
  }

  return {
    message: 'Attendance marked successfully',
    rehearsalId: updatedRehearsal._id,
    attendees: updatedRehearsal.attendees,
  };
}


  // Admin marks attendance for members
  async markAttendanceForMembers(rehearsalId: string, attendees: string[], adminId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);

    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }

    // Convert to ObjectIds and filter out duplicates
    const newAttendees = attendees
      .map(id => new Types.ObjectId(id))
      .filter(objId => !rehearsal.attendees.some(existing => existing.equals(objId)));

    if (newAttendees.length > 0) {
      rehearsal.attendees.push(...newAttendees);
    }

    // Set createdBy only if it hasn't been set
    if (!rehearsal.createdBy) {
      rehearsal.createdBy = new Types.ObjectId(adminId);
    }

    await rehearsal.save();

    // Populate attendees with user details
    await rehearsal.populate([
      {
        path: 'attendees',
        select: '_id name voicePart email',
      },
      {
        path: 'createdBy',
        select: '_id name email',
      },
    ]);

    return {
      message: 'Members marked present successfully',
      rehearsalId: rehearsal._id,
      attendees: rehearsal.attendees,
      createdBy: rehearsal.createdBy,
    };
  }

  // Admin removes attendees that was mistakenly marked
  async removeAttendanceForMembers(rehearsalId: string, memberIds: string[]) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);
    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }

    const memberObjectIds = memberIds.map((id) => new Types.ObjectId(id));

    // Filter out attendees that match the provided member IDs
    rehearsal.attendees = rehearsal.attendees.filter(
      (att) => !memberObjectIds.some((id) => id.equals(att))
    );

    await rehearsal.save();

    await rehearsal.populate({
      path: 'attendees',
      select: '_id name voicePart email',
    });

    return {
      message: 'Selected member(s) removed from attendance',
      rehearsalId: rehearsal._id,
      attendees: rehearsal.attendees,
    };
  }



  // Admin gets attendance list
  async getAttendance(rehearsalId: string) {
    const rehearsal = await this.rehearsalModel.findById(new Types.ObjectId(rehearsalId)).populate({
    path: 'attendees',
    select: '_id name email voicePart',
  }).exec();
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
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
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

    // Flatten: one row per attendee per rehearsal
    const flattened = data.flatMap(rehearsal =>
      rehearsal.attendees.map(attendee => ({
        rehearsalId: rehearsal.rehearsalId,
        date: rehearsal.date,
        attendeeId: attendee.id,
        name: attendee.name,
        voicePart: attendee.voicePart
      }))
    );

    // Convert data to CSV format
    const fields = ['rehearsalId', 'date', 'attendeesId', 'name', 'voicePart'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flattened);

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
    const rehearsal = await this.rehearsalModel.findById(id).populate({
      path: 'attendees',
      select: '_id name email voicePart',
    });

    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }
      return rehearsal
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

  //*** Delete All ***
  async deleteAllRehearsals() {
    const result = await this.rehearsalModel.deleteMany({});
    return { message: `All ${result.deletedCount} rehearsals deleted` };
  }

  async findByIdWithAttendees(id: string): Promise<Rehearsal | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid rehearsal ID format');
    }

    const rehearsal = await this.rehearsalModel.findById(id).populate({
      path: 'attendees',
      select: '_id name voicePart email',
    });

    if (!rehearsal) {
      throw new NotFoundException('Rehearsal not found');
    }
    
    return  rehearsal
  }

}
