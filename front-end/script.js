import * as api from './Api.js';
import * as R from './render.js';

/* ============ helpers ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const setText = (sel, v) => $$(sel).forEach(el => { el.textContent = v ?? ''; });
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};
const MAX_LEN = 2000;
const POLL_MS = 4000;

const S = {
  userId: 1, user: null, users: [],
  collectives: [], collectiveId: null, collective: null,
  rooms: [], roomId: null, room: null, members: [],
  messages: [], pending: [], sig: '',
  dms: [], dmPartner: null,
  replyTo: null, files: [], pins: new Set(), reactions: {},
  search: '', stick: true, unseen: 0, editing: null,
  emojiTarget: null, mention: null, muted: {}, huddle: null, loadSeq: 0, pollTick: 0,
};

const shell = $('#chat-shell');
const box = $('#chat-messages-container');
const list = $('#msg-list');
const input = $('#channel-message-input');

/* ============ toast + form dialog ============ */
let toastTimer;
function toast(title, message = '') {
  const el = $('#toast');
  $('.toast__title', el).textContent = title;
  $('.toast__msg', el).textContent = message;
  $('.toast__msg', el).hidden = !message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3400);
}

function askForm({ title, submit = 'Save', fields, validate }) {
  return new Promise(resolve => {
    const dlg = $('#form-dialog');
    const form = $('#form-dialog-form');
    const err = $('#form-dialog-error');
    $('#form-dialog-title').textContent = title;
    $('#form-dialog-submit').textContent = submit;
    err.hidden = true;
    $('#form-dialog-fields').innerHTML = fields.map(f => {
      const id = `ff-${f.name}`;
      const control = f.type === 'select'
        ? `<select id="${id}" name="${f.name}" class="field__input">${f.options.map(o => `<option value="${R.esc(o.value)}"${o.value === f.value ? ' selected' : ''}>${R.esc(o.label)}</option>`).join('')}</select>`
        : `<input id="${id}" name="${f.name}" type="${f.type || 'text'}" value="${R.esc(f.value ?? '')}" class="field__input" autocomplete="off"${f.required ? ' required' : ''}${f.readonly ? ' readonly' : ''}${f.min != null ? ` min="${f.min}"` : ''}${f.max != null ? ` max="${f.max}"` : ''}${f.maxlength ? ` maxlength="${f.maxlength}"` : ''}>`;
      return `<div class="field"><label class="field__label" for="${id}">${R.esc(f.label)}</label>${control}${f.help ? `<p class="field__help">${R.esc(f.help)}</p>` : ''}</div>`;
    }).join('');

    let result = null;
    const onClose = () => { dlg.removeEventListener('close', onClose); resolve(result); };
    dlg.addEventListener('close', onClose);
    form.onsubmit = e => {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      const problem = validate?.(values);
      if (problem) { err.textContent = problem; err.hidden = false; return; }
      result = values;
      dlg.close();
    };
    $('#form-dialog-cancel').onclick = () => dlg.close();
    dlg.onclick = e => { if (e.target === dlg) dlg.close(); };
    dlg.showModal();
    $('#form-dialog-fields input:not([readonly]), #form-dialog-fields select')?.focus();
  });
}

/* ============ layout: drawers by measured width ============ */
function syncScrim() {
  const mode = shell.dataset.mode;
  const on = (mode !== 'wide' && shell.dataset.members === 'open') || (mode === 'narrow' && shell.dataset.channels === 'open');
  shell.dataset.scrim = on ? 'on' : 'off';
  $('#btn-members').setAttribute('aria-expanded', String(shell.dataset.members === 'open'));
  $('#btn-channels').setAttribute('aria-expanded', String(shell.dataset.channels === 'open'));
}
function applyMode() {
  const w = shell.clientWidth;
  const mode = w >= 1280 ? 'wide' : w >= 860 ? 'mid' : 'narrow';
  if (mode === shell.dataset.mode) return;
  shell.dataset.mode = mode;
  shell.dataset.channels = mode === 'narrow' ? 'closed' : 'open';
  shell.dataset.members = mode === 'wide' ? 'open' : 'closed';
  syncScrim();
}
const setChannels = open => { shell.dataset.channels = open ? 'open' : 'closed'; syncScrim(); paintCollectives(); };
const setMembers = open => { shell.dataset.members = open ? 'open' : 'closed'; syncScrim(); };
function closeDrawers() {
  if (shell.dataset.mode !== 'wide') shell.dataset.members = 'closed';
  if (shell.dataset.mode === 'narrow') shell.dataset.channels = 'closed';
  syncScrim();
}
new ResizeObserver(applyMode).observe(shell);
applyMode();

/* ============ popovers ============ */
function closePops(except) {
  $$('.pop').forEach(p => { if (p !== except && !p.classList.contains('mention-pop')) p.hidden = true; });
  ['btn-more', 'pins-btn'].forEach(id => $(`#${id}`).setAttribute('aria-expanded', 'false'));
}
function togglePop(pop, trigger) {
  const open = pop.hidden;
  closePops();
  pop.hidden = !open;
  trigger?.setAttribute('aria-expanded', String(open));
  return open;
}
function openEmojiPop(anchor, target) {
  const pop = $('#emoji-pop');
  if (!pop.hidden && S.emojiTarget?.type === target.type && S.emojiTarget?.id === target.id) { pop.hidden = true; return; }
  closePops();
  S.emojiTarget = target;
  pop.hidden = false;
  const r = anchor.getBoundingClientRect();
  const w = pop.offsetWidth, h = pop.offsetHeight;
  pop.style.left = `${Math.min(Math.max(8, r.left), innerWidth - w - 8)}px`;
  const above = r.top - h - 8;
  pop.style.top = `${above >= 8 ? above : Math.min(r.bottom + 8, innerHeight - h - 8)}px`;
}

