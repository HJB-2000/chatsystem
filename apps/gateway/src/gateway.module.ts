import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MyGateway } from './app/gateway';
import { EventsConsumer } from './app/events.consumer';
import { InfoController } from './app/info.controller';
import { KafkaService } from './app/kafka.service';
import { PresenceService } from './app/presence.service';
import { PrismaService } from './app/prisma.service';
import { RedisService } from './app/redis.service';
import { RegistryService } from './app/registry.service';
import { SessionLoader } from './app/session-loader.service';

@Module({
  imports: [],
  controllers: [GatewayController, InfoController],
  providers: [
    GatewayService,
    MyGateway,
    PrismaService,
    RedisService,
    KafkaService,
    RegistryService,
    PresenceService,
    SessionLoader,
    EventsConsumer,
  ],
})
export class GatewayModule {}