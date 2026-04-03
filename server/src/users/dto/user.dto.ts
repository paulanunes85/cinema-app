import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class OnboardingDto {
  @IsString()
  @IsNotEmpty()
  displayName!: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  displayName?: string;
}
