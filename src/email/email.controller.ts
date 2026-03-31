import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) { }

  @MessagePattern('send_email')
  async handleEmail(@Payload() data: SendEmailDto) {
    await this.emailService.sendEmail(data);
  }

  @MessagePattern('send_bulk_emails')
  async handleBulkEmails(@Payload() data: SendEmailDto[]) {
    await this.emailService.sendBulk(data);
  }
}
