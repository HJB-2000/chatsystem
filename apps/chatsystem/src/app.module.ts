import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatService } from './chat.service';
import { KafkaService } from './kafka.service';
import { PrismaService } from './prisma.service';
import { UserCheckService } from './auth-check.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ChatService, KafkaService, PrismaService, UserCheckService],
})
export class AppModule {}
