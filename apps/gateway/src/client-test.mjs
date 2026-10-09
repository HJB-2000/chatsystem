// node apps/gateway/src/client-test.mjs <aliceId> <bobId> <channelId>
// needs: gateway running, docker up, alice<->bob friends, both in channel
import WebSocket from 'ws';
import { Kafka, Partitioners } from 'kafkajs';

const [aliceId = '1', bobId = '2', channelId = '1'] = process.argv.slice(2);
const URL = 'ws://localhost:3001/gateway';
const ok = { ready: false, presence: false, typing: false, message: false };
const done = () => Object.values(ok).every(Boolean) && (console.log('PASS'), process.exit(0));

function connect(name, userId, onEvent) {
  const ws = new WebSocket(URL);
  let hb;
  ws.on('message', (raw) => {
    const m = JSON.parse(raw);
    if (m.op === 10) {
      hb = setInterval(() => ws.send(JSON.stringify({ op: 1, d: null })), m.d.heartbeat_interval);
      ws.send(JSON.stringify({ op: 2, d: { token: userId } }));
    } else if (m.op === 0) {
      console.log(name, m.t, JSON.stringify(m.d));
      onEvent(m.t, m.d, ws);
    }
  });
  ws.on('close', (c, r) => { clearInterval(hb); console.log(name, 'closed', c, r.toString()); });
}

async function publishMessage() {
  const producer = new Kafka({ brokers: ['localhost:9092'], logLevel: 0 })
    .producer({ createPartitioner: Partitioners.DefaultPartitioner });
  await producer.connect();
  await producer.send({
    topic: 'messages',
    messages: [{
      key: `channel:${channelId}`,
      value: JSON.stringify({
        channel_id: channelId,
        message_id: String(Date.now()),
        author_id: aliceId,
        content: 'hello via kafka',
        timestamp: new Date().toISOString(),
      }),
    }],
  });
  await producer.disconnect();
}

connect('bob', bobId, (t, d) => {
  if (t === 'READY') {
    connect('alice', aliceId, async (t2, _d, ws) => {
      if (t2 !== 'READY') return;
      ok.ready = true;
      ws.send(JSON.stringify({ op: 8, d: { channel_id: channelId } }));
      await publishMessage();
    });
  }
  if (t === 'PRESENCE_UPDATE' && d.user_id === aliceId && d.status === 'online') ok.presence = true;
  if (t === 'TYPING_START' && d.user_id === aliceId) ok.typing = true;
  if (t === 'MESSAGE_CREATE' && d.content === 'hello via kafka') ok.message = true;
  done();
});

setTimeout(() => { console.error('FAIL', ok); process.exit(1); }, 15000);
