import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendVerificationEmail(_to: string, _name: string, _token: string) {}
  async sendPasswordResetEmail(_to: string, _name: string, _token: string) {}
}
