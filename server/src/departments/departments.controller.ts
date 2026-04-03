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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('projects/:projectId/departments')
  findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.departmentsService.findAllByProject(projectId, user.id);
  }

  @Post('projects/:projectId/departments')
  create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateDepartmentDto,
  ) {
    return this.departmentsService.create(projectId, user.id, dto);
  }

  @Get('departments/:id/progress')
  getProgress(@Param('id') id: string) {
    return this.departmentsService.getProgress(id);
  }

  @Patch('departments/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, user.id, dto);
  }

  @Delete('departments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.departmentsService.remove(id, user.id);
  }
}
