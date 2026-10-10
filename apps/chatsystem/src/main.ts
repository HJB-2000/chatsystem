import 'dotenv/config';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useStaticAssets(join(process.cwd(), 'client'));
  app.enableCors({ origin: true });
  await app.listen(process.env.CHAT_PORT ?? process.env.PORT ?? 3000);
}
void bootstrap();
