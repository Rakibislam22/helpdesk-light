import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();
    const staffKey = request.headers['x-staff-key'];
    if (!staffKey || staffKey !== 'helpDesk-staff-key') {
      throw new ForbiddenException('Access denied. Invalid staff key.');
    }
    return true;
  }
}
