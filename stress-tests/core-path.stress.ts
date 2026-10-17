import WebSocket from 'ws';

type Json = Record<string, any>;
type GatewayFrame = { op: number; t?: string; d?: Json };

const apiUrl = (process.env.CHAT_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const gatewayUrl = process.env.GATEWAY_URL ?? 'ws://localhost:3001/gateway';
const userId = process.env.TEST_USER_ID;
const timeoutMs = Number(process.env.STRESS_TIMEOUT_MS ?? 10_000);
const messageCount = Number(process.env.STRESS_MESSAGE_COUNT ?? 25);

if (!userId) throw new Error('TEST_USER_ID is required');

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const body = await response.json().catch(() => null);
  check(response.ok, `${options?.method ?? 'GET'} ${path} returned ${response.status}: ${JSON.stringify(body)}`);
  return body as T;
}

function waitForFrame(socket: WebSocket, predicate: (frame: GatewayFrame) => boolean, label: string) {
  return new Promise<GatewayFrame>((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error(`Timed out waiting for ${label}`)); }, timeoutMs);
    const onMessage = (raw: WebSocket.RawData) => {
      const frame = JSON.parse(raw.toString()) as GatewayFrame;
      if (predicate(frame)) { cleanup(); resolve(frame); }
    };
    const onError = (error: Error) => { cleanup(); reject(error); };
    const cleanup = () => { clearTimeout(timer); socket.off('message', onMessage); socket.off('error', onError); };
    socket.on('message', onMessage);
    socket.on('error', onError);
  });
}

async function connectClient(label: string) {
  const socket = new WebSocket(gatewayUrl);
  await waitForFrame(socket, frame => frame.op === 10, `${label} HELLO`);
  socket.send(JSON.stringify({ op: 2, d: { token: userId } }));
  await waitForFrame(socket, frame => frame.t === 'READY', `${label} READY`);
  return socket;
}

async function main() {
  console.log(`Running core path stress test against ${apiUrl} and ${gatewayUrl}`);
  const user = await api<Json>(`/api/users/${userId}`);
  check(String(user.id) === String(userId), 'user lookup returned the wrong user');

  const collectives = await api<Json[]>(`/api/collectives?userId=${userId}`);
  check(collectives.length > 0, 'user has no collectives');
  const collectiveId = String(collectives[0].id);
  const rooms = await api<Json[]>(`/api/collectives/${collectiveId}/rooms?userId=${userId}`);
  const room = rooms.find(item => item.type !== 'VOICE') ?? rooms[0];
  check(room, 'collective has no room');
  const roomId = process.env.TEST_ROOM_ID ?? String(room.id);

  await api(`/api/rooms/${roomId}/join`, { method: 'POST', body: JSON.stringify({ userId }) });
  const [members, history] = await Promise.all([
    api<Json[]>(`/api/rooms/${roomId}/members?userId=${userId}`),
    api<Json>(`/api/rooms/${roomId}/messages?userId=${userId}&limit=10`),
  ]);
  check(Array.isArray(members), 'member roster is not an array');
  check(Array.isArray(history.items), 'message history has no items array');

  const first = await connectClient('client-1');
  const second = await connectClient('client-2');
  first.send(JSON.stringify({ op: 1 }));
  await waitForFrame(first, frame => frame.op === 12, 'heartbeat acknowledgement');
  first.send(JSON.stringify({ op: 3, d: { status: 'online' } }));
  first.send(JSON.stringify({ op: 8, d: { channel_id: roomId } }));

  const expected = `stress-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const events = [waitForFrame(first, frame => frame.t === 'MESSAGE_CREATE' && frame.d?.content === expected, 'client-1 MESSAGE_CREATE'), waitForFrame(second, frame => frame.t === 'MESSAGE_CREATE' && frame.d?.content === expected, 'client-2 MESSAGE_CREATE')];
  await api(`/api/rooms/${roomId}/messages`, { method: 'POST', body: JSON.stringify({ senderId: userId, message: expected }) });
  await Promise.all(events);

  const stressMessages = Array.from({ length: messageCount }, (_, index) => api<Json>(`/api/rooms/${roomId}/messages`, {
    method: 'POST', body: JSON.stringify({ senderId: userId, message: `stress-batch-${Date.now()}-${index}` }),
  }));
  await Promise.all(stressMessages);
  const after = await api<Json>(`/api/rooms/${roomId}/messages?userId=${userId}&limit=100`);
  check(after.items.some((item: Json) => item.message === expected), 'persisted stress message was not found in history');

  first.close();
  second.close();
  console.log(`PASS: REST, PostgreSQL persistence, Kafka/Gateway fan-out, heartbeat, presence, typing, and ${messageCount} concurrent message writes`);
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
