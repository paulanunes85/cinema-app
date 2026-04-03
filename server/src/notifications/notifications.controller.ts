import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @CurrentUser() user: { id: string },
    @Query('unread') unread?: string,
  ) {
    return this.notificationsService.findByUser(user.id, unread === 'true');
  }

  @Get('count')
  getUnreadCount(@CurrentUser() user: { id: string }) {
    return this.notificationsService.getUnreadCount(user.id).then((count) => ({ count }));
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAllAsRead(@CurrentUser() user: { id: string }) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
