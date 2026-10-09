import { Logger, OnModuleDestroy } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { RawData, WebSocket } from 'ws';
import {
  HEARTBEAT_GRACE_MS,
  HEARTBEAT_INTERVAL_MS,
  IDENTIFY_TIMEOUT_MS,
  TYPING_COOLDOWN_MS,
} from './config';
import { PresenceService } from './presence.service';
import { Close, dispatch, Evt, frame, ID_RE, Op, Status } from './protocol';
import { RegistryService, Session } from './registry.service';
import { SessionLoader } from './session-loader.service';

interface Conn {
  ws: WebSocket;
  session?: Session;
  identifying: boolean;
  lastHeartbeat: number;
  identifyTimer: NodeJS.Timeout;
}

const HELLO = frame(Op.HELLO, { heartbeat_interval: HEARTBEAT_INTERVAL_MS });
const HB_ACK = frame(Op.HEARTBEAT_ACK);

/**
 * Stateful "dumb pipe": holds sockets, pushes events.
 * No message persistence/validation here (REST API owns that).
 */
@WebSocketGateway({ path: '/gateway' })
export class MyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  private readonly log = new Logger(MyGateway.name);
  private readonly conns = new Map<WebSocket, Conn>();
  private sweeper?: NodeJS.Timeout;

  constructor(
    private readonly registry: RegistryService,
    private readonly presence: PresenceService,
    private readonly loader: SessionLoader,
  ) {}

  afterInit() {
    this.sweeper = setInterval(() => this.sweep(), 5_000);
    this.log.log('Gateway ready on /gateway');
  }

  onModuleDestroy() {
    clearInterval(this.sweeper);
  }

  handleConnection(ws: WebSocket) {
    const conn: Conn = {
      ws,
      identifying: false,
      lastHeartbeat: Date.now(),
      identifyTimer: setTimeout(
        () => ws.close(Close.IDENTIFY_TIMEOUT, 'identify timeout'),
        IDENTIFY_TIMEOUT_MS,
      ),
    };
    this.conns.set(ws, conn);
    ws.on('error', (e) => this.log.warn(e.message));
    ws.on('message', (raw) =>
      this.onMessage(conn, raw).catch((e) => this.log.error(e)),
    );
    ws.send(HELLO);
  }

  handleDisconnect(ws: WebSocket) {
    const conn = this.conns.get(ws);
    if (!conn) return;
    clearTimeout(conn.identifyTimer);
    this.conns.delete(ws);
    const s = conn.session;
    if (!s) return;
    if (this.registry.remove(s))
      this.presence.set(s.userId, 'offline').catch((e) => this.log.warn(e.message));
    this.log.log(`- ${s.userId} (${s.id})`);
  }

  /** heartbeat miss -> drop */
  private sweep() {
    const limit = HEARTBEAT_INTERVAL_MS + HEARTBEAT_GRACE_MS;
    const now = Date.now();
    for (const c of this.conns.values()) {
      if (now - c.lastHeartbeat > limit) {
        this.registry.metrics.heartbeatMissed++;
        c.ws.terminate();
      }
    }
  }

  private async onMessage(conn: Conn, raw: RawData) {
    let msg: { op?: number; d?: any } | null;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      conn.ws.close(Close.DECODE, 'decode error');
      return;
    }

    switch (msg?.op) {
      case Op.HEARTBEAT:
        return this.onHeartbeat(conn);
      case Op.IDENTIFY:
        return this.identify(conn, msg.d);
    }

    const s = conn.session;
    if (!s) {
      conn.ws.close(Close.NOT_AUTH, 'not authenticated');
      return;
    }
    switch (msg?.op) {
      case Op.PRESENCE:
        return this.onPresence(s, msg.d);
      case Op.TYPING:
        return this.onTyping(s, msg.d);
      case Op.ACK:
        return this.onAck(s, msg.d);
    }
  }

  private onHeartbeat(conn: Conn) {
    conn.lastHeartbeat = Date.now();
    conn.ws.send(HB_ACK);
    if (conn.session)
      this.presence.touch(conn.session.userId).catch(() => undefined);
  }

  private async identify(conn: Conn, d: any) {
    if (conn.session || conn.identifying) {
      conn.ws.close(Close.ALREADY_IDENTIFIED, 'already identified');
      return;
    }
    conn.identifying = true;
    clearTimeout(conn.identifyTimer);

    try {
      const state = await this.loader.load(String(d?.token ?? ''));
      if (!state) {
        conn.ws.close(Close.AUTH_FAILED, 'authentication failed');
        return;
      }
      if (conn.ws.readyState !== WebSocket.OPEN) return; // closed while loading

      const session: Session = {
        id: randomUUID(),
        ws: conn.ws,
        ...state,
        acks: new Map(),
        lastAckAt: Date.now(),
        lastTypingAt: new Map(),
      };
      conn.session = session;
      this.registry.add(session);

      // reconnect: replay what this gateway still has after client's last id
      const lastId = ID_RE.test(String(d?.last_message_id ?? ''))
        ? String(d.last_message_id)
        : null;
      const missed = lastId
        ? this.registry.missed(session.channels.keys(), lastId)
        : { frames: [] as string[], truncated: false };
      if (lastId) this.registry.metrics.reconnects++;

      // presence: Redis + Kafka (non-fatal)
      await this.presence.set(session.userId, 'online').catch((e) => this.log.warn(e.message));
      const friendsOnline = await this.presence
        .online(session.friendIds)
        .catch(() => []);

      this.registry.send(
        session,
        dispatch(Evt.READY, {
          session_id: session.id,
          user: { id: session.userId, username: session.username },
          guild_ids: session.guildIds,
          channel_ids: [...session.channels.keys()],
          friends_online: friendsOnline,
          resync: missed.truncated, // true -> client must GET history from API
        }),
      );
      for (const f of missed.frames) this.registry.send(session, f);
      this.log.log(`+ ${session.userId} (${session.id})`);
    } catch (e) {
      this.log.error(e);
      conn.ws.close(1011, 'internal error');
    }
  }

  private onPresence(s: Session, d: any) {
    const status = d?.status as Status;
    if (!['online', 'idle', 'dnd'].includes(status)) return;
    this.presence.set(s.userId, status).catch((e) => this.log.warn(e.message));
  }

  private onTyping(s: Session, d: any) {
    const channelId = String(d?.channel_id ?? '');
    if (!s.channels.has(channelId)) return;
    const now = Date.now();
    if (now - (s.lastTypingAt.get(channelId) ?? 0) < TYPING_COOLDOWN_MS) return;
    s.lastTypingAt.set(channelId, now);
    this.registry.toChannel(
      channelId,
      dispatch(Evt.TYPING_START, {
        channel_id: channelId,
        user_id: s.userId,
        timestamp: new Date(now).toISOString(),
      }),
      s.userId,
    );
  }

  private onAck(s: Session, d: any) {
    const channelId = String(d?.channel_id ?? '');
    const last = String(d?.last_message_id ?? '');
    if (!s.channels.has(channelId) || !ID_RE.test(last)) return;
    s.acks.set(channelId, last);
    s.lastAckAt = Date.now();
  }
}