/* ============ user ============ */
async function loadUser() {
  try {
    S.user = await api.getUser(S.userId);
    paintUser();
  } catch (e) { toast('Could not load user', e.message); }
}
function paintUser() {
  const u = S.user;
  if (!u) return;
  setText('[data-user-name]', u.username);
  setText('[data-user-role]', u.roleTitle || 'New user');
  setText('[data-user-tag]', u.userTag ? `#${u.userTag}` : 'New user');
  const dot = { online: 'bg-secondary', idle: 'bg-amber-400', dnd: 'bg-tertiary-container' }[u.status] || 'bg-text-muted';
  const av = R.avatar({ name: u.username, avatarUrl: u.avatarUrl }, 32);
  $('#top-avatar').innerHTML = `${av}<span class="status-dot ${dot}" style="box-shadow:0 0 0 2px #111827"></span>`;
  $('#rail-avatar').innerHTML = `${av}<span class="status-dot ${dot}" style="box-shadow:0 0 0 2px #070e1d"></span>`;
  $('#switch-label').textContent = `Switch user (${u.username})`;
}
async function editProfile() {
  if (!S.user) return;
  const v = await askForm({
    title: 'Profile and status', submit: 'Save',
    fields: [
      { name: 'status', label: 'Status', type: 'select', value: S.user.status || 'online', options: [
        { value: 'online', label: 'Online' }, { value: 'idle', label: 'Idle' }, { value: 'dnd', label: 'Do not disturb' }, { value: 'offline', label: 'Offline' }] },
      { name: 'currentActivity', label: 'Current activity', value: S.user.currentActivity || '', maxlength: 255 },
    ],
  });
  if (!v) return;
  try {
    S.user = await api.updateUser(S.userId, v);
    paintUser();
    refreshMembers();
    toast('Profile saved');
  } catch (e) { toast('Could not save', e.message); }
}

/* ============ collectives ============ */
async function loadCollectives(selectedId) {
  try { S.collectives = (await api.getCollectives(S.userId)) || []; }
  catch (e) { S.collectives = []; toast('Could not load collectives', e.message); }
  const sel = S.collectives.find(c => c.id === selectedId) || S.collectives.find(c => c.id === S.collectiveId) || S.collectives[0] || null;
  const changed = sel?.id !== S.collectiveId;
  S.collectiveId = sel?.id ?? null;
  S.collective = sel;
  paintCollectives();
  if (changed) resetRoom();
  await loadRooms();
}
function paintCollectives() { $('#collective-rail').innerHTML = R.collectiveRailHtml(S.collectives, S.collectiveId); }

async function createCollective() {
  const v = await askForm({ title: 'Create collective', submit: 'Create', fields: [{ name: 'name', label: 'Name', required: true, maxlength: 60 }] });
  if (!v?.name.trim()) return;
  try { const c = await api.createCollective(S.userId, v.name.trim()); await loadCollectives(c.id); toast('Collective created', c.name); }
  catch (e) { toast('Could not create collective', e.message); }
}
async function joinCollective() {
  const v = await askForm({ title: 'Join a collective', submit: 'Join', fields: [{ name: 'token', label: 'Invite token', required: true }] });
  if (!v?.token.trim()) return;
  try { const c = await api.joinCollective(v.token.trim(), S.userId); await loadCollectives(c.id); toast('Joined', c.name); }
  catch (e) { toast('Invite failed', e.message); }
}
async function createInvite() {
  if (!S.collectiveId) return toast('No collective selected', 'Create or join one first.');
  try {
    const { token } = await api.createInvite(S.collectiveId, S.userId);
    const v = await askForm({ title: 'Invite token', submit: 'Copy token', fields: [{ name: 'token', label: 'Share this token', value: token, readonly: true }] });
    if (v) { await navigator.clipboard?.writeText(token).catch(() => {}); toast('Token copied'); }
  } catch (e) { toast('Could not create invite', e.message); }
}

/* ============ rooms ============ */
async function loadRooms() {
  let rooms = [];
  if (S.collectiveId) {
    try { rooms = (await api.getCollectiveRooms(S.collectiveId, S.userId)) || []; }
    catch (e) { toast('Could not load rooms', e.message); }
  }
  S.rooms = rooms;
  const cur = rooms.find(r => r.id === S.roomId);
  if (cur) S.room = { ...S.room, ...cur };
  paintRooms();
  paintHeader();
  if (!cur) {
    const next = rooms.find(r => r.isMember);
    if (next) await openRoom(next); else resetRoom();
  }
}
function paintRooms() {
  const el = $('#rooms-list');
  el.innerHTML = S.rooms.length ? S.rooms.map(r => R.roomCard(r, S.roomId)).join('') : '<div class="empty">No rooms yet. Create one with +.</div>';
}
function paintHeader() {
  const r = S.room;
  setText('[data-collective-name]', S.collective?.name || 'No collective');
  setText('[data-collective-online-count]', `${S.rooms.reduce((n, x) => n + (x.onlineCount || 0), 0)} online`);
  setText('[data-collective-labs-count]', `${S.rooms.filter(x => x.status === 'active').length} labs active`);
  setText('#active-stage-title', r ? `#${r.name}` : 'Select a room');
  setText('#active-stage-desc', r ? (r.topic || 'No topic set') : 'Pick or create a room to start chatting');
  setText('[data-room-seats]', r ? `${r.memberCount ?? 0} / ${r.capacity ?? 0} seats` : '');
  $('#room-seats-pill').hidden = !r;
  document.title = r ? `#${r.name} · NexusCampus` : 'NexusCampus';
}
async function createRoom() {
  if (!S.collectiveId) return toast('No collective selected', 'Create or join one first.');
  const v = await askForm({
    title: 'Create room', submit: 'Create',
    fields: [
      { name: 'name', label: 'Name', required: true, maxlength: 40 },
      { name: 'topic', label: 'Topic (optional)', maxlength: 120 },
      { name: 'capacity', label: 'Capacity', type: 'number', value: 10, min: 2, max: 100, required: true, help: 'Between 2 and 100 seats.' },
    ],
  });
  if (!v?.name.trim()) return;
  try {
    const room = await api.createCollectiveRoom(S.collectiveId, { userId: S.userId, name: v.name.trim(), topic: v.topic, capacity: Number(v.capacity) || 10 });
    await loadRooms();
    await openRoom(S.rooms.find(r => r.id === room.id) || room);
  } catch (e) { toast('Could not create room', e.message); }
}
async function onRoomClick(room) {
  if (room.isMember) return openRoom(room);
  try {
    await api.joinRoom(room.id, S.userId);
    await loadRooms();
    await openRoom(S.rooms.find(r => r.id === room.id) || { ...room, isMember: true });
  } catch (e) { toast('Could not join room', e.message); }
}

