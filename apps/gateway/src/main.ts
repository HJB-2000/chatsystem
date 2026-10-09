import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(process.env.GATEWAY_PORT ?? process.env.PORT ?? 3001);
}
bootstrap();