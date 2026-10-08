import { Controller, Get } from '@nestjs/common';
import { VoiceSignalingService } from './voice-signaling.service';

@Controller()
export class VoiceSignalingController {
  constructor(private readonly voiceSignalingService: VoiceSignalingService) {}

  @Get()
  getHello(): string {
    return this.voiceSignalingService.getHello();
  }
}