function resetRoom() {
  stopPolling();
  saveDraft();
  S.roomId = null; S.room = null; S.messages = []; S.pending = []; S.members = []; S.sig = '';
  S.replyTo = null; S.editing = null; S.pins = new Set(); S.reactions = {};
  input.value = ''; input.disabled = true; input.placeholder = 'Select a room to start chatting';
  autosize(); updateReplyBar(); updateSend();
  list.innerHTML = R.welcomeHtml(null) + R.emptyHtml('Create or join a room to see its messages.');
  $('#room-roster').innerHTML = '<div class="empty">Join a room to see its roster.</div>';
  setText('[data-roster-count]', '0 online');
  setStatus('Idle');
  paintRooms(); paintHeader(); updateJump();
}

async function openRoom(room) {
  if (S.roomId === room.id && S.room) { closeDrawers(); input.focus(); return; }
  saveDraft();
  clearSearch(true);
  S.roomId = room.id; S.room = room;
  S.messages = []; S.pending = []; S.members = []; S.sig = '';
  S.replyTo = null; S.editing = null; S.files = []; S.unseen = 0; S.stick = true;
  S.pins = new Set(store.get(`nc:pins:${room.id}`, []));
  S.reactions = store.get(`nc:react:${room.id}`, {});
  S.muted[room.id] ??= store.get(`nc:mute:${room.id}`, false);
  paintRooms(); paintHeader(); updateReplyBar(); paintChips(); paintMuteMenu();
  input.disabled = false;
  input.placeholder = `Message #${room.name}`;
  input.value = store.get(`nc:draft:${room.id}`, '');
  autosize(); updateSend(); updateCounter();
  list.innerHTML = R.welcomeHtml(room) + R.skeletonHtml();
  setStatus('Loading');
  closeDrawers();
  const seq = ++S.loadSeq;
  await Promise.all([refreshMessages({ initial: true }), refreshMembers()]);
  if (seq === S.loadSeq) startPolling();
}

/* ============ members ============ */
async function refreshMembers() {
  if (!S.roomId) return;
  const id = S.roomId;
  try {
    const members = (await api.getRoomMembers(id, S.userId)) || [];
    if (id !== S.roomId) return;
    S.members = members;
    $('#room-roster').innerHTML = R.rosterHtml(members);
    const online = members.filter(m => m.status && m.status !== 'offline').length;
    setText('[data-roster-count]', `${online} online`);
    if (S.room) { S.room.memberCount = members.length; paintHeader(); }
  } catch { /* roster is non-critical; status pill covers connectivity */ }
}

/* ============ messages ============ */
const atBottom = () => box.scrollHeight - box.scrollTop - box.clientHeight < 80;
const scrollToBottom = () => { box.scrollTop = box.scrollHeight; S.stick = true; S.unseen = 0; updateJump(); };

function setStatus(text) {
  const el = $('#room-connection-status');
  el.textContent = text;
  el.className = `pill hide-md${text === 'Live' ? ' pill--live' : text === 'Offline' || text === 'Send failed' ? ' pill--bad' : ''}`;
}
const ctx = () => ({ userId: S.userId, pins: S.pins, reactions: S.reactions, flat: Boolean(S.search.trim()) });

function visibleMessages() {
  const all = [...S.messages, ...S.pending];
  const q = S.search.trim().toLowerCase();
  return q ? all.filter(m => String(m.message).toLowerCase().includes(q) || String(m.senderName || '').toLowerCase().includes(q)) : all;
}

function renderMessages({ stick = false, fresh = 0 } = {}) {
  const prevTop = box.scrollTop;
  const q = S.search.trim();
  const msgs = visibleMessages();
  let html;
  if (q) html = msgs.length ? R.messagesHtml(msgs, ctx()) : R.emptyHtml(`No messages match “${R.esc(q)}”.`);
  else if (!msgs.length) html = R.welcomeHtml(S.room) + R.emptyHtml('No messages yet. Say hello.');
  else html = R.welcomeHtml(S.room) + R.messagesHtml(msgs, ctx());
  list.innerHTML = html;
  if (q) $$('.msg__content', list).forEach(el => highlight(el, q));
  setText('#search-count', q ? `${msgs.length} result${msgs.length === 1 ? '' : 's'}` : '');
  if (stick) scrollToBottom();
  else {
    box.scrollTop = prevTop;
    if (fresh) S.unseen += fresh;
    updateJump();
  }
  if (!S.search.trim()) renderPins(true);
}

function highlight(root, q) {
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const text = n.nodeValue;
    if (text.search(re) < 0) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    text.replace(re, (m, off) => {
      frag.append(text.slice(last, off));
      const mk = document.createElement('mark');
      mk.textContent = m;
      frag.append(mk);
      last = off + m.length;
      return m;
    });
    frag.append(text.slice(last));
    n.replaceWith(frag);
  }
}

