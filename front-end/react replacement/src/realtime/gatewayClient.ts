import { getUserTag } from '../api/chatApi';

export type GatewayEvent = { op: number; t?: string; d?: any };
type EventHandler = (data: any) => void;
const gatewayUrl = import.meta.env.VITE_GATEWAY_URL ?? 'ws://localhost:3001/gateway';

export class GatewayClient {
  private socket: WebSocket | null = null;
  private heartbeat: number | undefined;
  private reconnectTimer: number | undefined;
  private manuallyClosed = false;
  private reconnectAttempt = 0;
  private lastMessageId = sessionStorage.getItem('last-message-id') ?? undefined;
  private readonly handlers = new Map<string, Set<EventHandler>>();
  private readonly statusHandlers = new Set<(status: string) => void>();
  private token = '';

  on(event: string, handler: EventHandler) {
    const handlers = this.handlers.get(event) ?? new Set<EventHandler>();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => handlers.delete(handler);
  }
  onStatus(handler: (status: string) => void) { this.statusHandlers.add(handler); return () => this.statusHandlers.delete(handler); }
  connect(token: string) { this.manuallyClosed = false; this.token = token; this.open(); }
  disconnect() { this.manuallyClosed = true; this.clearTimers(); this.socket?.close(1000, 'client closed'); this.socket = null; this.setStatus('closed'); }
  sendPresence(status: 'online' | 'idle' | 'dnd') { this.send({ op: 3, d: { status } }); }
  sendTyping(channelId: string) { this.send({ op: 8, d: { channel_id: channelId } }); }
  acknowledge(channelId: string, messageId: string) { this.send({ op: 11, d: { channel_id: channelId, last_message_id: messageId } }); }

  private open() {
    this.clearTimers(); this.setStatus('connecting');
    const socket = new WebSocket(gatewayUrl); this.socket = socket;
    socket.onopen = () => this.setStatus('identifying');
    socket.onmessage = event => { try { this.handleMessage(JSON.parse(String(event.data)) as GatewayEvent); } catch { socket.close(4002, 'decode error'); } };
    socket.onerror = () => this.setStatus('error');
    socket.onclose = event => { this.clearTimers(); this.socket = null; if (!this.manuallyClosed && event.code !== 4004) this.scheduleReconnect(); };
  }

  private handleMessage(frame: GatewayEvent) {
    if (frame.op === 10) {
      this.heartbeat = window.setInterval(() => this.send({ op: 1 }), Number(frame.d?.heartbeat_interval ?? 41250));
      this.send({ op: 2, d: { user_tag_id: getUserTag() ?? this.token, last_message_id: this.lastMessageId } }); return;
    }
    if (frame.op === 12 || frame.op !== 0 || !frame.t) return;
    if (frame.t === 'READY') { this.reconnectAttempt = 0; this.setStatus('ready'); }
    if (frame.t === 'MESSAGE_CREATE' && frame.d?.message_id) {
      this.lastMessageId = String(frame.d.message_id); sessionStorage.setItem('last-message-id', this.lastMessageId);
      this.acknowledge(String(frame.d.channel_id), this.lastMessageId);
    }
    this.handlers.get(frame.t)?.forEach(handler => handler(frame.d));
  }
  private send(frame: { op: number; d?: unknown }) { if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(frame)); }
  private scheduleReconnect() { this.setStatus('reconnecting'); const delay = Math.min(1000 * 2 ** this.reconnectAttempt++, 15000); this.reconnectTimer = window.setTimeout(() => this.open(), delay); }
  private clearTimers() { if (this.heartbeat) window.clearInterval(this.heartbeat); if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer); this.heartbeat = undefined; this.reconnectTimer = undefined; }
  private setStatus(status: string) { this.statusHandlers.forEach(handler => handler(status)); }
}
