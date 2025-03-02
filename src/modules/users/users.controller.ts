import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('users')
export class UsersController {
  
  // Only Admins can access this route
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('all')
  getAllUsers(@Request() req) {
    return { message: 'Only admins can see this', user: req.user };
  }

  // Both Admins and Members can access
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Member')
  @Get('profile')
  getProfile(@Request() req) {
    return { message: 'Accessible to both Admin and Member', user: req.user };
  }
}