async function refreshMessages({ initial = false } = {}) {
  if (!S.roomId) return;
  const id = S.roomId;
  try {
    const msgs = ((await api.getRoomMessages(id, S.userId, 100)) || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (id !== S.roomId) return;
    setStatus('Live');
    const sig = msgs.map(m => `${m.id}:${m.editedAt || ''}`).join('|');
    if (sig === S.sig && !initial) return;
    const known = new Set(S.messages.map(m => m.id));
    const fresh = initial ? 0 : msgs.filter(m => !known.has(m.id) && m.senderId !== S.userId).length;
    S.sig = sig;
    S.messages = msgs;
    if (S.editing) return;
    renderMessages({ stick: initial || S.stick, fresh });
  } catch (e) {
    if (id !== S.roomId) return;
    setStatus('Offline');
    if (initial) {
      list.innerHTML = R.welcomeHtml(S.room) + R.emptyHtml(`Could not load messages: ${R.esc(e.message)}. <button type="button" data-act="reload">Retry</button>`);
    }
  }
}

function startPolling() {
  stopPolling();
  S.poll = setInterval(() => {
    if (document.hidden || S.editing) return;
    refreshMessages();
    if (++S.pollTick % 3 === 0) refreshMembers();
  }, POLL_MS);
}
function stopPolling() { clearInterval(S.poll); S.poll = null; }
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.roomId) refreshMessages(); });

function updateJump() {
  const btn = $('#jump-btn');
  const show = Boolean(S.roomId) && !atBottom();
  btn.hidden = !show;
  if (show) $('#jump-label').textContent = S.unseen ? `${S.unseen} new message${S.unseen > 1 ? 's' : ''}` : 'Jump to present';
}
box.addEventListener('scroll', () => {
  S.stick = atBottom();
  if (S.stick) S.unseen = 0;
  updateJump();
}, { passive: true });
list.addEventListener('load', e => { if (S.stick && e.target.tagName === 'IMG') box.scrollTop = box.scrollHeight; }, true);
$('#jump-btn').addEventListener('click', () => { scrollToBottom(); });

// broken images: avatars fall back to initials, embeds are removed
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName !== 'IMG') return;
  if (img.dataset.ini !== undefined) {
    const span = document.createElement('span');
    span.className = 'avatar';
    span.style.cssText = `${img.getAttribute('style')};background:${img.dataset.bg}`;
    span.textContent = img.dataset.ini;
    img.replaceWith(span);
  } else if ('embed' in img.dataset) img.closest('.embed')?.remove();
}, true);

/* ---- per-message actions ---- */
const findMsg = id => [...S.messages, ...S.pending].find(m => String(m.id) === String(id));

list.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  const el = e.target.closest('.msg');
  if (!act) {
    if (el && matchMedia('(hover: none)').matches && !e.target.closest('a')) {
      const was = el.classList.contains('is-active');
      $$('.msg.is-active', list).forEach(x => x.classList.remove('is-active'));
      el.classList.toggle('is-active', !was);
    }
    return;
  }
  const id = el?.dataset.id;
  switch (act.dataset.act) {
    case 'spoiler': act.classList.toggle('revealed'); break;
    case 'copy-code': copy($('code', act.closest('.codeblock')).textContent, 'Code copied'); break;
    case 'react': e.stopPropagation(); openEmojiPop(act, { type: 'react', id }); break;
    case 'toggle-react': toggleReaction(id, act.dataset.emoji); break;
    case 'reply': startReply(id); break;
    case 'copy': copy(R.splitReply(findMsg(id)?.message).body, 'Message copied'); break;
    case 'pin': togglePin(id); break;
    case 'edit': startEdit(id); break;
    case 'delete': deleteMessage(id); break;
    case 'retry': retryMessage(id); break;
    case 'discard': S.pending = S.pending.filter(p => String(p.id) !== id); renderMessages({ stick: false }); break;
    case 'reload': setStatus('Loading'); refreshMessages({ initial: true }); break;
  }
});
list.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.spoiler')) { e.preventDefault(); e.target.classList.toggle('revealed'); }
});

async function copy(text, label) {
  try { await navigator.clipboard.writeText(text); toast(label); }
  catch { toast('Copy blocked by the browser'); }
}

function toggleReaction(id, emoji) {
  const r = (S.reactions[id] ??= {});
  const users = (r[emoji] ??= []);
  const i = users.indexOf(S.userId);
  if (i >= 0) users.splice(i, 1); else users.push(S.userId);
  if (!users.length) delete r[emoji];
  if (!Object.keys(r).length) delete S.reactions[id];
  store.set(`nc:react:${S.roomId}`, S.reactions);
  renderMessages({ stick: false });
}

function togglePin(id) {
  const key = String(id);
  if (S.pins.has(key)) S.pins.delete(key); else S.pins.add(key);
  store.set(`nc:pins:${S.roomId}`, [...S.pins]);
  toast(S.pins.has(key) ? 'Message pinned' : 'Message unpinned', 'Pins are saved on this device.');
  renderMessages({ stick: false });
}
function renderPins(quiet) {
  const panel = $('#pins-panel');
  const pinned = S.messages.filter(m => S.pins.has(String(m.id)));
  panel.innerHTML = `<h2>Pinned messages (${pinned.length})</h2>${pinned.length
    ? pinned.map(m => `<button type="button" class="pin-item" data-jump="${R.esc(m.id)}"><small>${R.esc(m.senderName)} · ${R.esc(R.stamp(new Date(m.createdAt)))}</small><span>${R.esc(R.splitReply(m.message).body)}</span></button>`).join('')
    : '<p class="empty">Nothing pinned. Use the pin tool on any message.</p>'}`;
  if (!quiet) togglePin_open();
}
function togglePin_open() { togglePop($('#pins-panel'), $('#pins-btn')); }
$('#pins-panel').addEventListener('click', e => {
  const b = e.target.closest('[data-jump]');
  if (!b) return;
  $('#pins-panel').hidden = true;
  scrollToMessage(b.dataset.jump);
});
function scrollToMessage(id) {
  if (S.search) clearSearch();
  const el = $(`.msg[data-id="${CSS.escape(String(id))}"]`, list);
  if (!el) return toast('Message not in the loaded history');
  el.scrollIntoView({ block: 'center' });
  el.classList.add('msg--flash');
  setTimeout(() => el.classList.remove('msg--flash'), 1700);
}

