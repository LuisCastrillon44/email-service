import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EMAIL_QUEUE_NAME } from './email.queue';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME) private readonly emailQueue: Queue,
  ) {}

  async sendEmail(dto: SendEmailDto): Promise<void> {
    this.logger.log(`Enqueuing email for ${dto.to}`);
    
    await this.emailQueue.add('sendEmail', dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`Email successfully enqueued for ${dto.to}`);
  }

  async sendBulk(dtos: SendEmailDto[]): Promise<void> {
    this.logger.log(`Enqueuing ${dtos.length} bulk emails`);
    
    const jobs = dtos.map(dto => ({
      name: 'sendEmail',
      data: dto,
      opts: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      }
    }));

    await this.emailQueue.addBulk(jobs);
    this.logger.log(`Successfully enqueued ${dtos.length} bulk emails`);
  }
}