import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Req() req) {
    return this.notificationService.getUserNotifications(req.user.userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }
}