/* ---- reply ---- */
function startReply(id) {
  const m = findMsg(id);
  if (!m) return;
  const snippet = R.splitReply(m.message).body.replace(/\s+/g, ' ').trim().slice(0, 80);
  S.replyTo = { id, name: m.senderName || 'Unknown', snippet };
  updateReplyBar();
  input.focus();
}
function updateReplyBar() {
  const bar = $('#reply-bar');
  bar.hidden = !S.replyTo;
  if (S.replyTo) { $('#reply-name').textContent = `@${S.replyTo.name}`; $('#reply-snippet').textContent = S.replyTo.snippet; }
}
$('#reply-cancel').addEventListener('click', () => { S.replyTo = null; updateReplyBar(); input.focus(); });

/* ---- edit / delete ---- */
function startEdit(id) {
  const m = findMsg(id);
  if (!m || m.senderId !== S.userId || S.editing) return;
  const article = $(`.msg[data-id="${CSS.escape(String(id))}"]`, list);
  const content = $('.msg__content', article);
  if (!content) return;
  S.editing = String(id);
  const { quote, body } = R.splitReply(m.message);
  content.innerHTML = '<textarea class="edit-box" rows="2" aria-label="Edit message"></textarea><p class="edit-hint">Enter to save · Esc to cancel</p>';
  const ta = $('textarea', content);
  ta.value = body;
  ta.style.height = `${Math.min(ta.scrollHeight + 2, 200)}px`;
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
  ta.addEventListener('keydown', async ev => {
    if (ev.key === 'Escape') { ev.preventDefault(); cancelEdit(); }
    else if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) {
      ev.preventDefault();
      const text = ta.value.trim();
      if (!text) return toast('Message cannot be empty', 'Use Delete to remove it.');
      if (text.length > MAX_LEN) return toast(`Limit is ${MAX_LEN} characters`);
      if (text === body.trim()) return cancelEdit();
      ta.disabled = true;
      try {
        await api.updateRoomMessage(S.roomId, id, S.userId, (quote ? `> ${quote}\n` : '') + text);
        S.editing = null;
        await refreshMessages({ initial: true });
      } catch (err) {
        toast('Edit failed', err.message);
        cancelEdit();
      }
    }
  });
}
function cancelEdit() { S.editing = null; renderMessages({ stick: false }); }

async function deleteMessage(id) {
  if (!confirm('Delete this message? This cannot be undone.')) return;
  try {
    await api.deleteRoomMessage(S.roomId, id, S.userId);
    S.pins.delete(String(id));
    store.set(`nc:pins:${S.roomId}`, [...S.pins]);
    delete S.reactions[id];
    await refreshMessages({ initial: true });
    toast('Message deleted');
  } catch (e) { toast('Delete failed', e.message); }
}

