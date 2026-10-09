import { Injectable } from '@nestjs/common';
import { PRESENCE_TTL_S, TOPICS } from './config';
import { KafkaService } from './kafka.service';
import { Status } from './protocol';
import { RedisService } from './redis.service';

const key = (id: string) => `user:${id}:presence`;

@Injectable()
export class PresenceService {
  constructor(
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
  ) {}

  /** 1) store in Redis (TTL) 2) publish to Kafka. Gateways fan out on consume. */
  async set(userId: string, status: Status) {
    const value = {
      user_id: userId,
      status,
      timestamp: new Date().toISOString(),
    };
    if (status === 'offline') await this.redis.del(key(userId));
    else await this.redis.set(key(userId), JSON.stringify(value), 'EX', PRESENCE_TTL_S);
    await this.kafka.publish(TOPICS.presence, `user:${userId}`, value);
  }

  /** heartbeat refreshes TTL */
  async touch(userId: string) {
    await this.redis.expire(key(userId), PRESENCE_TTL_S);
  }

  async online(userIds: string[]) {
    if (!userIds.length) return [];
    const vals = await this.redis.mget(userIds.map(key));
    return vals.flatMap((v, i) =>
      v ? [{ user_id: userIds[i], status: JSON.parse(v).status as Status }] : [],
    );
  }
}