import { Test, TestingModule } from '@nestjs/testing';
import { EmailProcessor } from './email.processor';

describe('EmailProcessor', () => {
  let processor: EmailProcessor;
  let emailProvider: any;

  beforeEach(async () => {
    const providerMock = {
      sendEmail: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailProcessor,
        {
          provide: 'EMAIL_PROVIDER',
          useValue: providerMock,
        },
      ],
    }).compile();

    processor = module.get<EmailProcessor>(EmailProcessor);
    emailProvider = module.get('EMAIL_PROVIDER');
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should call emailProvider.sendEmail', async () => {
      const job: any = {
        id: '1',
        data: {
          to: 'test@test.com',
          subject: 'test',
          message: 'html content',
        },
      };

      await processor.process(job);

      expect(emailProvider.sendEmail).toHaveBeenCalledWith(
        'test@test.com',
        'test',
        'html content',
      );
    });
  });
});
