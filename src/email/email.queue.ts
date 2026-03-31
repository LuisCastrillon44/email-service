import { SendEmailDto } from './dto/send-email.dto';

export const EMAIL_QUEUE_NAME = 'EmailQueue';

export interface EmailJobData extends SendEmailDto {
}
