import { getUser, getUsers, updateUser, getCollectives, getCollectiveRooms, getDirectMessages, getDirectMessageHistory, sendDirectMessage, markDirectMessagesRead, getRoomMessages, getRoomMembers, createRoomMessage, createCollective, createCollectiveRoom, createInvite, joinRoom } from './Api.js';

let currentUserId = 1;
let activeCollectiveId = null;
let activeCollective = null;
let availableCollectives = [];
let activeRoomId = null;
let activeDmPartner = null;
let currentUser = null;
let activeUserTab = null;

document.addEventListener('DOMContentLoaded', () => {
  prepareBlueprint();
  setupNavigationEvents();
  setupComposer();
  loadCurrentUser();
  loadCollectives();
  loadDirectMessages();
  prepareUserSwitcher();
  document.getElementById('message-form')?.addEventListener('submit', sendRoomMessage);
  document.getElementById('channel-message-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendRoomMessage(event);
    }
  });
});

function prepareBlueprint() {
  const roomLinks = [...document.querySelectorAll('#sub-channel-column a[href="#"]')];
  const roomList = roomLinks[0]?.parentElement;
  if (roomList) {
    roomList.id = 'rooms-list';
    roomList.dataset.emptyText = 'No public rooms yet';
    roomList.innerHTML = '';
  }

  const dmLists = [...document.querySelectorAll('#sub-channel-column .space-y-1')];
  const dmList = dmLists.at(-1);
  if (dmList) {
    dmList.id = 'dm-list';
    dmList.dataset.emptyText = 'No conversations yet';
    dmList.innerHTML = '';
  }

  const profileImage = document.querySelector('header img[alt="Profile"]');
  if (profileImage) {
    profileImage.dataset.userAvatar = '';
    const profile = profileImage.closest('.flex.items-center');
    const profileText = profile?.querySelector('.hidden.md\\:flex')?.querySelectorAll('span');
    if (profileText?.[0]) profileText[0].dataset.userName = '';
    if (profileText?.[1]) profileText[1].dataset.userRole = '';
  }

  const channelHeader = document.querySelector('#sub-channel-column > div:first-child');
  const channelName = channelHeader?.querySelector('.font-headline-sm');
  const channelStats = channelHeader?.querySelectorAll('.font-label-sm');
  if (channelName) channelName.dataset.roomName = '';
  if (channelStats?.[0]) channelStats[0].dataset.roomOnlineCount = '';
  if (channelStats?.[1]) channelStats[1].dataset.roomLabsCount = '';

  document.getElementById('create-room-button')?.addEventListener('click', createNewRoom);
  document.getElementById('create-invite-button')?.addEventListener('click', createCollectiveInvite);
  document.getElementById('dm-search-input')?.addEventListener('input', event => renderContactResults(event.target.value));
  document.getElementById('user-profile-button')?.addEventListener('click', () => showUserTab('profile'));
  document.getElementById('user-settings-button')?.addEventListener('click', () => showUserTab('settings'));
  document.getElementById('mute-microphone-button')?.addEventListener('click', event => {
    const button = event.currentTarget;
    const muted = button.dataset.muted === 'true';
    button.dataset.muted = String(!muted);
    button.title = muted ? 'Mute Microphone' : 'Unmute Microphone';
    button.querySelector('.material-symbols-outlined').textContent = muted ? 'mic' : 'mic_off';
  });

  window.sendMessage = () => {
    const input = document.getElementById('channel-message-input');
    if (input) input.form?.requestSubmit();
  };
}

function setupNavigationEvents() {
  document.querySelectorAll('.channel-container').forEach((header) => {
    const category = header.closest('section');
    const list = category?.querySelector('.channel-list');
    const toggle = header.querySelector('.material-symbols-outlined');
    if (!category || !list || !toggle) return;
    header.setAttribute('role', 'button');
    header.tabIndex = 0;
    const toggleCategory = () => {
      const collapsed = list.classList.toggle('hidden');
      toggle.textContent = collapsed ? 'chevron_right' : 'expand_more';
      header.setAttribute('aria-expanded', String(!collapsed));
    };
    header.addEventListener('click', toggleCategory);
    header.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCategory();
      }
    });
  });

  document.querySelectorAll('.channel-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.channel-button').forEach(item => {
        item.classList.remove('bg-primary-container/20', 'text-primary');
        item.classList.add('text-text-muted');
      });
      button.classList.remove('text-text-muted');
      button.classList.add('bg-primary-container/20', 'text-primary');
      setText('#active-stage-title', `#${button.querySelector('span:last-child')?.textContent.trim() || 'channel'}`);
      setText('#active-stage-desc', 'This channel is not connected to a room yet. Choose a public room below to start chatting.');
      showToast('Channel selected', 'Connect a public room to load live messages.');
    });
  });

  document.querySelector('#header-search-box input')?.addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('#stage-messages .message-content')?.forEach(message => {
      const visible = !query || message.textContent.toLowerCase().includes(query);
      message.closest('article')?.classList.toggle('hidden', !visible);
    });
  });

  document.getElementById('pins-btn')?.addEventListener('click', () => showToast('Pinned messages', 'Pinned-message view is ready when this room has pins.'));
  document.querySelector('[title="Open threads"]')?.addEventListener('click', () => showToast('Threads', 'Thread activity will appear here for the active channel.'));
  document.querySelector('[title="Notification settings"]')?.addEventListener('click', event => {
    const button = event.currentTarget;
    const muted = button.dataset.muted === 'true';
    button.dataset.muted = String(!muted);
    button.title = muted ? 'Mute notifications' : 'Unmute notifications';
    button.querySelector('.material-symbols-outlined').textContent = muted ? 'notifications' : 'notifications_off';
    showToast(muted ? 'Notifications enabled' : 'Notifications muted', 'Your preference was updated for this channel.');
  });
  document.querySelector('[title="Inbox"]')?.addEventListener('click', () => showToast('Inbox', 'You have no new mentions or requests.'));
  document.querySelector('[title="Help"]')?.addEventListener('click', () => showToast('Help', 'Use Enter to send, Shift + Enter for a new line, and the channel list to navigate.'));
  document.getElementById('attachment-input')?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) showToast('Attachment ready', file.name);
  });
  document.querySelector('[title="GIF picker"]')?.addEventListener('click', () => showToast('GIF picker', 'GIF search is ready for a media provider connection.'));
  document.querySelector('[title="Sticker picker"]')?.addEventListener('click', () => showToast('Sticker picker', 'Sticker search is ready for a media provider connection.'));
}

