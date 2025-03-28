import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req, Query, Header } from '@nestjs/common';
import { RehearsalService } from './rehearsals.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('rehearsals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RehearsalController {
  constructor(private readonly rehearsalService: RehearsalService) {}

  // Admin schedules a new rehearsal
  @Roles('admin')
  @Post()
  async scheduleRehearsal(@Body() body: any, @Req() req: any) {
    return this.rehearsalService.scheduleRehearsal(body.date, body.time, body.location, body.agenda, req.user.userId);
  }

  // Get all rehearsals
  @Roles('admin', 'member')
  @Get()
  async getRehearsals() {
    return this.rehearsalService.getRehearsals();
  }

  // Members mark attendance
  @Roles('member')
  @Patch(':id/attendance')
  async markAttendance(@Param('id') rehearsalId: string, @Req() req: any) {
    return this.rehearsalService.markAttendance(rehearsalId, req.user.userId);
  }

  @Roles('admin')
  @Patch(':id/attendance/admin')
  async markAttendanceForMember(
    @Param('id') rehearsalId: string,
    @Body('memberId') memberId: string,
    @Req() req: any
  ) {
      return this.rehearsalService.markAttendanceForMember(rehearsalId, memberId, req.user.userId);
  }

  // Admin remove member mistakenly marked in attendance
  @Roles('admin')
  @Patch(':id/attendance/admin/remove')
  async removeAttendanceForMember(
    @Param('id') rehearsalId: string,
    @Body('memberId') memberId: string,
    @Req() req: any,
  ) {
      return this.rehearsalService.removeAttendanceForMember(rehearsalId, memberId, req.user.userId);
  }

  // Admin gets attendance list
  @Roles('admin')
  @Get(':id/attendance')
  async getAttendance(@Param('id') rehearsalId: string) {
    return this.rehearsalService.getAttendance(rehearsalId);
  }

  // Admin gets attendance report
  @Roles('admin')
  @Get(':id/attendance/report')
  async getAttendanceReport(@Param('id') rehearsalId: string) {
    return this.rehearsalService.getAttendanceReport(rehearsalId);
  }

//   Admin gets attendance report by Date range
  @Roles('admin')
  @Get('attendance/report')
  async getAttendanceReportByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
      return this.rehearsalService.getAttendanceReportByDateRange(startDate, endDate);
  }

  @Roles('admin')
  @Get('attendance/export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=attendance_report.csv')
  async exportAttendanceReportToCSV(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
      return this.rehearsalService.exportAttendanceReportToCSV(startDate, endDate);
  }

//   Admin get Attendance trends
  @Roles('admin')
  @Get('attendance/trends')
  async getAttendanceTrends(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
      return this.rehearsalService.getAttendanceTrends(startDate, endDate);
  }
}
