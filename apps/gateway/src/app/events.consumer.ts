import { Injectable } from '@nestjs/common';
import { TOPICS } from './config';
import { KafkaService } from './kafka.service';
import { dispatch, Evt } from './protocol';
import { RegistryService } from './registry.service';

/** Kafka -> local WebSocket fan-out. Registered in constructor so no event is missed. */
@Injectable()
export class EventsConsumer {
  constructor(
    kafka: KafkaService,
    private readonly registry: RegistryService,
  ) {
    kafka.on(TOPICS.messages, (v) => this.onMessage(v));
    kafka.on(TOPICS.presence, (v) => this.onPresence(v));
    kafka.on(TOPICS.voice, (v) => this.onVoice(v));
  }

  private onMessage(v: any) {
    const channelId = String(v?.channel_id ?? '');
    const messageId = String(v?.message_id ?? '');
    if (!channelId || !messageId) return;
    const out = dispatch(Evt.MESSAGE_CREATE, {
      ...v,
      channel_id: channelId,
      message_id: messageId,
      author_id: v.author_id != null ? String(v.author_id) : undefined,
    });
    this.registry.remember(channelId, messageId, out);
    this.registry.toChannel(channelId, out); // serialized once, shared
  }

  private onPresence(v: any) {
    const userId = String(v?.user_id ?? '');
    if (!userId) return;
    this.registry.toWatchers(
      userId,
      dispatch(Evt.PRESENCE_UPDATE, {
        user_id: userId,
        status: v.status,
        timestamp: v.timestamp,
      }),
    );
  }

  private onVoice(v: any) {
    const channelId = String(v?.channel_id ?? '');
    const guildId = v?.guild_id != null ? String(v.guild_id) : this.registry.guildOf(channelId);
    if (!guildId) return;
    this.registry.toGuild(
      guildId,
      dispatch(Evt.VOICE_STATE_UPDATE, {
        user_id: String(v.user_id),
        channel_id: channelId,
        guild_id: guildId,
        action: v.action,
        self_mute: !!v.self_mute,
        self_deaf: !!v.self_deaf,
      }),
    );
  }
}