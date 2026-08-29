import { Injectable, Module, OnModuleInit, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: nodemailer.Transporter;

  onModuleInit() {
    const isProduction = process.env.NODE_ENV === 'production';
    const mailDriver = process.env.MAIL_DRIVER || (isProduction ? 'smtp' : 'local');

    const host = process.env.MAIL_HOST || 'localhost';
    const port = Number(process.env.MAIL_PORT) || 2525;
    const user = process.env.MAIL_USER || process.env.MAIL_API_KEY;
    const pass = process.env.MAIL_PASS || process.env.MAIL_API_KEY;
    const secure = process.env.MAIL_SECURE === 'true' || port === 465;

    if (isProduction) {
      if (host === 'localhost' || host === '127.0.0.1') {
        this.logger.error('CRITICAL: Production MAIL_HOST is configured to localhost! Emails will fail to send.');
      }
      if (!user || !pass) {
        this.logger.warn('WARNING: Production MAIL_USER / MAIL_PASS credentials are missing.');
      }
    }

    // Configure Nodemailer Transport (Supports SMTP, SES, SendGrid, Resend SMTP relays)
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user ? { user, pass } : undefined,
    });

    this.logger.log(`Initialized MailService (Driver: ${mailDriver}, Host: ${host}:${port})`);
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const defaultFrom = process.env.MAIL_FROM || 'EduVerse <noreply@eduverse.com>';
    try {
      await this.transporter.sendMail({
        from: options.from || defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
      });
      this.logger.log(`Email dispatched to ${options.to} (${options.subject})`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
    }
  }

  async sendVerificationEmail(to: string, token: string, userName?: string): Promise<void> {
    const appUrl = process.env.FRONTEND_WEB_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;
    const nameStr = userName ? `Hello ${userName},` : 'Hello,';

    await this.sendMail({
      to,
      subject: 'Verify your EduVerse Account Email',
      text: `${nameStr} Please verify your account by opening this link: ${verifyUrl}`,
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>${nameStr}</p>
        <p>Thank you for registering on EduVerse. Please click the button below to verify your email address:</p>
        <p><a href="${verifyUrl}" style="background: #1B2C50; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Verify Account</a></p>
      </div>`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string, userName?: string): Promise<void> {
    const appUrl = process.env.FRONTEND_WEB_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    const nameStr = userName ? `Hello ${userName},` : 'Hello,';

    await this.sendMail({
      to,
      subject: 'EduVerse Password Reset Request',
      text: `${nameStr} Reset your password by opening this link: ${resetUrl}`,
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>${nameStr}</p>
        <p>We received a request to reset your password. Click the button below to specify a new password:</p>
        <p><a href="${resetUrl}" style="background: #E1543F; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Reset Password</a></p>
      </div>`,
    });
  }

  async sendNotification(to: string, title: string, content: string): Promise<void> {
    await this.sendMail({
      to,
      subject: title,
      text: content,
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2>${title}</h2>
        <p>${content}</p>
      </div>`,
    });
  }
}

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
