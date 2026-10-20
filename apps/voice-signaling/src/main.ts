import { NestFactory } from '@nestjs/core';
import { VoiceSignalingModule } from './voice-signaling.module';

async function bootstrap() {
  const app = await NestFactory.create(VoiceSignalingModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
