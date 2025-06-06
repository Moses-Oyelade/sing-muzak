import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles('admin')
  @Post()
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }
  
  @Roles('admin')
  @Get()
  async getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }
  
  @Roles('admin', 'user')
  @Get('user')
  async getUserNotifications(@Req() req: any) {
    return this.notificationsService.getUserNotifications(req.user.userId);
  }

  @Roles('admin', 'user')
  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationsService.getNotificationById(id);
  }

  @Roles('admin')
  @Patch(':id')
  async updateNotification(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.updateNotification(id, updateNotificationDto);
  }

  @Roles('admin', 'user')
  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId);
  }

  @Roles('admin', 'user')
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
