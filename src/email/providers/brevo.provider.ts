import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import { IEmailProvider } from '../interfaces/email-provider.interface';

@Injectable()
export class BrevoProvider implements IEmailProvider {
  private readonly logger = new Logger(BrevoProvider.name);
  private readonly brevoClient: BrevoClient;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    this.brevoClient = new BrevoClient({
      apiKey: apiKey!,
    });
  }

  async sendEmail(to: string, subject: string, htmlMessage: string): Promise<boolean> {
    try {
      await this.brevoClient.transactionalEmails.sendTransacEmail({
        subject,
        htmlContent: htmlMessage,
        sender: {
          name: 'Emplo',
          email: 'luisfcastrillonalvarez@gmail.com',
        },
        to: [{ email: to }],
      });

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error instanceof Error ? error.stack : error);
      throw error;
    }
  }
}
