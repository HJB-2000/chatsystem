import { Test, TestingModule } from '@nestjs/testing';
import { VoiceSignalingController } from './voice-signaling.controller';
import { VoiceSignalingService } from './voice-signaling.service';

describe('VoiceSignalingController', () => {
  let voiceSignalingController: VoiceSignalingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VoiceSignalingController],
      providers: [VoiceSignalingService],
    }).compile();

    voiceSignalingController = app.get<VoiceSignalingController>(VoiceSignalingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(voiceSignalingController.getHello()).toBe('Hello World!');
    });
  });
});
