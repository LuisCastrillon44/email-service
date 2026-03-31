import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

describe('EmailController', () => {
  let controller: EmailController;
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
            sendBulk: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleEmail', () => {
    it('should call emailService.sendEmail', async () => {
      const dto = { to: 'test@test.com', subject: 'test', message: 'test' };
      await controller.handleEmail(dto);
      expect(service.sendEmail).toHaveBeenCalledWith(dto);
    });
  });
});