/* ============ composer ============ */
function autosize() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, Math.max(96, innerHeight * 0.3))}px`;
}
function updateSend() { $('#send-btn').disabled = !S.roomId || (!input.value.trim() && !S.files.length); }
function updateCounter() {
  const n = input.value.length;
  const el = $('#char-count');
  el.hidden = n < MAX_LEN * 0.8;
  el.textContent = `${n}/${MAX_LEN}`;
  el.classList.toggle('is-over', n > MAX_LEN);
}
let draftTimer;
function saveDraft() {
  if (!S.roomId) return;
  clearTimeout(draftTimer);
  const v = input.value;
  store.set(`nc:draft:${S.roomId}`, v.trim() ? v : '');
}
input.addEventListener('input', () => {
  autosize(); updateSend(); updateCounter(); updateMention();
  clearTimeout(draftTimer);
  draftTimer = setTimeout(saveDraft, 400);
});
window.addEventListener('beforeunload', saveDraft);
window.addEventListener('resize', autosize);

input.addEventListener('keydown', e => {
  if (S.mention) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = S.mention.items.length;
      S.mention.index = (S.mention.index + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
      paintMention();
      return;
    }
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pickMention(S.mention.index); return; }
    if (e.key === 'Escape') { e.preventDefault(); hideMention(); return; }
  }
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendMessage(); return; }
  if (e.key === 'ArrowUp' && !input.value) {
    const last = [...S.messages].reverse().find(m => m.senderId === S.userId);
    if (last) { e.preventDefault(); scrollToMessage(last.id); startEdit(last.id); }
  }
  if (e.key === 'Escape' && S.replyTo) { S.replyTo = null; updateReplyBar(); }
});
$('#message-form').addEventListener('submit', e => { e.preventDefault(); sendMessage(); });

async function sendMessage() {
  if (!S.roomId || input.disabled) return;
  let text = input.value.trim();
  if (!text && !S.files.length) return;
  if (S.files.length) text = [text, ...S.files.map(f => `📎 ${f.name}`)].filter(Boolean).join('\n');
  if (S.replyTo) text = `> @${S.replyTo.name}: ${S.replyTo.snippet}\n${text}`;
  if (text.length > MAX_LEN) return toast(`Limit is ${MAX_LEN} characters`, `Current: ${text.length}`);

  const temp = { id: `tmp-${Date.now()}`, senderId: S.userId, senderName: S.user?.username || 'You', avatarUrl: S.user?.avatarUrl, message: text, createdAt: new Date().toISOString(), _pending: true, _text: text };
  S.pending.push(temp);
  input.value = ''; S.replyTo = null; S.files = [];
  store.set(`nc:draft:${S.roomId}`, '');
  autosize(); updateSend(); updateCounter(); updateReplyBar(); paintChips(); hideMention();
  renderMessages({ stick: true });
  input.focus();
  await deliver(temp);
}
async function deliver(temp) {
  const roomId = S.roomId;
  try {
    await api.createRoomMessage(roomId, S.userId, temp._text);
    S.pending = S.pending.filter(p => p !== temp);
    if (roomId === S.roomId) { S.stick = true; await refreshMessages({ initial: true }); }
  } catch (e) {
    temp._pending = false; temp._failed = true;
    setStatus('Send failed');
    toast('Message not sent', e.message);
    if (roomId === S.roomId) renderMessages({ stick: true });
  }
}
function retryMessage(id) {
  const temp = S.pending.find(p => String(p.id) === String(id));
  if (!temp) return;
  temp._failed = false; temp._pending = true;
  renderMessages({ stick: true });
  deliver(temp);
}

/* ---- toolbar buttons ---- */
$('#code-btn').addEventListener('click', () => {
  if (input.disabled) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  const selected = input.value.slice(start, end);
  const before = input.value.slice(0, start);
  const glue = before && !before.endsWith('\n') ? '\n' : '';
  const block = `${glue}\`\`\`\n${selected}\n\`\`\`\n`;
  input.value = before + block + input.value.slice(end);
  const caret = start + glue.length + 4 + selected.length;
  input.focus();
  input.setSelectionRange(caret, caret);
  input.dispatchEvent(new Event('input'));
});
$('#emoji-btn').addEventListener('click', e => { e.stopPropagation(); if (!input.disabled) openEmojiPop(e.currentTarget, { type: 'insert' }); });
$('#gif-btn').addEventListener('click', () => toast('GIF picker', 'Needs a media provider key.'));
$('#sticker-btn').addEventListener('click', () => toast('Sticker picker', 'Needs a media provider key.'));

$('#emoji-grid').innerHTML = R.emojiGridHtml();
$('#emoji-pop').addEventListener('click', e => {
  const b = e.target.closest('[data-emoji]');
  if (!b) return;
  const emoji = b.dataset.emoji;
  const t = S.emojiTarget;
  if (t?.type === 'react') { toggleReaction(t.id, emoji); $('#emoji-pop').hidden = true; return; }
  const start = input.selectionStart ?? input.value.length;
  input.value = input.value.slice(0, start) + emoji + input.value.slice(input.selectionEnd ?? start);
  input.focus();
  input.setSelectionRange(start + emoji.length, start + emoji.length);
  input.dispatchEvent(new Event('input'));
});

/* ---- attachments ---- */
function addFiles(files) {
  if (!S.roomId) return toast('Open a room first');
  for (const f of files) { if (S.files.length < 5) S.files.push({ name: f.name, size: f.size }); }
  if (files.length) toast('Attachment added', 'File names are sent as text until an upload endpoint exists.');
  paintChips(); updateSend();
}
function paintChips() {
  const el = $('#attach-chips');
  el.hidden = !S.files.length;
  el.innerHTML = S.files.map((f, i) => `<span class="chip-file"><span class="material-symbols-outlined" style="font-size:16px">attach_file</span><span>${R.esc(f.name)}</span><button type="button" data-rm="${i}" aria-label="Remove ${R.esc(f.name)}"><span class="material-symbols-outlined">close</span></button></span>`).join('');
}
$('#attach-chips').addEventListener('click', e => {
  const b = e.target.closest('[data-rm]');
  if (!b) return;
  S.files.splice(Number(b.dataset.rm), 1);
  paintChips(); updateSend();
});
$('#attachment-input').addEventListener('change', e => { addFiles([...e.target.files]); e.target.value = ''; });
const stage = $('#stage');
let dragDepth = 0;
stage.addEventListener('dragenter', e => { if (e.dataTransfer?.types.includes('Files')) { dragDepth++; $('#drop-hint').hidden = false; } });
stage.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; $('#drop-hint').hidden = true; } });
stage.addEventListener('dragover', e => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(); });
stage.addEventListener('drop', e => { e.preventDefault(); dragDepth = 0; $('#drop-hint').hidden = true; addFiles([...(e.dataTransfer?.files || [])]); });

/* ---- @mentions ---- */
function updateMention() {
  const before = input.value.slice(0, input.selectionStart);
  const m = before.match(/(^|\s)@([\w.]{0,32})$/);
  if (!m) return hideMention();
  const q = m[2].toLowerCase();
  const items = S.members.filter(u => u.username.toLowerCase().includes(q)).slice(0, 6);
  if (!items.length) return hideMention();
  S.mention = { items, index: 0, start: before.length - m[2].length - 1 };
  paintMention();
}
function paintMention() {
  const pop = $('#mention-popup');
  pop.hidden = false;
  pop.innerHTML = S.mention.items.map((u, i) => `<button type="button" role="option" aria-selected="${i === S.mention.index}" class="${i === S.mention.index ? 'is-sel' : ''}" data-i="${i}">${R.avatar({ name: u.username, avatarUrl: u.avatarUrl }, 22)}<span class="truncate">${R.esc(u.username)}</span></button>`).join('');
}
function hideMention() { S.mention = null; $('#mention-popup').hidden = true; }
function pickMention(i) {
  const u = S.mention?.items[i];
  if (!u) return;
  const caret = input.selectionStart;
  input.value = `${input.value.slice(0, S.mention.start)}@${u.username} ${input.value.slice(caret)}`;
  const pos = S.mention.start + u.username.length + 2;
  hideMention();
  input.focus();
  input.setSelectionRange(pos, pos);
  input.dispatchEvent(new Event('input'));
}
$('#mention-popup').addEventListener('mousedown', e => {
  const b = e.target.closest('[data-i]');
  if (b) { e.preventDefault(); pickMention(Number(b.dataset.i)); }
});

