import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rehearsal, RehearsalDocument } from './schema/rehearsal.schema';
import { Parser } from 'json2csv';

@Injectable()
export class RehearsalService {
  constructor(@InjectModel(Rehearsal.name) private rehearsalModel: Model<RehearsalDocument>) {}

  // Admin schedules a new rehearsal
  async scheduleRehearsal(date: Date, time: string, location: string, agenda: string, adminId: string) {
    const newRehearsal = new this.rehearsalModel({
      date,
      time,
      location,
      agenda,
      createdBy: adminId,
      attendees: [],
    });
    return await newRehearsal.save();
  }

  // Get all rehearsals
  async getRehearsals() {
    return await this.rehearsalModel.find().populate('attendees', 'name email');
  }

  // Members mark attendance
  async markAttendance(rehearsalId: string, userId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');

    if (rehearsal.attendees.includes(userId)) {
      throw new ForbiddenException('Attendance already marked');
    }

    rehearsal.attendees.push(userId);
    return await rehearsal.save();
  }

//   Amin marks attendance for members
  async markAttendanceForMember(rehearsalId: string, memberId: string, adminId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');
  
    // Check if the member is already marked present
    if (rehearsal.attendees.includes(memberId)) {
      throw new ForbiddenException('Member already marked present');
    }
  
    rehearsal.attendees.push(memberId);
    return await rehearsal.save();
  }

  async removeAttendanceForMember(rehearsalId: string, memberId: string, adminId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId);
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');
  
    // Check if the member is marked present
    if (!rehearsal.attendees.includes(memberId)) {
      throw new ForbiddenException('Member is not marked present');
    }
  
    // Remove the member from the attendees list
    rehearsal.attendees = rehearsal.attendees.filter(id => id !== memberId);
    return await rehearsal.save();
  }
    
  // Admin gets attendance list
  async getAttendance(rehearsalId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId).populate('attendees', 'name email').exec();
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');

    return rehearsal.attendees;
  }

  async getAttendanceReport(rehearsalId: string) {
    const rehearsal = await this.rehearsalModel.findById(rehearsalId).populate('attendees', 'name role').exec();
    if (!rehearsal) throw new NotFoundException('Rehearsal not found');
  
    return {
      rehearsalId: rehearsal._id,
      date: rehearsal.date,
      attendees: rehearsal.attendees.map(member => ({
        id: member._id,
        name: member.name,
        role: member.role
      }))
    };
  } 
  
  async getAttendanceReportByDateRange(startDate: string, endDate: string) {
    const rehearsals = await this.rehearsalModel
      .find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
      .populate('attendees', 'name role').exec();
  
    return rehearsals.map(rehearsal => ({
      rehearsalId: rehearsal._id,
      date: rehearsal.date,
      attendees: rehearsal.attendees.map(member => ({
        id: member._id,
        name: member.name,
        role: member.role
      }))
    }));
  }

//   Admin gets CSV attendance files and can download
  async exportAttendanceReportToCSV(startDate: string, endDate: string) {
    const data = await this.getAttendanceReportByDateRange(startDate, endDate);

    // Convert data to CSV format
    const fields = ['rehearsalId', 'date', 'attendees.id', 'attendees.name', 'attendees.role'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    return csv;
  }

  async getAttendanceTrends(startDate: string, endDate: string) {
    const rehearsals = await this.rehearsalModel.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
  
    // Generate trend data
    const trends = rehearsals.map(rehearsal => ({
      date: rehearsal.date,
      totalAttendees: rehearsal.attendees.length
    }));
  
    return trends;
  }  

}
