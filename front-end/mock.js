// In-memory backend. Api.js falls back to this when /api/* is unreachable.
const H = 3600e3, D = 24 * H;
const ago = ms => new Date(Date.now() - ms).toISOString();
let nextId = 1000;

const db = {
  users: [
    { id: 1, username: 'Peterlim26', roleTitle: 'Owner', userTag: '0001', avatarUrl: null, status: 'online', currentActivity: 'Learning CSS' },
    { id: 2, username: 'Jenny', roleTitle: 'Rust mentor', userTag: '0002', avatarUrl: null, status: 'online', currentActivity: 'Reading tokio docs' },
    { id: 3, username: 'Joshua', roleTitle: 'Student', userTag: '0003', avatarUrl: null, status: 'idle', currentActivity: '' },
    { id: 4, username: 'JiaYiXD', roleTitle: 'Security', userTag: '0004', avatarUrl: null, status: 'dnd', currentActivity: 'Do not disturb' },
    { id: 5, username: 'Kirb', roleTitle: 'Student', userTag: '0005', avatarUrl: null, status: 'offline', currentActivity: '' },
  ],
  collectives: [
    { id: 1, name: 'Systems Lab', icon: 'lan', memberIds: [1, 2, 3, 4, 5] },
    { id: 2, name: 'Security Guild', icon: 'security', memberIds: [1, 4] },
  ],
  rooms: [
    { id: 1, collectiveId: 1, name: 'tokio-sync', topic: 'Async Rust, channels and cancellation', capacity: 10, icon: 'terminal', status: 'active', verified: true, memberIds: [1, 2, 3] },
    { id: 2, collectiveId: 1, name: 'riscv-bringup', topic: 'Boot flow and CSR notes', capacity: 6, icon: 'memory', status: 'active', verified: false, memberIds: [2, 3] },
    { id: 3, collectiveId: 1, name: 'quiet-hours', topic: 'Silent co-study', capacity: 2, icon: 'self_improvement', status: 'idle', verified: false, memberIds: [4, 5] },
    { id: 4, collectiveId: 2, name: 'ebpf-lab', topic: 'Probes, maps, verifier errors', capacity: 8, icon: 'bug_report', status: 'active', verified: true, memberIds: [1, 4] },
  ],
  messages: [],
  dms: [],
  invites: {},
};

const msg = (roomId, senderId, message, msAgo) => db.messages.push({ id: nextId++, roomId, senderId, message, createdAt: ago(msAgo), editedAt: null });
msg(1, 2, 'Welcome to **tokio-sync**. Pin anything useful.', 2 * D + H);
msg(1, 1, 'Look at this https://youtu.be/wE8s993ZV-8', D + 3 * H);
msg(1, 2, 'Minimal worker pool:\n```rust\nlet (tx, mut rx) = mpsc::channel(32);\ntokio::spawn(async move {\n    while let Some(job) = rx.recv().await { job.run().await; }\n});\n```', 3 * H);
msg(1, 3, '@Jenny does `select!` drop the losing branch?', 2 * H);
msg(1, 2, '> @Joshua: does select! drop the losing branch?\nYes, futures are dropped. ~~Always cancel-safe~~ only if you design for it. ||use biased; for fairness||', 2 * H - 60e3);
msg(2, 2, 'mtvec set. Next: trap handler.', H);
db.dms.push({ id: nextId++, a: 2, b: 1, message: 'Review my channel code later?', createdAt: ago(H), read: false });
db.dms.push({ id: nextId++, a: 1, b: 2, message: 'Sure, send it over.', createdAt: ago(H / 2), read: true });

