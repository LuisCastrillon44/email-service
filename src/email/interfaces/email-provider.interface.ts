export interface IEmailProvider {
  sendEmail(to: string, subject: string, htmlMessage: string): Promise<boolean>;
}
