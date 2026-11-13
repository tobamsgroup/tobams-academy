import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

const mockConfig = {
  get: (key: string) => ({
    MAILJET_API_KEY: 'key',
    MAILJET_API_SECRET: 'secret',
    MAILJET_FROM_EMAIL: 'noreply@test.com',
    MAILJET_FROM_NAME: 'Test',
    CLIENT_URL: 'http://localhost:3000',
  }[key]),
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  it('sendVerificationEmail resolves without throwing', async () => {
    jest.spyOn(service as any, 'send').mockResolvedValue(undefined);
    await expect(
      service.sendVerificationEmail('a@b.com', 'Alice', 'token123'),
    ).resolves.not.toThrow();
  });

  it('sendPasswordResetEmail resolves without throwing', async () => {
    jest.spyOn(service as any, 'send').mockResolvedValue(undefined);
    await expect(
      service.sendPasswordResetEmail('a@b.com', 'Alice', 'resettoken'),
    ).resolves.not.toThrow();
  });

  it('send rethrows when mailjet request fails', async () => {
    const mockPost = {
      request: jest.fn().mockRejectedValue(new Error('mailjet error')),
    };
    (service as any).client = { post: jest.fn().mockReturnValue(mockPost) };
    await expect(
      service.sendVerificationEmail('a@b.com', 'Alice', 'tok'),
    ).rejects.toThrow('mailjet error');
  });

});
