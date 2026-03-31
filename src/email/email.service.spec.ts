import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { EMAIL_QUEUE_NAME } from './email.queue';

describe('EmailService', () => {
  let service: EmailService;
  let queue: any;

  beforeEach(async () => {
    const queueMock = {
      add: jest.fn(),
      addBulk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: getQueueToken(EMAIL_QUEUE_NAME),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    queue = module.get(getQueueToken(EMAIL_QUEUE_NAME));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should successfully enqueue an email', async () => {
      const dto = { to: 'test@test.com', subject: 'test', message: 'test' };
      await service.sendEmail(dto);
      expect(queue.add).toHaveBeenCalledWith('sendEmail', dto, expect.any(Object));
    });
  });
});
