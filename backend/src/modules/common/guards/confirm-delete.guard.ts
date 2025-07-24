// src/common/guards/confirm-delete.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ConfirmDeleteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const confirmation = request.headers['x-confirm-delete'];

    const expectedHeader = process.env.DELETE_CONFIRM_PHRASE || 'CONFIRM_DELETE_ALL';

    if (confirmation !== expectedHeader) {
      throw new ForbiddenException('Delete confirmation header missing or invalid');
    }

    return true;
  }
}
