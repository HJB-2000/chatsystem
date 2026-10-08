import { Module } from '@nestjs/common';
import { VoiceSignalingController } from './voice-signaling.controller';
import { VoiceSignalingService } from './voice-signaling.service';

@Module({
  imports: [],
  controllers: [VoiceSignalingController],
  providers: [VoiceSignalingService],
})
export class VoiceSignalingModule {}
