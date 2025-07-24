import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req, Query, Header, Delete, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RehearsalService } from './rehearsals.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UpdateRehearsalDto } from './dto/update-rehearsal.dto';
import { CreateRehearsalDto } from './dto/create-rehearsal.dto';
import { ConfirmDeleteGuard } from '../common/guards/confirm-delete.guard';

@Controller('rehearsals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RehearsalController {
  constructor(private readonly rehearsalService: RehearsalService) {}

  // Admin schedules a new rehearsal
  @Roles('admin')
  @Post()
  async scheduleRehearsal(
    @Body() createRehearsalDto: CreateRehearsalDto,
    @Req() req: any,
    ) {
      const adminId = req.user.id;
      return this.rehearsalService.scheduleRehearsal(createRehearsalDto, adminId);
    }

  // Get all rehearsals
  @Roles('admin', 'member')
  @Get()
  async getRehearsals() {
    return this.rehearsalService.getRehearsals();
  }

  // Member marks their own attendance
  @Patch(':rehearsalId/attendance')
  @Roles('member')
  async markAttendance(
    @Param('rehearsalId') rehearsalId: string,
    @Req() req: any, // get user from session
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    return this.rehearsalService.markAttendance(rehearsalId, userId);
  }


  // Admin marks for members
  @Patch(':id/attendance/admin')
  @Roles('admin')
  async markAttendanceForMembers(
  @Param('id') rehearsalId: string,
  @Body('attendees') attendees: string | string[],
  @Req() req: any,
  ) {
    const adminId = req.user.sub;
    if (!adminId) throw new UnauthorizedException('Admin ID is missing from request');

    // Normalize attendees to array if a single string is provided
    const attendeesArray = Array.isArray(attendees) ? attendees : [attendees];

    return this.rehearsalService.markAttendanceForMembers(rehearsalId, attendeesArray, adminId);
  }


  // Admin updates attendance
  @Patch(':id/attendance/admin/remove')
  @Roles('admin')
  async removeAttendanceForMembers(
    @Param('id') rehearsalId: string,
    @Body('attendees') attendees: string[] | string, // accept string or array
    @Req() req: any,
  ) {
    const adminId = req.user?.sub;
    if (!adminId) {
      throw new UnauthorizedException('Admin ID is missing from request');
    }

    // Normalize to array
    const memberIds = Array.isArray(attendees) ? attendees : [attendees];

    if (memberIds.length === 0) {
      throw new BadRequestException('attendees must be a non-empty array');
    }

    return this.rehearsalService.removeAttendanceForMembers(rehearsalId, memberIds);
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

  // @Roles('admin', 'member')
  // @Get(':id')
  // async getRehearsalById(@Param('id') id: string) {
  //   const rehearsal = await this.rehearsalService.getRehearsalById(id);
  //   return { data: rehearsal }; // must return data in this shape
  // }

  @Roles('admin', 'member')
  @Get(':id')
  async getRehearsalById(@Param('id') id: string) {
    return  this.rehearsalService.findByIdWithAttendees(id);
   
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
  @Roles('admin')
  @Patch(':id')
  async updateRehearsal(@Param('id') id: string, @Body() updateRehearsalDto: UpdateRehearsalDto) {
    return this.rehearsalService.updateRehearsal(id, updateRehearsalDto);
  }

  // ***Delete All ***
  @Delete("all")
  @Roles('admin')
  @UseGuards(ConfirmDeleteGuard)
  async deleteAllRehearsals() {
    return this.rehearsalService.deleteAllRehearsals();
  }


}
