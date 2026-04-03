import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email/email.service';
import { AuthProvider } from '@cinema-app/shared';
import { RegisterDto, LoginDto } from './dto/auth.dto';

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
    private readonly emailService: EmailService,
  ) {}

  // ─── Email Registration ───

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Este email já está registado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verifyToken = randomUUID();
    const verifyTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await this.usersService.createEmailUser({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash,
      verifyToken,
      verifyTokenExp,
    });

    await this.emailService.sendVerificationEmail(
      user.email,
      verifyToken,
      dto.displayName,
    );

    return {
      message: 'Conta criada! Verifique o seu email para ativar a conta.',
      userId: user.id,
    };
  }

  // ─── Email Verification ───

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerifyToken(token);

    if (!user) {
      throw new BadRequestException('Link de verificação inválido ou expirado');
    }

    if (user.verifyTokenExp && user.verifyTokenExp < new Date()) {
      throw new BadRequestException('Link de verificação expirado. Faça registo novamente.');
    }

    await this.usersService.markEmailVerified(user.id);

    // Auto-generate tokens so user is logged in after verification
    return this.generateTokens(user.id, user.email);
  }

  // ─── Email Login ───

  async loginWithEmail(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || user.authProvider !== AuthProvider.EMAIL || !user.passwordHash) {
      throw new UnauthorizedException('Email ou password incorretos');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email não verificado. Verifique a sua caixa de entrada.',
      );
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Email ou password incorretos');
    }

    return this.generateTokens(user.id, user.email);
  }

  // ─── OAuth ───

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

  // ─── Tokens ───

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
