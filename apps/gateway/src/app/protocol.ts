export enum Op {
  DISPATCH = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  PRESENCE = 3,
  TYPING = 8,
  HELLO = 10,
  ACK = 11,
  HEARTBEAT_ACK = 12, // not in spec: lets client detect dead link
}

export enum Close {
  NOT_AUTH = 4001,
  DECODE = 4002,
  ALREADY_IDENTIFIED = 4003,
  AUTH_FAILED = 4004,
  SLOW_CONSUMER = 4008,
  HEARTBEAT_TIMEOUT = 4009,
  IDENTIFY_TIMEOUT = 4010,
}

export const Evt = {
  READY: 'READY',
  MESSAGE_CREATE: 'MESSAGE_CREATE',
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',
  TYPING_START: 'TYPING_START',
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
} as const;

export type Status = 'online' | 'idle' | 'dnd' | 'offline';

export const ID_RE = /^\d{1,19}$/;

/** Serialize once, share the string across all recipients. */
export const frame = (op: Op, d?: unknown, t?: string) =>
  JSON.stringify({ op, t, d });

export const dispatch = (t: string, d: unknown) => frame(Op.DISPATCH, d, t);