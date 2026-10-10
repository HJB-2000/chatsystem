import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel, Partitioners } from 'kafkajs';

/**
 * Stateless API tier only ever PRODUCES (spec: REST writes -> Kafka ->
 * Gateways consume and fan out). If Kafka is down the app keeps serving
 * HTTP and degrades to no real-time pushes.
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(KafkaService.name);
  private readonly kafka = new Kafka({
    clientId: 'chatsystem-api',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    logLevel: logLevel.WARN,
  });
  private readonly producer = this.kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  private connected = false;

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.connected = true;
      this.log.log('producer connected');
    } catch (e) {
      this.log.warn(`Kafka unavailable: ${(e as Error).message}`);
    }
  }

  async publish(topic: string, key: string, value: unknown) {
    if (!this.connected) return false;
    try {
      await this.producer.send({
        topic,
        messages: [{ key, value: JSON.stringify(value) }],
      });
      return true;
    } catch (e) {
      this.log.warn(`publish ${topic} failed: ${(e as Error).message}`);
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.connected) await this.producer.disconnect().catch(() => undefined);
  }
}
