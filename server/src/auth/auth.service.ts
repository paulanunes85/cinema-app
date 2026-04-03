import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AuthProvider } from '@cinema-app/shared';

interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async validateOAuthUser(profile: {
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    provider: AuthProvider;
  }) {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        authProvider: profile.provider,
      });
    }

    return user;
  }

  async generateTokens(userId: string, email: string): Promise<TokenPair> {
    const payload: TokenPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, email: string): Promise<TokenPair> {
    return this.generateTokens(userId, email);
  }

  async validateJwtPayload(payload: TokenPayload) {
    return this.usersService.findById(payload.sub);
  }
}
