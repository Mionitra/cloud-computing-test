import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  async sendEmailAlert(to: string, location: string, message: string) {
    await this.transporter.sendMail({
      from: `"Weather Alerts 🌩" <${this.config.get('MAIL_USER')}>`,
      to,
      subject: `⚠️ Weather Alert for ${location}`,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2 style="color: #e74c3c;">⚠️ Weather Alert</h2>
          <h3>${location}</h3>
          <p>${message}</p>
          <p style="color: #999; font-size: 12px;">
            You're receiving this because you subscribed to alerts for ${location}.
          </p>
        </div>
      `,
    });
    this.logger.log(`Email sent to ${to} for ${location}`);
  }
}