/* ============ search ============ */
function openSearch() {
  const bar = $('#search-bar');
  bar.hidden = false;
  $('#btn-search').setAttribute('aria-expanded', 'true');
  $('#search-input').focus();
}
function clearSearch(silent) {
  S.search = '';
  $('#search-input').value = '';
  $('#search-bar').hidden = true;
  $('#btn-search').setAttribute('aria-expanded', 'false');
  setText('#search-count', '');
  if (!silent && S.roomId) renderMessages({ stick: false });
}
let searchTimer;
$('#btn-search').addEventListener('click', () => ($('#search-bar').hidden ? openSearch() : clearSearch()));
$('#search-close').addEventListener('click', () => clearSearch());
$('#search-input').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { S.search = e.target.value; renderMessages({ stick: !S.search.trim() }); }, 160);
});
$('#search-input').addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); clearSearch(); } });

/* ============ header menu, huddle, mute ============ */
$('#btn-more').addEventListener('click', e => togglePop($('#more-menu'), e.currentTarget));
$('#pins-btn').addEventListener('click', () => { renderPins(true); togglePop($('#pins-panel'), $('#pins-btn')); });
function paintMuteMenu() {
  const muted = Boolean(S.muted[S.roomId]);
  $('#notif-icon').textContent = muted ? 'notifications_off' : 'notifications';
  $('#notif-label').textContent = muted ? 'Unmute notifications' : 'Mute notifications';
}
$('#more-menu').addEventListener('click', e => {
  const b = e.target.closest('[data-menu]');
  if (!b) return;
  $('#more-menu').hidden = true;
  $('#btn-more').setAttribute('aria-expanded', 'false');
  switch (b.dataset.menu) {
    case 'pins': renderPins(true); togglePop($('#pins-panel'), $('#pins-btn')); break;
    case 'threads': toast('Threads', 'Thread activity will appear here once threads exist.'); break;
    case 'inbox': toast('Inbox', 'No new mentions or requests.'); break;
    case 'help': toast('Help', 'Enter sends, Shift+Enter adds a line, ↑ edits your last message.'); break;
    case 'notifications':
      if (!S.roomId) return toast('Open a room first');
      S.muted[S.roomId] = !S.muted[S.roomId];
      store.set(`nc:mute:${S.roomId}`, S.muted[S.roomId]);
      paintMuteMenu();
      toast(S.muted[S.roomId] ? 'Notifications muted' : 'Notifications on', `#${S.room?.name}`);
      break;
  }
});

