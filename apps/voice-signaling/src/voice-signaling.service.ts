import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceSignalingService {
  getHello(): string {
    return 'Hello World!';
  }
}
