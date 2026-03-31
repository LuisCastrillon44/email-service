import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EMAIL_QUEUE_NAME } from './email.queue';
import { BrevoProvider } from './providers/brevo.provider';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
    }),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    EmailProcessor,
    {
      provide: 'EMAIL_PROVIDER',
      useClass: BrevoProvider,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