function huddleTick() {
  const s = Math.floor((Date.now() - S.huddle.start) / 1000);
  $('#huddle-timer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function setHuddle(on) {
  $('#huddle-bar').hidden = !on;
  const btn = $('#huddle-btn');
  btn.classList.toggle('is-on', on);
  btn.setAttribute('aria-pressed', String(on));
  $('#huddle-label').textContent = on ? 'In huddle' : 'Start huddle';
  $('span.material-symbols-outlined', btn).textContent = on ? 'mic' : 'headset_mic';
  if (on) { S.huddle = { start: Date.now(), timer: setInterval(huddleTick, 1000) }; huddleTick(); }
  else if (S.huddle) { clearInterval(S.huddle.timer); S.huddle = null; }
}
$('#huddle-btn').addEventListener('click', () => {
  if (!S.roomId) return toast('Open a room first');
  setHuddle(!S.huddle);
});
$('#huddle-leave').addEventListener('click', () => setHuddle(false));
$('#huddle-mute').addEventListener('click', e => {
  const label = $('span:last-child', e.currentTarget);
  const muted = label.textContent === 'Mute';
  label.textContent = muted ? 'Unmute' : 'Mute';
  $('span:first-child', e.currentTarget).textContent = muted ? 'mic_off' : 'mic';
});
$('#mute-microphone-button').addEventListener('click', e => {
  const b = e.currentTarget;
  const muted = b.getAttribute('aria-pressed') === 'true';
  b.setAttribute('aria-pressed', String(!muted));
  b.title = muted ? 'Mute microphone' : 'Unmute microphone';
  $('.material-symbols-outlined', b).textContent = muted ? 'mic' : 'mic_off';
});

/* ============ DMs ============ */
async function loadDms() {
  try { S.dms = (await api.getDirectMessages(S.userId)) || []; } catch { S.dms = []; }
  paintDms();
}
function paintDms() {
  const q = $('#dm-filter').value.trim().toLowerCase();
  const items = S.dms.filter(d => !q || d.name.toLowerCase().includes(q));
  $('#dm-list').innerHTML = items.length ? items.map(R.dmRow).join('') : `<div class="empty">${q ? 'No match' : 'No conversations yet'}</div>`;
  setText('[data-dm-unread-count]', String(S.dms.reduce((n, d) => n + Number(d.unreadCount || 0), 0)));
}
async function openDm(contact) {
  S.dmPartner = contact;
  $('#dm-partner').hidden = false;
  $('#dm-modal-avatar').innerHTML = R.avatar({ name: contact.name, avatarUrl: contact.avatarUrl }, 40);
  setText('#dm-modal-name', contact.name);
  setText('#dm-modal-role', contact.roleTitle || 'Contact');
  setText('#dm-modal-status', contact.subject ? `Focus: ${contact.subject}` : '');
  $('#dm-modal').hidden = false;
  await refreshDm();
  $('#dm-quick-message').focus();
}
async function refreshDm() {
  if (!S.dmPartner) return;
  try {
    const h = (await api.getDirectMessageHistory(S.userId, S.dmPartner.id)) || [];
    const hist = $('#dm-history');
    hist.innerHTML = R.dmHistoryHtml(h, S.userId, S.dmPartner.name);
    hist.scrollTop = hist.scrollHeight;
    await api.markDirectMessagesRead(S.userId, S.dmPartner.id);
    loadDms();
  } catch (e) { $('#dm-history').innerHTML = `<p class="empty">${R.esc(e.message)}</p>`; }
}
async function sendDm() {
  const ta = $('#dm-quick-message');
  const text = ta.value.trim();
  if (!S.dmPartner || !text) return;
  try { await api.sendDirectMessage(S.userId, S.dmPartner.id, text); ta.value = ''; await refreshDm(); }
  catch (e) { toast('Send failed', e.message); }
}
const closeDm = () => { $('#dm-modal').hidden = true; S.dmPartner = null; };
async function searchContacts(q) {
  const out = $('#dm-contact-results');
  const query = q.trim().toLowerCase();
  if (!query) { out.innerHTML = ''; return; }
  if (!S.users.length) { try { S.users = (await api.getUsers()) || []; } catch { S.users = []; } }
  const hits = S.users.filter(u => u.id !== S.userId && `${u.username} ${u.roleTitle || ''}`.toLowerCase().includes(query));
  out.innerHTML = hits.length ? hits.map(R.contactHtml).join('') : '<p class="empty">No people found</p>';
}
$('#btn-new-dm').addEventListener('click', () => { $('#dm-modal').hidden = false; $('#dm-search-input').focus(); });
$('#dm-filter').addEventListener('input', paintDms);
$('#dm-list').addEventListener('click', e => {
  const b = e.target.closest('[data-dm-id]');
  const dm = b && S.dms.find(d => String(d.id) === b.dataset.dmId);
  if (dm) openDm(dm);
});
$('#dm-search-input').addEventListener('input', e => searchContacts(e.target.value));
$('#dm-contact-results').addEventListener('click', e => {
  const b = e.target.closest('[data-contact-id]');
  const u = b && S.users.find(x => String(x.id) === b.dataset.contactId);
  if (u) { $('#dm-contact-results').innerHTML = ''; $('#dm-search-input').value = ''; openDm({ id: u.id, name: u.username, roleTitle: u.roleTitle, avatarUrl: u.avatarUrl, subject: u.currentActivity }); }
});
$('#dm-send').addEventListener('click', sendDm);
$('#dm-quick-message').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendDm(); } });
$('#dm-close').addEventListener('click', closeDm);
$('#dm-cancel').addEventListener('click', closeDm);
$('#dm-modal').addEventListener('click', e => { if (e.target.id === 'dm-modal') closeDm(); });

/* ============ wiring ============ */
$('#collective-rail').addEventListener('click', e => {
  const act = e.target.closest('[data-rail-act]');
  if (act) return act.dataset.railAct === 'join' ? joinCollective() : createCollective();
  const b = e.target.closest('[data-collective-id]');
  if (!b) return;
  const id = Number(b.dataset.collectiveId);
  if (id === S.collectiveId) setChannels(true);
  else loadCollectives(id);
});
$('#rooms-list').addEventListener('click', e => {
  const b = e.target.closest('[data-room-id]');
  const room = b && S.rooms.find(r => String(r.id) === b.dataset.roomId);
  if (room) onRoomClick(room);
});
$('#create-room-button').addEventListener('click', createRoom);
$('#create-invite-button').addEventListener('click', createInvite);
$('#user-profile-button').addEventListener('click', editProfile);
$('#user-settings-button').addEventListener('click', editProfile);
$('#btn-channels').addEventListener('click', () => setChannels(shell.dataset.channels !== 'open'));
$('#btn-collapse-channels').addEventListener('click', () => setChannels(false));
$('#btn-members').addEventListener('click', () => setMembers(shell.dataset.members !== 'open'));
$('#btn-close-members').addEventListener('click', () => setMembers(false));
$('#scrim').addEventListener('click', closeDrawers);

document.addEventListener('click', e => {
  if (!e.target.closest('.pop, [data-pop]')) closePops();
  if (!e.target.closest('#mention-popup, #channel-message-input')) hideMention();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ($$('.pop').some(p => !p.hidden && !p.classList.contains('mention-pop'))) return closePops();
  if (!$('#dm-modal').hidden) return closeDm();
  if (!$('#search-bar').hidden) return clearSearch();
  if (S.editing) return cancelEdit();
  closeDrawers();
});

$('#test-user-switcher').addEventListener('click', async e => {
  const btn = e.currentTarget;
  btn.disabled = true;
  try {
    const users = (await api.getUsers()) || [];
    S.users = users;
    if (users.length < 2) return toast('Only one user exists');
    const i = users.findIndex(u => u.id === S.userId);
    S.userId = users[(i + 1) % users.length].id;
    resetRoom();
    S.collectiveId = null;
    await loadUser();
    await Promise.all([loadCollectives(), loadDms()]);
    toast('Switched user', S.user?.username);
  } catch (err) { toast('Switch failed', err.message); }
  finally { btn.disabled = false; }
});

/* ============ boot ============ */
(async function init() {
  resetRoom();
  await loadUser();
  await Promise.all([loadCollectives(), loadDms()]);
  if (api.isMock()) toast('Demo mode', 'No /api backend found. Using in-memory sample data.');
})();