const user = id => db.users.find(u => u.id === Number(id));
const fail = m => { throw new Error(m); };
const pick = (o, keys) => Object.fromEntries(keys.filter(k => k in o).map(k => [k, o[k]]));
const roomOut = (r, uid) => ({
  id: r.id, collectiveId: r.collectiveId, collectiveName: db.collectives.find(c => c.id === r.collectiveId)?.name,
  name: r.name, topic: r.topic, capacity: r.capacity, icon: r.icon, status: r.status, verified: r.verified,
  memberCount: r.memberIds.length, isMember: r.memberIds.includes(Number(uid)),
  onlineCount: r.memberIds.filter(i => user(i)?.status === 'online').length,
});
const msgOut = m => ({ ...m, senderName: user(m.senderId)?.username || 'Unknown', avatarUrl: user(m.senderId)?.avatarUrl || null });
const label = iso => {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  return m < 1 ? 'now' : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
};
const dmWith = (a, b) => db.dms.filter(d => (d.a === a && d.b === b) || (d.a === b && d.b === a)).sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt));

const routes = [
  ['GET', /^\/api\/users$/, () => db.users],
  ['GET', /^\/api\/users\/(\d+)$/, ({ m }) => user(m[1]) || fail('User not found')],
  ['PATCH', /^\/api\/users\/(\d+)$/, ({ m, body }) => {
    const u = user(m[1]) || fail('User not found');
    if (body.status && !['online', 'idle', 'dnd', 'offline'].includes(body.status)) fail('Invalid status');
    return Object.assign(u, pick(body, ['status', 'currentActivity', 'roleTitle']));
  }],
  ['GET', /^\/api\/collectives$/, ({ q }) => db.collectives.filter(c => c.memberIds.includes(Number(q.get('userId')))).map(c => pick(c, ['id', 'name', 'icon']))],
  ['POST', /^\/api\/collectives$/, ({ body }) => {
    const name = String(body.name || '').trim();
    if (!name) fail('Name is required');
    const c = { id: nextId++, name, icon: 'hub', memberIds: [Number(body.userId)] };
    db.collectives.push(c);
    return pick(c, ['id', 'name', 'icon']);
  }],
  ['GET', /^\/api\/collectives\/(\d+)\/rooms$/, ({ m, q }) => db.rooms.filter(r => r.collectiveId === Number(m[1])).map(r => roomOut(r, q.get('userId')))],
  ['POST', /^\/api\/collectives\/(\d+)\/rooms$/, ({ m, body }) => {
    const name = String(body.name || '').trim().toLowerCase().replace(/\s+/g, '-');
    const capacity = Number(body.capacity);
    if (!name) fail('Room name is required');
    if (!(capacity >= 2 && capacity <= 100)) fail('Capacity must be 2-100');
    const r = { id: nextId++, collectiveId: Number(m[1]), name, topic: body.topic || '', capacity, icon: 'tag', status: 'active', verified: false, memberIds: [Number(body.userId)] };
    db.rooms.push(r);
    return roomOut(r, body.userId);
  }],
  ['POST', /^\/api\/collectives\/(\d+)\/invites$/, ({ m }) => {
    const token = Math.random().toString(36).slice(2, 10);
    db.invites[token] = Number(m[1]);
    return { token };
  }],
  ['POST', /^\/api\/invites\/([^/]+)\/join$/, ({ m, body }) => {
    const c = db.collectives.find(x => x.id === db.invites[m[1]]) || fail('Invite is invalid or expired');
    if (!c.memberIds.includes(Number(body.userId))) c.memberIds.push(Number(body.userId));
    return pick(c, ['id', 'name', 'icon']);
  }],
  ['POST', /^\/api\/rooms\/(\d+)\/join$/, ({ m, body }) => {
    const r = db.rooms.find(x => x.id === Number(m[1])) || fail('Room not found');
    if (r.memberIds.includes(Number(body.userId))) return roomOut(r, body.userId);
    if (r.memberIds.length >= r.capacity) fail('Room is full');
    r.memberIds.push(Number(body.userId));
    return roomOut(r, body.userId);
  }],
  ['GET', /^\/api\/rooms\/(\d+)\/members$/, ({ m }) => (db.rooms.find(x => x.id === Number(m[1])) || fail('Room not found')).memberIds.map(user)],
  ['GET', /^\/api\/rooms\/(\d+)\/messages$/, ({ m, q }) => db.messages.filter(x => x.roomId === Number(m[1])).slice(-Number(q.get('limit') || 50)).map(msgOut)],
  ['POST', /^\/api\/rooms\/(\d+)\/messages$/, ({ m, body }) => {
    const r = db.rooms.find(x => x.id === Number(m[1])) || fail('Room not found');
    if (!r.memberIds.includes(Number(body.senderId))) fail('Join the room first');
    const text = String(body.message || '').trim();
    if (!text) fail('Message is empty');
    if (text.length > 2000) fail('Message exceeds 2000 characters');
    const row = { id: nextId++, roomId: r.id, senderId: Number(body.senderId), message: text, createdAt: new Date().toISOString(), editedAt: null };
    db.messages.push(row);
    return msgOut(row);
  }],
  ['PATCH', /^\/api\/rooms\/(\d+)\/messages\/(\d+)$/, ({ m, body }) => {
    const row = db.messages.find(x => x.id === Number(m[2]) && x.roomId === Number(m[1])) || fail('Message not found');
    if (row.senderId !== Number(body.userId)) fail('Only the author can edit');
    const text = String(body.message || '').trim();
    if (!text || text.length > 2000) fail('Invalid message');
    Object.assign(row, { message: text, editedAt: new Date().toISOString() });
    return msgOut(row);
  }],
  ['DELETE', /^\/api\/rooms\/(\d+)\/messages\/(\d+)$/, ({ m, q }) => {
    const i = db.messages.findIndex(x => x.id === Number(m[2]) && x.roomId === Number(m[1]));
    if (i < 0) fail('Message not found');
    if (db.messages[i].senderId !== Number(q.get('userId'))) fail('Only the author can delete');
    db.messages.splice(i, 1);
    return { ok: true };
  }],
  ['GET', /^\/api\/dms\/(\d+)$/, ({ m }) => {
    const me = Number(m[1]);
    const partners = [...new Set(db.dms.filter(d => d.a === me || d.b === me).map(d => (d.a === me ? d.b : d.a)))];
    return partners.map(pid => {
      const h = dmWith(me, pid), last = h.at(-1), u = user(pid);
      return { id: pid, name: u.username, roleTitle: u.roleTitle, avatarUrl: u.avatarUrl, status: u.status, subject: u.currentActivity,
        lastMessage: last.message, lastActiveLabel: label(last.createdAt), unreadCount: h.filter(d => d.b === me && !d.read).length };
    });
  }],
  ['GET', /^\/api\/dms\/(\d+)\/(\d+)$/, ({ m }) => dmWith(Number(m[1]), Number(m[2])).map(d => ({ id: d.id, senderId: d.a, message: d.message, createdAt: d.createdAt }))],
  ['POST', /^\/api\/dms\/(\d+)\/(\d+)$/, ({ m, body }) => {
    const text = String(body.message || '').trim();
    if (!text) fail('Message is empty');
    db.dms.push({ id: nextId++, a: Number(m[1]), b: Number(m[2]), message: text, createdAt: new Date().toISOString(), read: false });
    return { ok: true };
  }],
  ['PATCH', /^\/api\/dms\/(\d+)\/(\d+)\/read$/, ({ m }) => {
    db.dms.filter(d => d.a === Number(m[2]) && d.b === Number(m[1])).forEach(d => (d.read = true));
    return { ok: true };
  }],
];

export async function mockRequest(url, options = {}) {
  await new Promise(r => setTimeout(r, 40));
  const method = (options.method || 'GET').toUpperCase();
  const u = new URL(url, location.origin);
  const body = options.body ? JSON.parse(options.body) : {};
  for (const [verb, re, fn] of routes) {
    const m = verb === method && u.pathname.match(re);
    if (m) return structuredClone(await fn({ m, q: u.searchParams, body }));
  }
  throw new Error(`No mock route: ${method} ${u.pathname}`);
}
