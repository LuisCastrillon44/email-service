import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.controller';

@Module({
  providers: [EmailService],
  controllers: [EmailConsumer]
})
export class EmailModule { }
