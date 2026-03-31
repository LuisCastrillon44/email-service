import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { EMAIL_QUEUE_NAME, EmailJobData } from './email.queue';
import type { IEmailProvider } from './interfaces/email-provider.interface';
import { BrevoProvider } from './providers/brevo.provider';

@Processor(EMAIL_QUEUE_NAME)
@Injectable()
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(@Inject('EMAIL_PROVIDER') private readonly emailProvider: IEmailProvider) {
    super();
  }

  async process(job: Job<EmailJobData, any, string>): Promise<any> {
    this.logger.log(`Processing an email job - JobId: ${job.id}`);

    const { to, subject, templateName, context, message } = job.data;

    let htmlContent = message || '';

    if (templateName) {
      this.logger.log(`Compiling template: ${templateName}`);
      htmlContent = await this.compileTemplate(templateName, context || {});
    }

    if (!htmlContent) {
      throw new Error('Email must have either a message or a templateName with content');
    }

    try {
      await this.emailProvider.sendEmail(to, subject, htmlContent);
      this.logger.log(`Email job completed successfully - JobId: ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to process email job - JobId: ${job.id}`, error instanceof Error ? error.stack : 'Unknown error');
      throw error;
    }
  }

  private async compileTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate(context);
  }
}
