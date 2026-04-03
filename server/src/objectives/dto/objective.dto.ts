import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ObjectiveStatus } from '@cinema-app/shared';

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  phase?: string;

  @IsString()
  @IsOptional()
  sceneOrLocation?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sharedDepartmentIds?: string[];
}

export class UpdateObjectiveDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  phase?: string;

  @IsString()
  @IsOptional()
  sceneOrLocation?: string;

  @IsString()
  @IsOptional()
  directorsVision?: string;
}

export class UpdateStatusDto {
  @IsEnum(ObjectiveStatus)
  status!: ObjectiveStatus;
}

export class ShareDepartmentDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  departmentIds!: string[];
}