function showToast(title, message) {
  let toast = document.getElementById('client-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'client-toast';
    toast.className = 'fixed bottom-6 left-1/2 z-[60] hidden -translate-x-1/2 rounded-xl bg-surface-container-highest px-4 py-3 text-left shadow-2xl ring-1 ring-white/10';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<p class="font-label-md text-label-md font-semibold text-text-main"></p><p class="mt-0.5 font-body-sm text-body-sm text-text-muted"></p>`;
  toast.children[0].textContent = title;
  toast.children[1].textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 3200);
}

function prepareUserSwitcher() {
  const button = document.getElementById('test-user-switcher');
  if (!button) return;

  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const users = await getUsers();
      if (users.length < 2) return;
      const currentIndex = users.findIndex(user => user.id === currentUserId);
      const nextUser = users[(currentIndex + 1) % users.length];
      currentUserId = nextUser.id;
      await Promise.all([loadCurrentUser(), loadDirectMessages(), loadCollectives()]);
    } catch (err) {
      console.error('Failed to switch test user:', err);
    } finally {
      button.disabled = false;
    }
  });
}

async function loadCollectives(selectedId = null) {
  try {
    const collectives = await getCollectives(currentUserId);
      availableCollectives = collectives || [];
    const selected = collectives.find(collective => collective.id === selectedId) || collectives[0];
    if (!selected) {
      activeCollectiveId = null;
      activeCollective = null;
      renderCollectives([]);
      activeRoomId = null;
      renderRooms(document.getElementById('rooms-list'), []);
      clearActiveRoom();
      return;
    }
    activeCollectiveId = selected.id;
    activeCollective = selected;
    renderCollectives(collectives || []);
    await loadRooms();
  } catch (err) {
    console.error('Failed to load collectives:', err);
    renderCollectives([]);
    renderRooms(document.getElementById('rooms-list'), []);
  }
}

function renderCollectives(collectives) {
  const rail = document.getElementById('collective-rail');
  if (!rail) return;
  rail.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'flex flex-col items-center gap-space-xs';
  for (const collective of collectives) {
    const button = document.createElement('button');
    const channelClosed = document.getElementById('sub-channel-column')?.classList.contains('hidden');
    const selected = collective.id === activeCollectiveId;
    button.className = 'relative group';
    button.type = 'button';
    button.title = selected && channelClosed ? 'Open channels' : collective.name;
    button.innerHTML = `<span class="block w-10 h-10 rounded-xl ${selected ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-low text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container'} flex items-center justify-center transition-all"><span class="material-symbols-outlined text-headline-sm">${escapeHtml(collective.icon || 'hub')}</span>${selected && channelClosed ? '<span class="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-md"><span class="material-symbols-outlined text-[13px]">chevron_right</span></span>' : ''}</span><span class="absolute left-16 top-2 z-50 hidden group-hover:flex px-2.5 py-1 bg-surface-container-highest text-on-surface font-label-md text-label-md rounded shadow-xl whitespace-nowrap">${escapeHtml(selected && channelClosed ? 'Open channels' : collective.name)}</span>`;
    button.addEventListener('click', () => {
      if (selected && document.getElementById('sub-channel-column')?.classList.contains('hidden')) {
        toggleChannelRail();
        renderCollectives(collectives);
      }
      else loadCollectives(collective.id);
    });
    list.appendChild(button);
  }
  rail.appendChild(list);
  const actions = document.createElement('div');
  actions.className = 'mt-auto flex flex-col items-center gap-2';
  actions.innerHTML = '<button class="w-10 h-10 rounded-full bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary flex items-center justify-center" id="join-collective-button" title="Join collective" type="button"><span class="material-symbols-outlined text-headline-sm">link</span></button><button class="w-10 h-10 rounded-full bg-surface-container text-text-muted hover:bg-surface-container-high hover:text-text-main flex items-center justify-center" id="create-collective-button" title="Create collective" type="button"><span class="material-symbols-outlined text-headline-sm">add</span></button>';
  rail.appendChild(actions);
  document.getElementById('join-collective-button')?.addEventListener('click', joinCollectiveByInvite);
  document.getElementById('create-collective-button')?.addEventListener('click', createNewCollective);
}

window.refreshCollectiveRail = function refreshCollectiveRail() {
  renderCollectives(availableCollectives);
};

function showUserTab(tab) {
  activeUserTab = tab;
  const browser = document.getElementById('channel-browser-view');
  const panel = document.getElementById('user-tab-view');
  if (!browser || !panel) return;
  browser.classList.toggle('hidden', Boolean(tab));
  panel.classList.toggle('hidden', !tab);
  if (tab) renderUserTab(tab);
}

function renderUserTab(tab) {
  const panel = document.getElementById('user-tab-view');
  if (!panel || !currentUser) return;
  const avatar = currentUser.avatarUrl
    ? `<img class="h-16 w-16 rounded-full object-cover" src="${escapeHtml(currentUser.avatarUrl)}" alt="${escapeHtml(currentUser.username)}" />`
    : `<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-xl font-bold text-on-primary-container">${escapeHtml(initials(currentUser.username))}</div>`;
  const heading = `<div class="mb-4 flex items-center justify-between"><h2 class="font-headline-sm text-lg font-bold text-text-main">${tab === 'profile' ? 'Profile' : 'Settings'}</h2><button class="rounded-lg p-1 text-text-muted hover:bg-surface-container-high hover:text-text-main" id="close-user-tab" title="Back to channels" type="button"><span class="material-symbols-outlined">close</span></button></div>`;
  if (tab === 'profile') {
    panel.innerHTML = `${heading}<div class="flex flex-col items-center gap-3 rounded-xl bg-surface-container p-4 text-center">${avatar}<div><h3 class="font-headline-sm text-text-main">${escapeHtml(currentUser.username)}</h3><p class="text-sm text-text-muted">${escapeHtml(currentUser.roleTitle || 'New user')}</p><p class="font-code-sm text-text-muted">#${escapeHtml(currentUser.userTag || 'new')}</p></div></div><div class="mt-3 space-y-2 text-sm"><p class="text-text-muted">Status <strong class="float-right text-text-main">${escapeHtml(currentUser.status || 'offline')}</strong></p><p class="text-text-muted">Activity <strong class="float-right max-w-[9rem] truncate text-right text-text-main">${escapeHtml(currentUser.currentActivity || 'Nothing set')}</strong></p></div>`;
  } else {
    panel.innerHTML = `${heading}<form id="user-settings-form" class="space-y-3"><label class="block text-xs font-semibold uppercase tracking-wide text-text-muted">Status<select name="status" class="mt-1 h-9 w-full rounded-lg bg-bg-input px-2 text-sm text-text-main"><option value="online" ${currentUser.status === 'online' ? 'selected' : ''}>Online</option><option value="away" ${currentUser.status === 'away' ? 'selected' : ''}>Away</option><option value="offline" ${currentUser.status === 'offline' ? 'selected' : ''}>Offline</option></select></label><label class="block text-xs font-semibold uppercase tracking-wide text-text-muted">Current activity<input name="currentActivity" value="${escapeHtml(currentUser.currentActivity || '')}" class="mt-1 h-9 w-full rounded-lg bg-bg-input px-2 text-sm text-text-main" maxlength="255" /></label><button class="w-full rounded-lg bg-primary-container px-3 py-2 text-sm font-semibold text-on-primary-container hover:bg-primary" type="submit">Save settings</button></form>`;
    panel.querySelector('#user-settings-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      currentUser = await updateUser(currentUserId, data);
      await loadCurrentUser();
      renderUserTab('settings');
    });
  }
  panel.querySelector('#close-user-tab')?.addEventListener('click', () => showUserTab(null));
}

