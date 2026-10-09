import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatService } from './chat.service';
import { KafkaService } from './kafka.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ChatService, KafkaService, PrismaService],
})
export class AppModule {}
