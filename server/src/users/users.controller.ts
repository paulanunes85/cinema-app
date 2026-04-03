import { Controller, Patch, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OnboardingDto, UpdateProfileDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboarding')
  @HttpCode(HttpStatus.OK)
  async onboarding(
    @CurrentUser() user: { id: string },
    @Body() dto: OnboardingDto,
  ) {
    return this.usersService.completeOnboarding(user.id, dto);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
