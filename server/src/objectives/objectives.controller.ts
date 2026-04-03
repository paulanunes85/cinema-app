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
import { ObjectivesService } from './objectives.service';
import {
  CreateObjectiveDto,
  UpdateObjectiveDto,
  UpdateStatusDto,
  ShareDepartmentDto,
} from './dto/objective.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class CreateDecisionDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  authorName!: string;
}

@Controller()
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  // ─── CRUD ───

  @Post('departments/:departmentId/objectives')
  create(
    @Param('departmentId') departmentId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateObjectiveDto,
  ) {
    return this.objectivesService.create(departmentId, user.id, dto);
  }

  @Get('departments/:departmentId/objectives')
  findByDept(
    @Param('departmentId') departmentId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.objectivesService.findByDepartment(departmentId, user.id);
  }

  @Get('objectives/:id')
  findOne(@Param('id') id: string) {
    return this.objectivesService.findById(id);
  }

  @Patch('objectives/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateObjectiveDto,
  ) {
    return this.objectivesService.update(id, user.id, dto);
  }

  @Delete('objectives/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.objectivesService.remove(id, user.id);
  }

  // ─── Status ───

  @Patch('objectives/:id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateStatusDto,
  ) {
    return this.objectivesService.updateStatus(id, user.id, dto);
  }

  // ─── Collaborators ───

  @Post('objectives/:id/collaborators')
  join(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.objectivesService.joinObjective(id, user.id);
  }

  @Delete('objectives/:id/collaborators')
  @HttpCode(HttpStatus.NO_CONTENT)
  leave(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.objectivesService.leaveObjective(id, user.id);
  }

  // ─── Cross-Department Sharing ───

  @Post('objectives/:id/departments')
  share(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: ShareDepartmentDto,
  ) {
    return this.objectivesService.shareToDepartments(id, user.id, dto);
  }

  @Delete('objectives/:id/departments/:departmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unshare(
    @Param('id') id: string,
    @Param('departmentId') departmentId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.objectivesService.unshareDepartment(id, departmentId, user.id);
  }

  // ─── Decisions ───

  @Post('objectives/:id/decisions')
  addDecision(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateDecisionDto,
  ) {
    return this.objectivesService.addDecision(id, user.id, dto.content);
  }

  @Get('objectives/:id/decisions')
  getDecisions(@Param('id') id: string) {
    return this.objectivesService.getDecisions(id);
  }

  // ─── Links ───

  @Post('objectives/:id/links')
  addLink(@Param('id') id: string, @Body() dto: CreateLinkDto) {
    return this.objectivesService.addLink(id, dto);
  }

  @Get('objectives/:id/links')
  getLinks(@Param('id') id: string) {
    return this.objectivesService.getLinks(id);
  }

  @Delete('links/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLink(@Param('id') id: string) {
    return this.objectivesService.removeLink(id);
  }
}
