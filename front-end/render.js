// Pure renderers: data in, HTML string out. No state, no DOM access.

export const esc = s =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const initials = name =>
  String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

const hue = name => {
  let h = 0;
  for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

export function avatar(user, px = 40) {
  const name = user.name || user.username || '?';
  const bg = `hsl(${hue(name)} 50% 40%)`;
  const size = `width:${px}px;height:${px}px;font-size:${Math.round(px * 0.38)}px`;
  if (user.avatarUrl) {
    return `<img class="avatar" style="${size}" src="${esc(user.avatarUrl)}" alt="${esc(name)}" loading="lazy" data-ini="${esc(initials(name))}" data-bg="${esc(bg)}">`;
  }
  return `<span class="avatar" style="${size};background:${bg}" title="${esc(name)}" aria-hidden="true">${esc(initials(name))}</span>`;
}

// ---------- time ----------
const sameDay = (a, b) => a.toDateString() === b.toDateString();
export const timeOnly = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const yesterdayOf = now => { const y = new Date(now); y.setDate(y.getDate() - 1); return y; };

export function stamp(d) {
  const now = new Date();
  if (sameDay(d, now)) return `Today at ${timeOnly(d)}`;
  if (sameDay(d, yesterdayOf(now))) return `Yesterday at ${timeOnly(d)}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} ${timeOnly(d)}`;
}

export function dayLabel(d) {
  const now = new Date();
  if (sameDay(d, now)) return 'Today';
  if (sameDay(d, yesterdayOf(now))) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// ---------- markdown-ish formatting (escape first, then style) ----------
const codeBlock = (lang, code) =>
  `<div class="codeblock"><div class="codeblock__bar"><span>${lang || 'text'}</span><button type="button" data-act="copy-code"><span class="material-symbols-outlined">content_copy</span>Copy</button></div><pre><code>${code}</code></pre></div>`;

export function formatContent(text) {
  const tokens = [];
  const keep = html => `\u0000${tokens.push(html) - 1}\u0000`;
  let s = esc(text);

  s = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => keep(codeBlock(lang, code.replace(/\n$/, ''))));
  s = s.replace(/`([^`\n]+)`/g, (_, c) => keep(`<code class="md-code">${c}</code>`));
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, p, url) => `${p}${keep(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)}`);

  s = s.replace(/\|\|([^|\n]+)\|\|/g, '<span class="spoiler" data-act="spoiler" tabindex="0" role="button" aria-label="Spoiler, activate to reveal">$1</span>');
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?]|$)/g, '$1<em>$2</em>');
  s = s.replace(/__([^_\n]+)__/g, '<u>$1</u>');
  s = s.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  s = s.replace(/(^|[\s>(])@([A-Za-z0-9_.]{2,32})/g, '$1<span class="mention">@$2</span>');
  s = s.replace(/\n/g, '<br>');

  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[i]);
}

export function splitReply(text) {
  const m = String(text ?? '').match(/^> (.+)(?:\n([\s\S]*))?$/);
  return m ? { quote: m[1], body: m[2] ?? '' } : { quote: null, body: String(text ?? '') };
}

const YT = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/;
const IMG = /\.(png|jpe?g|gif|webp|avif)(\?[^\s]*)?$/i;

export function embedsHtml(text) {
  const urls = [...String(text).matchAll(/https?:\/\/[^\s<)]+/g)].map(m => m[0]).slice(0, 3);
  return urls.map(u => {
    const y = u.match(YT);
    if (y) {
      return `<a class="embed embed--video" href="${esc(u)}" target="_blank" rel="noopener noreferrer"><img data-embed src="https://i.ytimg.com/vi/${y[1]}/hqdefault.jpg" loading="lazy" alt="YouTube video preview"><span class="embed__play material-symbols-outlined">play_arrow</span><span class="embed__label">YouTube</span></a>`;
    }
    if (IMG.test(u)) {
      return `<a class="embed embed--image" href="${esc(u)}" target="_blank" rel="noopener noreferrer"><img data-embed src="${esc(u)}" loading="lazy" alt="Image from link"></a>`;
    }
    return '';
  }).join('');
}

// ---------- messages ----------
const tool = (act, icon, title, extra = '') =>
  `<button type="button" class="tool" data-act="${act}" ${extra} title="${title}" aria-label="${title}"><span class="material-symbols-outlined">${icon}</span></button>`;

function messageHtml(m, d, grouped, ctx) {
  const id = String(m.id);
  const own = m.senderId === ctx.userId;
  const name = m.senderName || 'Unknown';
  const { quote, body } = splitReply(m.message);
  const pinned = ctx.pins?.has(id);
  const cls = ['msg', grouped ? '' : 'msg--first', pinned ? 'msg--pinned' : '', m._pending ? 'msg--pending' : '', m._failed ? 'msg--failed' : ''].filter(Boolean).join(' ');

  const gutter = grouped
    ? `<time class="msg__hover-time" datetime="${d.toISOString()}">${esc(timeOnly(d))}</time>`
    : avatar({ name, avatarUrl: m.avatarUrl }, 40);

  const head = grouped ? '' :
    `<div class="msg__head"><span class="msg__name">${esc(name)}</span><time datetime="${d.toISOString()}" title="${esc(d.toLocaleString())}">${esc(stamp(d))}</time>${pinned ? '<span class="material-symbols-outlined msg__pin" title="Pinned">push_pin</span>' : ''}</div>`;

  const reply = quote ? `<div class="msg__reply"><span class="material-symbols-outlined">subdirectory_arrow_right</span><span>${esc(quote)}</span></div>` : '';
  const edited = m.editedAt ? '<span class="msg__edited">(edited)</span>' : '';

  const reactions = ctx.reactions?.[id]
    ? `<div class="msg__reactions">${Object.entries(ctx.reactions[id]).map(([emoji, users]) =>
        `<button type="button" class="reaction${users.includes(ctx.userId) ? ' is-mine' : ''}" data-act="toggle-react" data-emoji="${esc(emoji)}" aria-label="${esc(emoji)} ${users.length}"><span>${esc(emoji)}</span><span>${users.length}</span></button>`).join('')}</div>`
    : '';

  const failure = m._failed
    ? '<div class="msg__fail"><span class="material-symbols-outlined">error</span>Not sent <button type="button" data-act="retry">Retry</button><button type="button" data-act="discard">Discard</button></div>'
    : '';

  const tools = (m._pending || m._failed) ? '' :
    `<div class="msg__tools" role="toolbar" aria-label="Message actions">${
      tool('react', 'add_reaction', 'Add reaction', 'data-pop')}${tool('reply', 'reply', 'Reply')}${tool('copy', 'content_copy', 'Copy text')}${
      tool('pin', pinned ? 'keep_off' : 'push_pin', pinned ? 'Unpin' : 'Pin')}${
      own ? tool('edit', 'edit', 'Edit') + tool('delete', 'delete', 'Delete') : ''}</div>`;

  return `<article class="${cls}" data-id="${esc(id)}" data-own="${own}"><div class="msg__gutter">${gutter}</div><div class="msg__body">${head}${reply}<div class="msg__content">${formatContent(body)}${edited}</div>${embedsHtml(body)}${reactions}${failure}</div>${tools}</article>`;
}

export function messagesHtml(messages, ctx) {
  let html = '';
  let prev = null;
  let prevDate = null;
  for (const m of messages) {
    const d = new Date(m.createdAt || Date.now());
    if (!prevDate || !sameDay(prevDate, d)) {
      html += `<div class="day-sep" role="separator"><span></span><time>${esc(dayLabel(d))}</time><span></span></div>`;
      prev = null;
    }
    const key = m.senderId ?? m.senderName;
    const grouped = !ctx.flat && prev && (prev.senderId ?? prev.senderName) === key
      && d - new Date(prev.createdAt) < 10 * 60e3 && !splitReply(m.message).quote && !m._failed;
    html += messageHtml(m, d, Boolean(grouped), ctx);
    prev = m;
    prevDate = d;
  }
  return html;
}

export const welcomeHtml = room => `
  <div class="welcome">
    <div class="welcome__icon"><span class="material-symbols-outlined">tag</span></div>
    <h2>Welcome to #${esc(room?.name || 'room')}</h2>
    <p>${esc(room?.topic || 'This is the start of the channel.')}</p>
  </div>`;

export const emptyHtml = text => `<div class="empty-state"><span class="material-symbols-outlined">forum</span><p>${text}</p></div>`;

export const skeletonHtml = () => Array.from({ length: 5 }, (_, i) =>
  `<div class="msg msg--first skel-row"><div class="msg__gutter"><span class="skel skel--circle"></span></div><div class="msg__body"><span class="skel" style="width:${90 + i * 18}px;height:12px"></span><span class="skel" style="width:${35 + ((i * 17) % 40)}%;height:14px;margin-top:8px"></span></div></div>`).join('');

// ---------- roster ----------
const dot = status => ({ online: 'bg-secondary', idle: 'bg-amber-400', dnd: 'bg-tertiary-container' }[status] || 'bg-text-muted');
const statusText = status => ({ online: 'Online', idle: 'Idle', dnd: 'Do not disturb' }[status] || 'Offline');

export function rosterHtml(members) {
  if (!members.length) return '<div class="empty">No members yet</div>';
  const online = members.filter(m => m.status && m.status !== 'offline');
  const offline = members.filter(m => !m.status || m.status === 'offline');
  const row = m => `<div class="roster-row${m.status && m.status !== 'offline' ? '' : ' is-offline'}" data-user-id="${esc(m.id)}">
      <div class="relative shrink-0">${avatar({ name: m.username, avatarUrl: m.avatarUrl }, 32)}<span class="status-dot ${dot(m.status)}" title="${statusText(m.status)}"></span></div>
      <div class="min-w-0"><p class="roster-row__name">${esc(m.username)}</p><p class="roster-row__sub">${esc(m.currentActivity || m.roleTitle || 'Member')}</p></div></div>`;
  const group = (title, list) => list.length ? `<h3 class="roster-title">${title} (${list.length})</h3>${list.map(row).join('')}` : '';
  return group('Online', online) + group('Offline', offline);
}

// ---------- left column ----------
export const collectiveRailHtml = (list, activeId) =>
  `<li class="rail__group">${list.map(c => `<button type="button" class="rail__btn${c.id === activeId ? ' is-active' : ''}" data-collective-id="${esc(c.id)}" title="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${c.id === activeId}"><span class="material-symbols-outlined">${esc(c.icon || 'hub')}</span></button>`).join('')}</li>
  <li class="rail__group rail__group--end">
    <button type="button" class="rail__btn rail__btn--ghost" data-rail-act="join" title="Join collective with invite" aria-label="Join collective"><span class="material-symbols-outlined">link</span></button>
    <button type="button" class="rail__btn rail__btn--ghost" data-rail-act="create" title="Create collective" aria-label="Create collective"><span class="material-symbols-outlined">add</span></button>
  </li>`;

export function roomCard(room, activeId) {
  const full = room.memberCount >= room.capacity;
  const active = room.id === activeId;
  return `<button type="button" class="room-card${active ? ' is-active' : ''}" data-room-id="${esc(room.id)}" aria-current="${active}">
    <span class="room-card__icon"><span class="material-symbols-outlined">${esc(room.icon || 'tag')}</span></span>
    <span class="min-w-0 flex-1 text-left"><span class="room-card__name">${esc(room.name)}</span><span class="room-card__topic">${esc(room.topic || '')}</span></span>
    <span class="room-card__meta"><span class="room-card__count${full ? ' is-full' : ''}">${room.memberCount}/${room.capacity}${full ? ' full' : ''}</span>${active ? '<span class="room-card__tag is-active">Open</span>' : room.isMember ? '' : '<span class="room-card__tag">Join</span>'}</span>
  </button>`;
}

export const dmRow = dm => `<button type="button" class="dm-row" data-dm-id="${esc(dm.id)}">
  <span class="relative shrink-0">${avatar({ name: dm.name, avatarUrl: dm.avatarUrl }, 32)}${dm.status === 'online' ? '<span class="status-dot bg-secondary"></span>' : ''}</span>
  <span class="min-w-0 flex-1 text-left"><span class="dm-row__top"><span class="dm-row__name">${esc(dm.name)}</span>${dm.unreadCount ? `<span class="dm-row__unread">${dm.unreadCount}</span>` : `<span class="dm-row__time">${esc(dm.lastActiveLabel || '')}</span>`}</span><span class="dm-row__last">${esc(dm.lastMessage || '')}</span></span></button>`;

export const dmHistoryHtml = (history, userId, partnerName) => history.length
  ? history.map(h => `<div class="dm-bubble${h.senderId === userId ? ' is-me' : ''}"><div class="dm-bubble__meta">${h.senderId === userId ? 'You' : esc(partnerName)} · ${esc(stamp(new Date(h.createdAt)))}</div><div>${formatContent(h.message)}</div></div>`).join('')
  : '<p class="empty">No messages yet. Say hello.</p>';

export const contactHtml = u => `<button type="button" class="contact" data-contact-id="${esc(u.id)}">${avatar({ name: u.username, avatarUrl: u.avatarUrl }, 32)}<span><strong>${esc(u.username)}</strong><small>${esc(u.roleTitle || 'Member')}</small></span></button>`;

// ---------- emoji ----------
export const EMOJIS = ['😀', '😂', '🙂', '😉', '😍', '🤔', '😅', '😭', '😎', '🥳', '🤯', '😴', '👍', '👎', '👏', '🙌', '🙏', '💪', '👀', '🤝', '❤️', '🔥', '🎉', '✨', '💯', '✅', '❌', '⚠️', '🚀', '💡', '📌', '📎', '🧪', '🦀', '🐛', '🔒', '☕', '🍕', '🎧', '📚'];
export const emojiGridHtml = () => EMOJIS.map(e => `<button type="button" data-emoji="${e}" aria-label="${e}">${e}</button>`).join('');
