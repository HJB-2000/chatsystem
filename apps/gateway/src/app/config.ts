export const HEARTBEAT_INTERVAL_MS = 41_250;
export const HEARTBEAT_GRACE_MS = 10_000;
export const IDENTIFY_TIMEOUT_MS = 10_000;
export const MAX_BUFFERED_BYTES = 1_000_000; // slow consumer threshold
export const TYPING_COOLDOWN_MS = 5_000;
export const PRESENCE_TTL_S = 300;
export const REPLAY_BUFFER_PER_CHANNEL = 100;

export const TOPICS = {
  messages: 'messages',
  presence: 'presence',
  voice: 'voice_state',
} as const;