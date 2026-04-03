import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.templatesService.findAll(projectId ?? null);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Post('projects/:projectId')
  create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateTemplateDto,
  ) {
    return this.templatesService.create(projectId, user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.templatesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.templatesService.remove(id, user.id);
  }
}
