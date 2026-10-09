import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Kafka, logLevel, Partitioners } from 'kafkajs';
import { TOPICS } from './config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(KafkaService.name);
  private readonly kafka = new Kafka({
    clientId: 'gateway',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    logLevel: logLevel.WARN,
  });
  private readonly producer = this.kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  // unique group per instance: every gateway must see every event
  private readonly consumer = this.kafka.consumer({
    groupId: `gateway-${randomUUID()}`,
  });
  private readonly handlers = new Map<string, (value: any) => void>();

  on(topic: string, fn: (value: any) => void) {
    this.handlers.set(topic, fn);
  }

  async publish(topic: string, key: string, value: unknown) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }

  async onModuleInit() {
    const topics = Object.values(TOPICS);
    const admin = this.kafka.admin();
    await admin.connect();
    const existing = await admin.listTopics();
    const missing = topics.filter((t) => !existing.includes(t));
    if (missing.length)
      await admin.createTopics({
        waitForLeaders: true,
        topics: missing.map((topic) => ({ topic, numPartitions: 3 })),
      });
    await admin.disconnect();

    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topics, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;
        try {
          this.handlers.get(topic)?.(JSON.parse(message.value.toString()));
        } catch (e) {
          this.log.error(`${topic}: ${(e as Error).message}`);
        }
      },
    });
    this.log.log(`consuming ${topics.join(', ')}`);
  }

  async onModuleDestroy() {
    await this.consumer.disconnect().catch(() => undefined);
    await this.producer.disconnect().catch(() => undefined);
  }
}