// ---- Current user (header + rail) ----
async function loadCurrentUser() {
  try {
    const user = await getUser(currentUserId);
    currentUser = user;

    setText('[data-user-name]', user.username);
    setText('[data-user-role]', user.roleTitle);
    setText('[data-user-tag]', user.userTag ? `#${user.userTag}` : 'New user');
    setSrc('[data-user-avatar]', user.avatarUrl);

    const initialsEl = document.querySelector('[data-rail-user-initials]');
    if (initialsEl) initialsEl.textContent = initials(user.username);
    if (activeUserTab) renderUserTab(activeUserTab);
  } catch (err) {
    console.error('Failed to load user:', err);
    setText('[data-user-name]', '');
    setText('[data-user-role]', '');
    const initialsEl = document.querySelector('[data-rail-user-initials]');
    if (initialsEl) initialsEl.textContent = '';
  }
}

// ---- Public rooms ----
async function loadRooms() {
  const list = document.getElementById('rooms-list');
  if (!list) return;

  try {
    const rooms = activeCollectiveId ? await getCollectiveRooms(activeCollectiveId, currentUserId) : [];
    renderRooms(list, rooms || []);
  } catch (err) {
    console.error('Failed to load rooms:', err);
    renderRooms(list, []);
  }
}

async function createNewCollective() {
  const name = window.prompt('Collective name');
  if (!name?.trim()) return;
  try {
    const collective = await createCollective(currentUserId, name);
    await loadCollectives(collective.id);
  } catch (err) {
    window.alert(err.message);
  }
}

