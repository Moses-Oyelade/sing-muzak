import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ConfirmDeleteGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
