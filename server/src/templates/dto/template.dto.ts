import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  objectiveType!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  checklist?: string[];
}

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  checklist?: string[];
}
