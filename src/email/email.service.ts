import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
    constructor() {
        sgMail.setApiKey("API_KEY");
    }

    async sendEmail(to: string, subject: string, message: string) {

        const msg = {
            to,
            from: 'no-reply@tuapp.com',
            subject,
            text: message,
        };

        await sgMail.send(msg);

        return { success: true };
    }
}
