import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'node-mailjet';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private client: Client;
  private fromEmail: string;
  private fromName: string;
  private clientUrl: string;

  constructor(private config: ConfigService) {
    this.client = new Client({
      apiKey: this.config.get<string>('MAILJET_API_KEY') ?? '',
      apiSecret: this.config.get<string>('MAILJET_API_SECRET') ?? '',
    });
    this.fromEmail = this.config.get<string>('MAILJET_FROM_EMAIL') ?? '';
    this.fromName = this.config.get<string>('MAILJET_FROM_NAME') ?? '';
    this.clientUrl = this.config.get<string>('CLIENT_URL') ?? 'http://localhost:3000';
  }

  private async send(
    to: string,
    toName: string,
    subject: string,
    htmlContent: string,
  ) {
    try {
      await this.client.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: { Email: this.fromEmail, Name: this.fromName },
            To: [{ Email: to, Name: toName }],
            Subject: subject,
            HTMLPart: htmlContent,
          },
        ],
      });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
      throw err;
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const link = `${this.clientUrl}/verify-email?token=${token}`;
    const html = `
      <h2>Welcome to Tobams Academy, ${name}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${link}" style="background:#571244;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `;
    await this.send(to, name, 'Verify your Tobams Academy email', html);
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const link = `${this.clientUrl}/reset-password?token=${token}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your Tobams Academy password.</p>
      <a href="${link}" style="background:#EF4353;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        Reset Password
      </a>
      <p>This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
    `;
    await this.send(to, name, 'Reset your Tobams Academy password', html);
  }
}
