import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  templateName?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @IsString()
  @IsOptional()
  message?: string;
}
