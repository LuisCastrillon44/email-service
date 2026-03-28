import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller('email')
export class EmailConsumer {
    constructor(private readonly emailService: EmailService) { }

    @MessagePattern('send_email')
    async handleEmail(@Payload() data: any) {

        await this.emailService.sendEmail(
            data.to,
            data.subject,
            data.message
        );
    }
}
