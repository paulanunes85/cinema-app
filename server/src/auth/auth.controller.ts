import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── Google OAuth ───

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { id: string; email: string };
    const tokens = await this.authService.generateTokens(user.id, user.email);

    // Redirect to frontend with tokens as query params
    const frontendUrl = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
    const redirectUrl = new URL('/auth/callback', frontendUrl);
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);
    res.redirect(redirectUrl.toString());
  }

  // ─── Token Refresh ───

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: Request) {
    const user = req.user as { id: string; email: string };
    return this.authService.refreshTokens(user.id, user.email);
  }

  // ─── Current User ───

  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    return user;
  }
}