async function createNewRoom() {
  if (!activeCollectiveId) return window.alert('Create or join a collective first.');
  const name = window.prompt('Room name');
  if (!name?.trim()) return;
  const topic = window.prompt('Room topic (optional)') || '';
  const capacity = Number(window.prompt('Room capacity (2-100)', '10')) || 10;
  try {
    const room = await createCollectiveRoom(activeCollectiveId, { userId: currentUserId, name, topic, capacity });
    await loadRooms();
    loadRoom(room);
  } catch (err) {
    window.alert(err.message);
  }
}

async function createCollectiveInvite() {
  if (!activeCollectiveId) return window.alert('Select a collective first.');
  try {
    const result = await createInvite(activeCollectiveId, currentUserId);
    window.prompt('Copy this invite token', result.token);
  } catch (err) {
    window.alert(err.message);
  }
}

async function joinCollectiveByInvite() {
  const token = window.prompt('Paste an invite token');
  if (!token?.trim()) return;
  try {
    const response = await fetch(`/api/invites/${encodeURIComponent(token.trim())}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: currentUserId }) });
    if (!response.ok) throw new Error((await response.json()).error || 'Invite could not be used');
    const collective = await response.json();
    await loadCollectives(collective.id);
  } catch (err) {
    window.alert(err.message);
  }
}

function renderRooms(container, rooms) {
  container.innerHTML = '';

  if (!rooms.length) {
    container.appendChild(emptyState(container.dataset.emptyText || 'No rooms'));
    clearActiveRoom();
    return;
  }

  // Update header stats from room list (active room = first, or one flagged current)
  const current = rooms.find(r => r.isMember) || rooms[0];
  if (current) {
    setText('[data-collective-name]', current.collectiveName || activeCollective?.name);
    setText('[data-collective-name-tooltip]', current.collectiveName || activeCollective?.name);
    setText('[data-collective-online-count]', `${current.onlineCount ?? 0} Online`);
    setText('[data-collective-labs-count]', `${rooms.filter(r => r.status === 'active').length} Labs Active`);
    setText('[data-room-name]', current.name);
    setText('[data-room-online-count]', `${current.onlineCount ?? 0} Online`);
    setText('[data-room-labs-count]', `${rooms.filter(r => r.status === 'active').length} Labs Active`);
    const verified = document.querySelector('[data-room-verified]');
    if (verified) verified.hidden = !current.verified;
    if (current.isMember) loadRoom(current);
  }

  for (const room of rooms) {
    container.appendChild(roomCard(room));
  }
}

function clearActiveRoom() {
  activeRoomId = null;
  setText('#active-stage-title', 'No room selected');
  setText('#active-stage-desc', 'Create or join a room to begin');
  setText('[data-room-seats]', '');
  setText('[data-roster-count]', '0 / 0 Active');
  setWelcomeHeader(null);
  const messages = document.getElementById('chat-messages-container');
  if (messages) renderStageInner(messages, '<div class="py-10 text-center text-text-muted font-body-md">Create or join a room to load its messages.</div>');
  const roster = document.getElementById('room-roster');
  if (roster) roster.innerHTML = '<div class="p-3 text-sm text-text-muted">Join a room to see its roster.</div>';
}

// ---- Chat stage helpers ----
function setWelcomeHeader(room) {
  setText('#welcome-channel-name', room ? `#${room.name}` : '#the-room');
  setText('[data-welcome-topic]', room?.topic || 'Share code snippets, runbooks, and invariant proofs with your lab.');
}

function renderStageInner(container, innerHtml) {
  container.innerHTML = `<div class="py-space-md pr-2 pl-3 sm:pl-4"><div id="stage-welcome" class="mb-6 pt-4 pb-2 border-b border-border-subtle"><div class="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3"><span class="material-symbols-outlined text-[36px]">tag</span></div><h2 class="font-headline-lg text-headline-md text-text-main font-bold">Welcome to <span id="welcome-channel-name">#the-room</span></h2><p class="font-body-md text-body-md text-text-muted mt-1 max-w-xl">This is the start of the channel. <span data-welcome-topic>Pick a public room or DM to open the conversation stage.</span></p></div><div class="separator flex items-center gap-2 text-text-muted" aria-label="Message date"><span class="h-px flex-1 bg-border-subtle"></span><time class="font-label-sm text-label-sm">Today</time><span class="h-px flex-1 bg-border-subtle"></span></div>${innerHtml}</div>`;
}

window.insertCodeBlock = function insertCodeBlock() {
  const textarea = document.getElementById('channel-message-input');
  if (!textarea) return;
  const sample = '```rust\n// Insert invariant test here\nfn verify_cluster() -> bool {\n    true\n}\n```';
  const start = textarea.selectionStart ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(start);
  const glue = before && !before.endsWith('\n') ? '\n' : '';
  textarea.value = before + glue + sample + '\n' + after;
  textarea.focus();
  const caret = start + glue.length + sample.length + 1;
  textarea.setSelectionRange(caret, caret);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
};

window.copySnippet = function copySnippet(btn) {
  const block = btn.closest('.chat-codeblock');
  const code = block?.querySelector('code')?.textContent ?? '';
  navigator.clipboard?.writeText(code).catch(() => {});
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="material-symbols-outlined text-body-sm text-secondary">check</span> Copied!';
  setTimeout(() => { btn.innerHTML = originalText; }, 1800);
};

function setupComposer() {
  const textarea = document.getElementById('channel-message-input');
  if (!textarea) return;

  // Auto-resize: grow with content up to max-height (set in CSS/Tailwind).
  const autoResize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
  };
  textarea.addEventListener('input', autoResize);
  autoResize();

  // Lightweight emoji picker popover.
  const emojiBtn = document.getElementById('emoji-btn');
  if (emojiBtn) {
    const emojis = ['😀', '😂', '👍', '❤️', '🔥', '🎉', '🤔', '😅', '🙌', '👀', '✅', '🚀', '💡', '⚠️', '🧪', '🦀'];
    const popover = document.createElement('div');
    popover.className = 'hidden absolute bottom-full mb-2 left-0 z-30 grid grid-cols-8 gap-1 rounded-lg bg-surface-container-highest p-2 shadow-2xl ring-1 ring-white/10 w-max max-w-[calc(100vw-2rem)]';
    popover.innerHTML = emojis.map(e => `<button type="button" class="p-1.5 rounded hover:bg-surface-bright text-lg leading-none">${e}</button>`).join('');
    emojiBtn.parentElement.appendChild(popover);
    emojiBtn.addEventListener('click', event => {
      event.stopPropagation();
      popover.classList.toggle('hidden');
    });
    popover.addEventListener('click', event => {
      const emoji = event.target.textContent;
      if (!emojis.includes(emoji)) return;
      const start = textarea.selectionStart ?? textarea.value.length;
      textarea.value = textarea.value.slice(0, start) + emoji + textarea.value.slice(textarea.selectionEnd ?? start);
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    document.addEventListener('click', () => popover.classList.add('hidden'));
  }
}

window.toggleChannelRail = function toggleChannelRail() {
  const rail = document.getElementById('channel-rail');
  const channels = document.getElementById('sub-channel-column');
  if (window.innerWidth < 1024) {
    rail?.classList.toggle('mobile-open');
    return;
  }
  const collapsed = channels?.classList.toggle('hidden');
  window.refreshCollectiveRail?.();
};

window.toggleMemberList = function toggleMemberList() {
  const panel = document.getElementById('member-list-panel');
  if (window.innerWidth < 1024) {
    panel?.classList.toggle('mobile-open');
    return;
  }
  panel?.classList.toggle('hidden');
};

window.toggleHuddle = function toggleHuddle() {
  const bar = document.getElementById('huddle-bar');
  const button = document.getElementById('huddle-btn');
  if (!bar || !button) return;
  const active = bar.classList.toggle('hidden') === false;
  button.innerHTML = active
    ? '<span class="material-symbols-outlined text-base">mic</span>In Huddle'
    : '<span class="material-symbols-outlined text-base">headset_mic</span>Start Huddle';
};

window.openDirectMessageModal = function openDirectMessageModal() {
  document.getElementById('dm-modal')?.classList.remove('hidden');
};

window.closeDmModal = function closeDmModal() {
  document.getElementById('dm-modal')?.classList.add('hidden');
};

window.openDmWith = async function openDmWith(contact) {
  activeDmPartner = contact;
  setText('#dm-modal-name', contact.name);
  setText('#dm-modal-role', contact.roleTitle || 'Contact');
  setText('#dm-modal-status', `Focus: ${contact.subject || 'Direct conversation'}`);
  setText('#dm-modal-avatar', initials(contact.name));
  try {
    const history = await getDirectMessageHistory(currentUserId, contact.id);
    renderDmHistory(history);
    await markDirectMessagesRead(currentUserId, contact.id);
    await loadDirectMessages();
  } catch (err) {
    setText('#dm-history', err.message);
  }
  window.openDirectMessageModal();
};

window.sendDirectMessage = async function sendDirectMessage() {
  const input = document.getElementById('dm-quick-message');
  if (!activeDmPartner || !input?.value.trim()) return;
  try {
    await sendDirectMessage(currentUserId, activeDmPartner.id, input.value.trim());
    input.value = '';
    await window.openDmWith(activeDmPartner);
  } catch (err) {
    window.alert(err.message);
  }
  window.closeDmModal();
};

function roomCard(room) {
  const full = room.memberCount >= room.capacity;
  const active = room.id === activeRoomId;

  const a = document.createElement('a');
  a.href = `#room-${room.id}`;
  a.className = [
    'flex items-center justify-between p-2 rounded-xl transition-colors group',
    active
      ? 'bg-surface-container-high border border-primary/30 text-text-main'
      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-text-main',
  ].join(' ');

  a.innerHTML = `
    <div class="flex items-center gap-2.5 min-w-0">
      <div class="w-8 h-8 rounded-lg ${active ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-text-muted group-hover:text-primary'} flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-headline-sm">${room.icon || 'tag'}</span>
      </div>
      <div class="min-w-0">
        <div class="flex items-center gap-1">
          <span class="font-headline-sm text-body-sm font-semibold truncate ${active ? 'text-text-main' : ''}">${escapeHtml(room.name)}</span>
        </div>
        <p class="font-body-sm text-[11px] text-text-muted truncate">${escapeHtml(room.topic || '')}</p>
      </div>
    </div>
    <div class="flex flex-col items-end gap-0.5 shrink-0">
      <span class="px-2 py-0.5 rounded-full font-code-sm text-[11px] font-semibold ${full ? 'bg-tertiary-container/30 text-tertiary' : 'bg-surface-container-highest text-text-muted'}">
        ${room.memberCount}/${room.capacity}${full ? ' FULL' : ''}
      </span>
      ${active ? '<span class="text-[10px] text-primary font-code-sm">ACTIVE</span>' : room.isMember ? '' : '<span class="text-[10px] text-secondary font-code-sm">JOIN</span>'}
    </div>
  `;
  a.addEventListener('click', (event) => {
    event.preventDefault();
    if (room.isMember) loadRoom(room);
    else joinRoom(room.id, currentUserId).then(async () => { await loadRooms(); loadRoom(room); }).catch(err => window.alert(err.message));
  });
  return a;
}

async function loadRoom(room) {
  activeRoomId = room.id;
  setText('#active-stage-title', `#${room.name}`);
  setText('#active-stage-desc', room.topic || 'Live room messages');
  setText('[data-room-seats]', `${room.memberCount ?? 0} / ${room.capacity ?? 0} seats filled`);
  setWelcomeHeader(room);
  const input = document.getElementById('channel-message-input');
  if (input) {
    input.placeholder = `Message #${room.name}`;
    input.disabled = false;
  }
  setText('#room-connection-status', 'Loading');
  const container = document.getElementById('chat-messages-container');
  renderStageInner(container, '<div class="p-4 text-text-muted font-body-md">Loading messages...</div>');

  try {
    const [messages, members] = await Promise.all([
      getRoomMessages(room.id, currentUserId),
      getRoomMembers(room.id, currentUserId),
    ]);
    renderMessages(container, messages || []);
    setWelcomeHeader(room);
    renderRoster(members || [], room.capacity);
    setText('#room-connection-status', 'Ready');
  } catch (err) {
    console.error('Failed to load room messages:', err);
    renderStageInner(container, '<div class="p-4 text-tertiary font-body-md">Unable to load messages. Check the API and database connection.</div>');
    setText('#room-connection-status', 'Offline');
  }
}

function renderRoster(members, capacity = 0) {
  const container = document.getElementById('room-roster');
  if (!container) return;
  setText('[data-roster-count]', `${members.length} / ${capacity} Active`);
  container.innerHTML = members.length ? '' : '<div class="p-3 text-sm text-text-muted">No members in this room yet.</div>';
  for (const member of members) {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-container-high';
    const presenceClass = member.status === 'online'
      ? 'bg-secondary'
      : member.status === 'dnd'
        ? 'bg-tertiary-container'
        : member.status === 'idle'
          ? 'bg-amber-400'
          : 'bg-text-muted';
    const avatar = member.avatarUrl
      ? `<img class="w-8 h-8 rounded-full object-cover" src="${escapeHtml(member.avatarUrl)}" alt="${escapeHtml(member.username)}" />`
      : `<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold">${escapeHtml(initials(member.username))}</div>`;
    row.innerHTML = `${avatar}<div class="min-w-0 flex-1"><div class="flex items-center gap-1.5"><span class="text-sm font-semibold text-text-main truncate">${escapeHtml(member.username)}</span><span class="w-2 h-2 rounded-full ${presenceClass}" title="${escapeHtml(member.status || 'offline')}"></span></div><p class="text-[11px] text-text-muted truncate">${escapeHtml(member.roleTitle || member.currentActivity || 'Member')}</p></div>`;
    container.appendChild(row);
  }
}

// ---- Markdown-ish formatter for chat content (escaped first, then styled) ----
function formatMessageContent(text) {
  const fences = [];
  let src = escapeHtml(String(text ?? '')).replace(/```(\w*)\n?([\s\S]*?)```/g, (_m, lang, code) => {
    const token = `\u0000FENCE${fences.length}\u0000`;
    fences.push({ lang: lang || 'text', code });
    return token;
  });

  src = src.replace(/`([^`\n]+)`/g, '<code class="bg-surface-container-highest text-text-main font-code-md text-code-md px-1.5 py-0.5 rounded border border-border-subtle">$1</code>');
  src = src.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="font-semibold text-text-main">$1</strong>');
  src = src.replace(/(^|\s)\*([^*\n]+)\*(?=\s|$|[.,!?])/g, '$1<em>$2</em>');
  src = src.replace(/__([^_\n]+)__/g, '<u>$1</u>');
  src = src.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  src = src.replace(/(^|[\s(])((?:https?:\/\/|www\.)[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$2</a>');
  src = src.replace(/@([A-Za-z0-9_.]{2,32})/g, '<span class="rounded bg-primary-container/25 text-primary px-1 font-medium">@$1</span>');

  src = src.replace(/\u0000FENCE(\d+)\u0000/g, (_m, index) => {
    const fence = fences[Number(index)];
    return `<div class="chat-codeblock my-2 rounded-lg border border-border-subtle overflow-hidden max-w-full">
      <div class="flex items-center justify-between gap-2 bg-surface-container-high px-3 py-1.5">
        <span class="font-code-sm text-label-sm uppercase tracking-wide text-text-muted">${escapeHtml(fence.lang)}</span>
        <button type="button" onclick="copySnippet(this)" class="flex items-center gap-1 font-label-sm text-label-sm text-text-muted hover:text-text-main transition-colors"><span class="material-symbols-outlined text-body-sm">content_copy</span> Copy</button>
      </div>
      <pre class="bg-surface-container-lowest p-3 overflow-x-auto m-0"><code class="font-code-md text-code-md leading-relaxed text-on-surface whitespace-pre">${fence.code}</code></pre>
    </div>`;
  });

  return src;
}

function avatarFor(user, sizeClass = 'w-[40px] h-[40px]') {
  if (user.avatarUrl) {
    return `<img class="${sizeClass} rounded-full object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity" src="${escapeHtml(user.avatarUrl)}" alt="${escapeHtml(user.name)}" />`;
  }
  return `<div class="${sizeClass} rounded-full flex items-center justify-center font-bold text-[15px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${user.colorClass}" title="${escapeHtml(user.name)}">${escapeHtml(initials(user.name))}</div>`;
}

function shortTime(value) {
  if (!value) return '';
  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (sameDay) return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  return date.toLocaleString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined, hour: 'numeric', minute: '2-digit' });
}

function renderMessages(container, messages) {
  if (!messages.length) {
    renderStageInner(container, '<div class="py-10 text-center text-text-muted font-body-md">No messages yet. Start the conversation — press <kbd class="font-code-sm bg-surface-container px-1.5 py-0.5 rounded border border-border-subtle">Enter</kbd> to send.</div>');
    return;
  }

  const palette = ['bg-indigo-500 text-white', 'bg-emerald-600 text-white', 'bg-rose-500 text-white', 'bg-amber-500 text-black', 'bg-sky-600 text-white', 'bg-violet-600 text-white', 'bg-teal-600 text-white', 'bg-fuchsia-600 text-white'];
  const colorBySender = new Map();
  const rows = messages.map(message => {
    if (!colorBySender.has(message.senderName)) {
      colorBySender.set(message.senderName, palette[colorBySender.size % palette.length]);
    }
    return {
      name: message.senderName || 'Unknown',
      time: shortTime(message.createdAt),
      fullTime: message.createdAt ? new Date(message.createdAt).toLocaleString() : '',
      content: formatMessageContent(message.message),
      avatarUrl: message.avatarUrl,
      colorClass: colorBySender.get(message.senderName),
    };
  });

  let blocks = '';
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const prev = rows[i - 1];
    // Group with previous message when same sender within 10 minutes (Discord rule)
    const grouped = prev && prev.name === row.name &&
      Math.abs(new Date(messages[i].createdAt) - new Date(messages[i - 1].createdAt)) < 10 * 60 * 1000;

    if (!grouped) {
      blocks += `<article class="group flex items-start gap-4 pl-12 sm:pl-16 pr-3 pt-[3px] pb-1 relative rounded hover:bg-surface-container-low/50 transition-colors">
        <div class="absolute -left-0 top-0 w-10 flex justify-center">
          ${avatarFor(row)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="font-headline-sm text-body-md font-semibold text-text-main hover:underline cursor-pointer">${escapeHtml(row.name)}</span>
            <time class="font-code-sm text-[11px] text-text-muted select-none" title="${escapeHtml(row.fullTime)}">${escapeHtml(row.time)}</time>
          </div>
          <div class="message-content mt-0.5 font-body-md text-body-md leading-[1.375] text-on-surface break-words break-all">${row.content}</div>
        </div>
      </article>`;
    } else {
      blocks += `<article class="group flex items-start gap-4 pl-12 sm:pl-16 pr-3 py-px relative rounded hover:bg-surface-container-low/50 transition-colors">
        <time class="hidden group-hover:flex absolute left-0 top-1 w-11 text-right font-code-sm text-[10px] leading-4 text-text-muted select-none pr-1" title="${escapeHtml(row.fullTime)}">${escapeHtml(row.time.replace(/^(Today|Yesterday) at /, ''))}</time>
        <div class="flex-1 min-w-0">
          <div class="message-content font-body-md text-body-md leading-[1.375] text-on-surface break-words break-all">${row.content}</div>
        </div>
      </article>`;
    }
  }

  renderStageInner(container, `<div id="stage-messages" class="space-y-px">${blocks}</div>`);

  // Smooth autoscroll to newest message
  requestAnimationFrame(() => {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  });
}

async function sendRoomMessage(event) {
  event.preventDefault();
  const input = document.getElementById('channel-message-input');
  const message = input.value.trim();
  if (!activeRoomId || !message) return;
  const sendBtn = document.getElementById('send-btn');
  input.disabled = true;
  sendBtn?.setAttribute('disabled', 'true');
  try {
    await createRoomMessage(activeRoomId, currentUserId, message);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true })); // reset auto-resize height
    await loadRoom({ id: activeRoomId, name: document.getElementById('active-stage-title').textContent.replace(/^#/, ''), topic: document.getElementById('active-stage-desc').textContent });
  } catch (err) {
    console.error('Failed to send room message:', err);
    setText('#room-connection-status', 'Send failed');
  } finally {
    input.disabled = false;
    sendBtn?.removeAttribute('disabled');
    input.focus();
  }
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
}

// ---- Direct messages ----
async function loadDirectMessages() {
  const list = document.getElementById('dm-list');
  if (!list) return;

  try {
    const dms = await getDirectMessages(currentUserId);
    setText('[data-dm-unread-count]', String(dms.reduce((total, dm) => total + Number(dm.unreadCount || 0), 0)));
    renderDirectMessages(list, dms || []);
  } catch (err) {
    console.error('Failed to load direct messages:', err);
    renderDirectMessages(list, []);
  }
}

function renderDirectMessages(container, dms) {
  container.innerHTML = '';

  if (!dms.length) {
    container.appendChild(emptyState(container.dataset.emptyText || 'No conversations'));
    return;
  }

  for (const dm of dms) {
    container.appendChild(dmRow(dm));
  }
}

function dmRow(dm) {
  const row = document.createElement('div');
  row.className = 'flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors group';
  row.addEventListener('click', () => window.openDmWith?.(dm));

  const avatar = dm.avatarUrl
    ? `<img alt="${escapeHtml(dm.name)}" class="w-8 h-8 rounded-full object-cover" src="${dm.avatarUrl}" />`
    : `<div class="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-semibold font-body-sm">${initials(dm.name)}</div>`;

  const statusDot = dm.status === 'online'
    ? `<span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-low${dm.typing ? ' animate-pulse' : ''}"></span>`
    : '';

  row.innerHTML = `
    <div class="relative shrink-0">
      ${avatar}
      ${statusDot}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <span class="font-headline-sm text-body-sm text-text-main truncate font-medium">${escapeHtml(dm.name)}</span>
        ${dm.unreadCount ? `<span class="font-code-sm text-label-sm text-primary font-bold">${dm.unreadCount}</span>` : ''}
        ${dm.lastActiveLabel ? `<span class="font-label-sm text-[10px] text-text-muted">${escapeHtml(dm.lastActiveLabel)}</span>` : ''}
      </div>
      <p class="font-body-sm text-label-sm ${dm.typing ? 'text-primary italic' : 'text-text-muted'} truncate">${escapeHtml(dm.typing ? 'Typing...' : (dm.lastMessage || ''))}</p>
    </div>
  `;
  return row;
}

async function renderContactResults(query = '') {
  const container = document.getElementById('dm-contact-results');
  if (!container) return;
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    container.innerHTML = '';
    return;
  }
  const users = await getUsers();
  const matches = users.filter(user => user.id !== currentUserId && `${user.username} ${user.roleTitle || ''}`.toLowerCase().includes(normalized));
  container.innerHTML = '';
  for (const user of matches) {
    const button = document.createElement('button');
    button.className = 'w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-surface-container-high';
    button.type = 'button';
    button.innerHTML = `<span class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold">${escapeHtml(initials(user.username))}</span><span><strong class="block text-sm text-text-main">${escapeHtml(user.username)}</strong><small class="text-text-muted">${escapeHtml(user.roleTitle || 'New user')}</small></span>`;
    button.addEventListener('click', () => window.openDmWith({ id: user.id, name: user.username, roleTitle: user.roleTitle, subject: user.currentActivity }));
    container.appendChild(button);
  }
}

function renderDmHistory(history) {
  const container = document.getElementById('dm-history');
  if (!container) return;
  container.innerHTML = history.length
    ? history.map(item => `<div class="rounded-lg p-2 ${item.senderId === currentUserId ? 'bg-primary-container/20 ml-6' : 'bg-surface-container-high mr-6'}"><div class="text-[11px] text-text-muted">${item.senderId === currentUserId ? 'You' : escapeHtml(activeDmPartner.name)} · ${formatDate(item.createdAt)}</div><div class="text-sm text-text-main whitespace-pre-wrap">${escapeHtml(item.message)}</div></div>`).join('')
    : '<p class="text-sm text-text-muted">No messages yet. Start the conversation.</p>';
}

// ---- Helpers ----
function emptyState(message) {
  const div = document.createElement('div');
  div.className = 'px-2 py-4 text-center font-body-sm text-[11px] text-text-muted';
  div.textContent = message;
  return div;
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value || '';
}

function setSrc(selector, value) {
  const el = document.querySelector(selector);
  if (!el) return;
  const fallback = el.dataset.fallback;
  if (!el.dataset.fallbackBound) {
    el.addEventListener('error', () => {
      if (fallback && el.src !== new URL(fallback, document.baseURI).href) el.src = fallback;
    });
    el.dataset.fallbackBound = 'true';
  }
  if (value) el.src = value;
  else if (fallback) el.src = fallback;
}

function initials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}