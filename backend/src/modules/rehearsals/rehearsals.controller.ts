import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req, Query, Header, Delete } from '@nestjs/common';
import { RehearsalService } from './rehearsals.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UpdateRehearsalDto } from './dto/update-rehearsal.dto';
import { CreateRehearsalDto } from './dto/create-rehearsal.dto';

@Controller('rehearsals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RehearsalController {
  constructor(private readonly rehearsalService: RehearsalService) {}

  // Admin schedules a new rehearsal
  @Roles('admin')
  @Post()
  async create(@Body() createRehearsalDto: CreateRehearsalDto) {
    return this.rehearsalService.scheduleRehearsal(createRehearsalDto);
  }

  // Get all rehearsals
  @Roles('admin', 'member')
  @Get()
  async getRehearsals() {
    return this.rehearsalService.getRehearsals();
  }

  // Member marks their own attendance
  @Roles('member')
  @Patch(':rehearsalId/attendance')
  async markAttendance(
    @Param('rehearsalId') rehearsalId: string,
    @Body('userId') userId: string,
  ) {
    return this.rehearsalService.markAttendance(rehearsalId, userId);
  }

  // Admin marks attendance for a member
  @Roles('admin')
  @Patch(':rehearsalId/attendance/admin')
  async markAttendanceForMember(
    @Param('rehearsalId') rehearsalId: string,
    @Body('adminId') adminId: string,
    @Body('memberId') memberId: string,
  ) {
    return this.rehearsalService.markAttendanceForMember(rehearsalId, memberId, adminId);
  }

  // Admin remove member mistakenly marked in attendance
  @Patch(':id/attendance/admin/remove')
  @Roles('admin')
  async removeAttendanceForMember(
    @Param('id') rehearsalId: string,
    @Body('memberId') memberId: string,
    @Req() req: any,
  ) {
    return this.rehearsalService.removeAttendanceForMember(
      rehearsalId,
      memberId,
      req.user.userId,
    );
  }


  // Admin gets attendance list
  @Roles('admin')
  @Get(':id/attendance')
  async getAttendance(@Param('id') rehearsalId: string) {
    return this.rehearsalService.getAttendance(rehearsalId);
  }

  // Admin gets attendance report for a specific rehearsal
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

  @Roles('admin', 'member')
  @Get(':id')
  async getRehearsalById(@Param('id') id: string) {
    const rehearsal = await this.rehearsalService.getRehearsalById(id);
    return { data: rehearsal }; // must return data in this shape
  }


  // Get attendance statistics for each rehearsal
  @Roles('admin')
  @Get(':id/attendance/stats')
  async getAttendanceStats(@Param('id') id: string) {
      return this.rehearsalService.getAttendanceStats(id);
  }

  // DELETE /rehearsals/:id
  @Delete(':id')
  async deleteRehearsal(@Param('id') id: string) {
    return this.rehearsalService.deleteRehearsal(id);
  }

  // PATCH /rehearsals/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRehearsalDto: UpdateRehearsalDto) {
    return this.rehearsalService.updateRehearsal(id, updateRehearsalDto);
  }

}
