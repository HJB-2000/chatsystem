import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { MAX_BUFFERED_BYTES, REPLAY_BUFFER_PER_CHANNEL } from './config';

export interface Session {
    id: string;
    ws: WebSocket;
    userId: string;
    username: string;
    guildIds: string[];
    channels: Map<string, string>; // channelId -> guildId
    friendIds: string[];
    acks: Map<string, string>; // channelId -> last acked messageId
    lastAckAt: number;
    lastTypingAt: Map<string, number>;
}

type Index = Map<string, Set<string>>;
const put = (m: Index, k: string, v: string) => {
    let s = m.get(k);
    if (!s) m.set(k, (s = new Set()));
    s.add(v);
};
const drop = (m: Index, k: string, v: string) => {
    const s = m.get(k);
    if (!s) return;
    s.delete(v);
    if (!s.size) m.delete(k);
};

@Injectable()
export class RegistryService {
    /** user_id -> session_id -> session */
    private readonly sessions = new Map<string, Map<string, Session>>();
    /** channel_id -> Set<user_id> */
    private readonly channelUsers: Index = new Map();
    private readonly guildUsers: Index = new Map();
    /** friend_id -> Set<local user_id watching them> */
    private readonly watchers: Index = new Map();
    private readonly channelGuild = new Map<string, string>();
    private readonly replay = new Map<string, { id: bigint; frame: string }[]>();

    readonly metrics = { slowConsumers: 0, heartbeatMissed: 0, reconnects: 0, sent: 0 };

    add(s: Session) {
    let m = this.sessions.get(s.userId);
    if (!m) this.sessions.set(s.userId, (m = new Map()));
    m.set(s.id, s);
    for (const [c, g] of s.channels) {
        put(this.channelUsers, c, s.userId);
        this.channelGuild.set(c, g);
    }
    for (const g of s.guildIds) put(this.guildUsers, g, s.userId);
    for (const f of s.friendIds) put(this.watchers, f, s.userId);
    }

  /** @returns true if this was the user's last local session */
    remove(s: Session): boolean {
    const m = this.sessions.get(s.userId);
    if (!m) return false;
    m.delete(s.id);
    if (m.size) return false;
    this.sessions.delete(s.userId);
    for (const c of s.channels.keys()) {
    drop(this.channelUsers, c, s.userId);
    if (!this.channelUsers.has(c)) {
        this.channelGuild.delete(c);
        this.replay.delete(c);
    }
    }
    for (const g of s.guildIds) drop(this.guildUsers, g, s.userId);
    for (const f of s.friendIds) drop(this.watchers, f, s.userId);
    return true;
    }

    send(s: Session, frame: string) {
    const ws = s.ws;
    if (ws.readyState !== WebSocket.OPEN) return;
    if (ws.bufferedAmount > MAX_BUFFERED_BYTES) {
        this.metrics.slowConsumers++;
      ws.terminate(); // drop slow consumer, protect others
        return;
    }
    this.metrics.sent++;
    ws.send(frame);
    }

    private toUsers(ids: Iterable<string>, frame: string, except?: string) {
    for (const uid of ids) {
        if (uid === except) continue;
        const m = this.sessions.get(uid);
        if (m) for (const s of m.values()) this.send(s, frame);
    }
    }

  toChannel(channelId: string, frame: string, except?: string) {
    this.toUsers(this.channelUsers.get(channelId) ?? [], frame, except);
  }
  toGuild(guildId: string, frame: string) {
    this.toUsers(this.guildUsers.get(guildId) ?? [], frame);
  }
  toWatchers(userId: string, frame: string) {
    this.toUsers(this.watchers.get(userId) ?? [], frame);
  }
  guildOf(channelId: string) {
    return this.channelGuild.get(channelId);
  }

  remember(channelId: string, messageId: string, frame: string) {
    if (!this.channelUsers.has(channelId)) return; // no local interest
    let buf = this.replay.get(channelId);
    if (!buf) this.replay.set(channelId, (buf = []));
    buf.push({ id: BigInt(messageId), frame });
    if (buf.length > REPLAY_BUFFER_PER_CHANNEL) buf.shift();
  }

  missed(channelIds: Iterable<string>, lastId: string) {
    const last = BigInt(lastId);
    const out: { id: bigint; frame: string }[] = [];
    let truncated = false;
    for (const c of channelIds) {
      const buf = this.replay.get(c);
      if (!buf) continue;
      if (buf.length >= REPLAY_BUFFER_PER_CHANNEL && buf[0].id > last) truncated = true;
      for (const e of buf) if (e.id > last) out.push(e);
    }
    out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    return { frames: out.map((e) => e.frame), truncated };
  }

  stats() {
    let connections = 0;
    for (const m of this.sessions.values()) connections += m.size;
    return {
      users: this.sessions.size,
      connections,
      channelsIndexed: this.channelUsers.size,
      ...this.metrics,
    };
  }
}