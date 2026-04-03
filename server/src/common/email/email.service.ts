import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger('EmailService');
  private fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const smtpHost = this.configService.get('SMTP_HOST', '');
    this.fromAddress = this.configService.get('SMTP_FROM', 'noreply@productionbible.app');

    if (smtpHost) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(this.configService.get('SMTP_PORT', '587')),
        secure: this.configService.get('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    } else {
      // Dev mode: log emails to console
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      this.logger.warn('SMTP not configured — emails will be logged to console');
    }
  }

  async sendVerificationEmail(to: string, token: string, displayName: string) {
    const frontendUrl = this.configService.get('CORS_ORIGIN', 'http://localhost:3000');
    const verifyUrl = `${frontendUrl}/auth/verify?token=${token}`;

    const html = `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1F2937; font-size: 24px;">🎬 Production Bible</h1>
        <p style="color: #1F2937; font-size: 16px;">Olá ${displayName},</p>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
          Obrigado por criar a sua conta! Clique no botão abaixo para verificar o seu email e ativar a conta.
        </p>
        <a href="${verifyUrl}" 
           style="display: inline-block; background-color: #4A6CF7; color: white; padding: 14px 32px; 
                  border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0;">
          Verificar Email
        </a>
        <p style="color: #6B7280; font-size: 12px;">
          Ou copie e cole este link no browser:<br/>
          <a href="${verifyUrl}" style="color: #4A6CF7;">${verifyUrl}</a>
        </p>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
          Este link expira em 24 horas. Se não criou esta conta, ignore este email.
        </p>
      </div>
    `;

    const info = await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject: '🎬 Verifique o seu email — Production Bible',
      html,
    });

    // In dev mode, log the verification URL
    if (!this.configService.get('SMTP_HOST')) {
      this.logger.log(`📧 Verification email for ${to}:`);
      this.logger.log(`   → ${verifyUrl}`);
    }

    return info;
  }
}
