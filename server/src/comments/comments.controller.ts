import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, ReactionDto } from './dto/comment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('objectives/:objectiveId/comments')
  create(
    @Param('objectiveId') objectiveId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(objectiveId, user.id, dto);
  }

  @Get('objectives/:objectiveId/comments')
  findAll(@Param('objectiveId') objectiveId: string) {
    return this.commentsService.findByObjective(objectiveId);
  }

  @Patch('comments/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, user.id, dto);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.commentsService.remove(id, user.id);
  }

  @Post('comments/:id/reactions')
  addReaction(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: ReactionDto,
  ) {
    return this.commentsService.addReaction(id, user.id, dto.emoji);
  }

  @Delete('comments/:id/reactions/:emoji')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReaction(
    @Param('id') id: string,
    @Param('emoji') emoji: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.commentsService.removeReaction(id, user.id, emoji);
  }
}
