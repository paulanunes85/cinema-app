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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.projectsService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.findById(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  archive(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.archive(id, user.id);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.getMembers(id, user.id);
  }

  @Get(':id/supervision')
  getSupervision(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.getSupervisionDashboard(id, user.id);
  }
}
