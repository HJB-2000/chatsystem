import { useEffect, useRef, useState } from 'react';
import { emojis, placeholderUser } from './data/placeholders.js';
import { chatApi, getUserTag, setUserTag } from './api/chatApi';
import { GatewayClient } from './realtime/gatewayClient';

const emptyUser = { ...placeholderUser, id: null, username: 'Connecting...' };






const Icon = ({ children }) => <span className="material-symbols-outlined">{children}</span>;

function Avatar({ user = placeholderUser, size = 40 }) {
    const name = user.name || user.username || '?';
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || '?';
    const hue = [...name].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 360, 0);
    return user.avatarUrl
        ? <img className="avatar" src={user.avatarUrl} alt={name} style={{ width: size, height: size }} />
        : <span className="avatar" title={name} style={{ width: size, height: size, fontSize: size * .38, background: `hsl(${hue} 50% 40%)` }}>{initials}</span>;
}

function TopBar({ user, onToggleSidebar }) {
    return <header id="topbar">
        {/* <div className="topbar__brand"><button className="icon-btn" aria-label="Toggle sidebar" onClick={onToggleSidebar}><Icon>menu_open</Icon></button><strong>NexusCampus</strong></div>
        <div id="topbar-search"><Icon>search</Icon><input aria-label="Search" placeholder="Search roadmaps, rooms, security logs..." /></div>
        <div className="topbar__actions"><button className="copilot-button"><Icon>auto_awesome</Icon><span>Copilot</span></button><button className="icon-btn" aria-label="Notifications"><Icon>notifications</Icon></button><Avatar user={user} size={32} /><div className="topbar__user"><b>{user.username}</b><span>{user.roleTitle}</span></div></div> */}
    </header>;
}

function Sidebar({ collapsed }) {
    const links = ['Dashboard', 'AI Roadmap & Tracks', 'Notes & AI Studio', 'Live Study Rooms', 'Schedule Planner', 'SOC & Fail2ban', 'IP Blacklist & Access', 'About'];
    return <aside id="app-sidebar" className={collapsed ? 'is-collapsed' : ''}>
        {/* <nav><p className="nav-heading">Navigation</p>{links.map(link => <a href="#" className={link === 'Live Study Rooms' ? 'is-current' : ''} key={link}>{link}</a>)}</nav><nav><a href="#">Settings</a><a href="#">Help &amp; Docs</a></nav> */}
    </aside>;
}

function ChannelRail({ onAction }) {
    return <ul id="collective-rail" aria-label="Collectives">
        <li className="rail__group" /><li className="rail__group rail__group--end">
            <button className="rail__btn rail__btn--ghost" title="Join collective" onClick={() => onAction('join')}>
                <Icon>link</Icon>
            </button>
            <button className="rail__btn rail__btn--ghost" title="Create collective" onClick={() => onAction('create')}>
                <Icon>add</Icon>
            </button>
        </li>
    </ul>;
}

function ChannelPanel({ user, rooms = [], contacts = [], activeRoom, onAction, onToggle, onSelectRoom, onSelectContact, onSettingsChange }) {
  const [tab, setTab] = useState('rooms');   // 'rooms' | 'contacts'
    const [showProfile, setShowProfile] = useState(false);
    const [settings, setSettings] = useState({ notifications: true, volume: 80, theme: 'dark' });

    const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    onSettingsChange?.(next);
    };

    const pickTab = (t) => { setTab(t); setShowProfile(false); };
    const toggleProfile = () => setShowProfile(p => !p);

    return (
    <aside id="sub-channel-column">
        <div className="col-head col-tabs" role="tablist">
        <button role="tab" aria-selected={!showProfile && tab === 'rooms'}
            className={`col-tab ${!showProfile && tab === 'rooms' ? 'is-active' : ''}`}
            onClick={() => pickTab('rooms')}>rooms</button>
        <button role="tab" aria-selected={!showProfile && tab === 'contacts'}
            className={`col-tab ${!showProfile && tab === 'contacts' ? 'is-active' : ''}`}
            onClick={() => pickTab('contacts')}>contact</button>
        <button className="icon-btn" title="Hide rooms and contacts" aria-label="Hide rooms and contacts" onClick={onToggle}>
            <Icon>menu</Icon>
        </button>
        </div>

        <div className="col-scroll">
            <div className="profile-panel">
                
            </div>
        {showProfile ? (
            <div className="profile-panel">
            <div className="profile-card">
                <Avatar user={user} size={64} />
                <p className="profile-card__name">{user.username}</p>
                <p className="user-tag">#{user.userTag}</p>
                <span className="profile-card__status"><i className="live-dot" /> {user.status || 'offline'}</span>
                <strong>{user.roleTitle || 'Community member'}</strong>
                <small>{user.currentActivity || 'Ready to connect'}</small>
            </div>

            <div className="settings-panel">
                <label className="setting-row">
                <span>Notifications</span>
                <input type="checkbox" checked={settings.notifications}
                    onChange={e => update('notifications', e.target.checked)} />
                </label>

                <label className="setting-row">
                <span>Volume {settings.volume}</span>
                <input type="range" min="0" max="100" value={settings.volume}
                    onChange={e => update('volume', +e.target.value)} />
                </label>

                <label className="setting-row">
                <span>Theme</span>
                <select value={settings.theme} onChange={e => update('theme', e.target.value)}>
                    <option value="dark">dark</option>
                    <option value="light">light</option>
                </select>
                </label>
            </div>
            </div>
        ) : tab === 'rooms' ? (
            rooms.length ? rooms.map(r => (
            <button key={r.id}
                className={`room-card ${r.image ? 'has-bg' : ''} ${r.id === activeRoom ? 'is-active' : ''}`}
                style={r.image ? { '--bg': `url(${r.image})` } : undefined}
                onClick={() => onSelectRoom?.(r.id)}>
                <span className="room-card__icon"><Icon>{r.icon || (r.type === 'VOICE' ? 'headset_mic' : 'tag')}</Icon></span>
                <span className="min-w-0 flex-1 text-left">
                <span className="room-card__name">{r.name}</span>
                <span className="room-card__topic">{r.topic}</span>
                </span>
                <span className="room-card__meta">
                <span className={`room-card__count ${r.count >= r.max ? 'is-full' : ''}`}>{r.count}/{r.max}</span>
                <span className="room-card__tag">{r.type === 'VOICE' ? 'voice' : 'text'}</span>
                </span>
            </button>
            )) : <div className="empty">No rooms.</div>
        ) : (
            contacts.length ? contacts.map(c => (
            <button key={c.id} className="dm-row" onClick={() => onSelectContact?.(c.id)}>
                <span className="relative shrink-0"><Avatar user={c} size={32} /></span>
                <span className="min-w-0 flex-1 text-left">
                <span className="dm-row__top">
                    <span className="dm-row__name">{c.username}</span>
                    <span className="dm-row__time">{c.time}</span>
                </span>
                <span className="dm-row__last">{c.last}</span>
                </span>
                {c.unread > 0 && <span className="dm-row__unread">{c.unread}</span>}
            </button>
            )) : <div className="empty">No contacts.</div>
        )}
        </div>

        <div className="col-foot">
        <button className="profile-button" onClick={toggleProfile}>
            <Avatar user={user} size={32} />
        </button>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={toggleProfile}>
            <p className="truncate">{user.username}</p>
            <p className="user-tag">#{user.userTag}</p>
        </div>
        <button className="icon-btn" title="Mute microphone"><Icon>mic</Icon></button>
        <button className={`icon-btn ${showProfile ? 'is-active' : ''}`} title="Settings" onClick={toggleProfile}>
            <Icon>settings</Icon>
        </button>
        </div>
    </aside>
    );
}


function ServerRail({ servers = [], activeId, onSelect, onAction }) {
return (
<ul id="collective-rail">
    <li className="rail__group">
    {servers.map(s => (
        <button key={s.id} title={s.name}
            className={`rail__btn ${s.image ? 'has-img' : ''} ${s.id === activeId ? 'is-active' : ''}`}
            style={s.image ? { backgroundImage: `url(${s.image})` } : undefined}
            onClick={() => onSelect(s.id)}>
            {!s.image && s.name[0]}
        </button>
    ))}
    </li>
    <li className="rail__group rail__group--end">
    <button className="rail__btn rail__btn--ghost" title="Add server" onClick={() => onAction('server')}>
        <Icon>add</Icon>
    </button>
    </li>
</ul>
);
}

function StageHeader({ room, huddle, channelsOpen, onChannels, onSearch, onMembers, onHuddle, onMore }) {
    return <header id="stage-header">
        <button className="icon-btn" title="Channels" aria-label="Toggle channels" aria-pressed={channelsOpen} onClick={onChannels}>
            <Icon>menu</Icon>
        </button>
        <div className="stage-title">
            <span className="stage-title__icon">
                <Icon>tag</Icon>
            </span>
            <div className="stage-title__text">
                <div className="stage-title__row">
                    <h1>{room ? `#${room.name}` : 'Select a room'}</h1>
                    <span className="pill">{room ? 'Live' : 'Idle'}</span>
                </div>
                <p>{room?.topic || 'Pick or create a room to start chatting'}</p>
            </div>
        </div>
        <div className="stage-actions">
            <button className="icon-btn" title="Search messages" onClick={onSearch}>
                <Icon>search</Icon>
            </button>
            <button className={`huddle-btn ${huddle ? 'is-on' : ''}`} onClick={onHuddle}>
                <Icon>{huddle ? 'mic' : 'headset_mic'}</Icon>
                <span>{huddle ? 'In huddle' : 'Start huddle'}</span>
            </button>
            <button className="icon-btn" title="Members" onClick={onMembers}>
                <Icon>group</Icon>
            </button>
            <button className="icon-btn" title="More" onClick={onMore}>
                <Icon>more_vert</Icon>
            </button>
        </div>
    </header>;
}

function MessageArea({ room, messages, search }) {
    const visible = messages.filter(message => !search || message.message.toLowerCase().includes(search.toLowerCase()));
    return <div id="msg-list" role="log" aria-live="polite">
        {room && <div className="welcome">
            <div className="welcome__icon">
                <Icon>tag</Icon>
            </div>
            <h2>Welcome to #{room.name}</h2>
            <p>{room.topic || 'This is the start of the channel.'}</p>
        </div>}
        {visible.length ? visible.map(message => <article className="message-row" key={message.id}>
            <Avatar user={{ username: message.senderName, avatarUrl: message.avatarUrl }} size={36} />
            <div className="message-row__content"><div className="message-row__meta"><strong>{message.senderName}</strong><time>{new Date(message.createdAt).toLocaleString()}</time>{message.editedAt && <small>(edited)</small>}</div><p>{message.message}</p></div>
        </article>) : <div className="empty-state">
            <Icon>forum</Icon>
            <p>{search ? 'No messages match your search.' : room ? 'No messages yet. Say hello.' : 'Create or join a room to see its messages.'}</p>
        </div>}
    </div>;
}

function Composer({ room, onSend }) {
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const input = useRef(null);
    const canSend = Boolean(room && (text.trim() || files.length));
    const submit = event => { event.preventDefault(); if (!canSend) return; onSend([text.trim(), ...files.map(file => `Attachment: ${file.name}`)].filter(Boolean).join('\n')); setText(''); setFiles([]); };
    return <footer id="composer">
        <form className="composer__box" onSubmit={submit}>
            <div className="composer__context">
                <span className="composer__context-icon"><Icon>forum</Icon></span>
                <span className="composer__context-copy">
                    <strong>{room ? `Message #${room.name}` : 'Start a conversation'}</strong>
                    <span>{room ? 'Your message will be shared with this room' : 'Select a room to begin'}</span>
                </span>
                <span className="composer__status"><i className="live-dot" /> Live</span>
            </div>
            <div className="chips">{files.map((file, index) => 
                <span className="chip-file" key={`${file.name}-${index}`}>
                    <Icon>attach_file</Icon>
                    {file.name}<button type="button" onClick={() => setFiles(current => current.filter((_, i) => i !== index))}>
                        <Icon>close</Icon>
                    </button>
                </span>)}
            </div>
            <textarea id="channel-message-input" value={text} disabled={!room} onChange={event => setText(event.target.value)} placeholder={room ? `Message #${room.name}` : 'Select a room to start chatting'} aria-label="Message" />
                <div className="composer__bar">
                    <div className="composer__tools">
                        <button type="button" className="icon-btn" title="Attach files" onClick={() => input.current?.click()}>
                            <Icon>add_circle</Icon>
                        </button>
                        <input ref={input} type="file" hidden multiple onChange={event => { setFiles(current => [...current, ...Array.from(event.target.files).slice(0, 5 - current.length)]); event.target.value = ''; }} />
                        <button type="button" className="icon-btn" title="Insert code block" onClick={() => setText(current => `${current}\n\`\`\`\n\n\`\`\``)}>
                            <Icon>code_blocks</Icon>
                        </button>
                        <button type="button" className="icon-btn" title="Emoji" onClick={() => setEmojiOpen(current => !current)}>
                            <Icon>sentiment_satisfied</Icon>
                        </button>
                        <span className="hint">**bold** `code` ```block``` ||spoiler||</span>
                    </div>
                    <div className="composer__send"><span id="char-count">{text.length > 1600 ? `${text.length}/2000` : ''}</span>
                    <button id="send-btn" disabled={!canSend}>Send 
                        <Icon>send</Icon>
                    </button>
                </div>
            </div>
            {emojiOpen && 
            <div className="pop emoji-picker">{emojis.map(emoji => 
                <button type="button" key={emoji} onClick={() => { setText(current => current + emoji); setEmojiOpen(false); }}>
                    {emoji}
                </button>)}
            </div>}
            </form><p className="kbd-hint"><kbd>Enter</kbd> send · <kbd>Shift</kbd>+<kbd>Enter</kbd> new line</p>
    </footer>;
}

function Roster({ open, onClose, members = [] }) {
    return <aside id="member-list-panel" className={open ? 'is-open' : ''}>
        <div className="col-head">
            <strong>Roster</strong>
            <span className="pill pill--live">{members.filter(member => member.status === 'online').length} online</span>
            <button className="icon-btn" onClick={onClose}>
                <Icon>dock_to_right</Icon>
            </button>
            </div><div id="room-roster">{members.length ? members.map(member => <div className="dm-row" key={member.id}>
                <Avatar user={member} size={32} /><span className="min-w-0 flex-1"><strong>{member.nickname || member.username}</strong><small>{member.status || 'offline'}</small></span>
            </div>) : <div className="empty">Members will appear when a room is selected.</div>}</div>
    </aside>;
}

function Dialog({ title, onClose, children }) {
    return <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__card"><div className="modal__head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><Icon>close</Icon></button></div>{children}</div>
    </div>;
}

function AuthPanel({ onAuthenticated }) {
    const [userTagId, setUserTagId] = useState('');
    const [error, setError] = useState('');
    const submit = async event => {
        event.preventDefault();
        setError('');
        try {
            setUserTag(userTagId.trim());
            await chatApi.getCollectives();
            onAuthenticated({ ...emptyUser, id: userTagId.trim(), username: 'Connected' });
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Authentication failed');
        }
    };
    return <main className="auth-panel"><form onSubmit={submit} className="auth-card">
        <p className="eyebrow">ChatSystem</p><h1>Connect your account</h1>
        <label>User tag ID<input value={userTagId} onChange={event => setUserTagId(event.target.value)} autoComplete="off" required /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn--primary" type="submit">Connect</button>
    </form></main>;
}

export function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [channelsOpen, setChannelsOpen] = useState(true);
    const [membersOpen, setMembersOpen] = useState(true);
    const [layoutMode, setLayoutMode] = useState('wide');
    const shellRef = useRef(null);
    const gatewayRef = useRef(null);
    const [user, setUser] = useState(emptyUser);
    const [userTagId, setAuthUserTagId] = useState(getUserTag());
    const [servers, setServers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [members, setMembers] = useState([]);
    const [serverId, setServerId] = useState(null);
    const [room, setRoom] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [huddle, setHuddle] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [toast, setToast] = useState('');
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('offline');
    const roomRef = useRef(null);
    roomRef.current = room;

    const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 3000); };
    const addMessage = message => {
    setMessages(current => current.some(item => item.id === message.id) ? current : [...current, message]);
    };
    const send = async message => {
    if (!room || !user.id) return;
    try {
        const created = room.type === 'DM' ? await chatApi.sendDm(room.partnerId, message) : await chatApi.sendMessage(room.id, message);
        addMessage(created);
        notify('Message sent');
    } catch (error) {
        notify(error instanceof Error ? error.message : 'Message failed');
    }
    };

    useEffect(() => {
    if (!userTagId) return undefined;
    let active = true;
    Promise.all([chatApi.getCollectives(), chatApi.getContacts()])
        .then(([nextCollectives, nextContacts]) => {
            if (!active) return;
            setUser({ ...emptyUser, id: userTagId, username: 'Connected' });
            setContacts(nextContacts.map(contact => ({ ...contact, id: contact.partnerId, time: contact.lastActiveLabel ?? '', last: contact.lastMessage ?? '', unread: contact.unreadCount ?? 0 })));
            const nextServers = nextCollectives.map(collective => ({ id: collective.id, name: collective.name, image: collective.iconUrl }));
            setServers(nextServers);
            const firstCollective = nextCollectives[0];
            if (!firstCollective) return;
            setServerId(firstCollective.id);
        })
        .catch(error => notify(error instanceof Error ? error.message : 'Backend connection failed'));
    return () => { active = false; };
    }, [userTagId]);

    useEffect(() => {
    if (!user.id || !serverId) return undefined;
    let active = true;
    setRoom(null);
    chatApi.getRooms(serverId)
        .then(nextRooms => {
            if (!active) return;
            const decoratedRooms = nextRooms.map((nextRoom, index) => ({
                ...nextRoom,
                count: nextRoom.memberCount ?? 0,
                max: nextRoom.capacity ?? 100,
                image: `https://images.unsplash.com/photo-${['1516321318423-f06f85e504b3', '1558655146-d09347e92766', '1542751371-adc38448a05e'][index % 3]}?w=400&h=200&fit=crop`,
            }));
            setRooms(decoratedRooms);
            setRoom(decoratedRooms.find(nextRoom => nextRoom.type !== 'VOICE') ?? decoratedRooms[0] ?? null);
        })
        .catch(error => notify(error instanceof Error ? error.message : 'Server rooms failed to load'));
    return () => { active = false; };
    }, [user.id, serverId]);

    useEffect(() => {
    if (!user.id || !room) return undefined;
    let active = true;
    setMessages([]);
    if (room.type === 'DM') return undefined;
    Promise.all([chatApi.getMessages(room.id), chatApi.getMembers(room.id)])
        .then(([page, nextMembers]) => { if (active) { setMessages(page.items); setMembers(nextMembers); } })
        .catch(error => notify(error instanceof Error ? error.message : 'Room failed to load'));
    return () => { active = false; };
    }, [user.id, room?.id]);

    useEffect(() => {
    if (!user.id) return undefined;
    const gateway = new GatewayClient();
    gatewayRef.current = gateway;
    const removeStatus = gateway.onStatus(setConnectionStatus);
    const removeMessage = gateway.on('MESSAGE_CREATE', event => {
        if (String(event.channel_id) !== String(roomRef.current?.id)) return;
        addMessage({
        id: String(event.message_id), channelId: String(event.channel_id), senderId: String(event.author_id),
        senderName: event.author?.username ?? 'Unknown', avatarUrl: event.author?.avatarUrl ?? null,
        message: event.content ?? '', createdAt: event.timestamp ?? new Date().toISOString(),
        });
    });
    const removeUpdate = gateway.on('MESSAGE_UPDATE', event => {
        if (String(event.channel_id) !== String(roomRef.current?.id)) return;
        setMessages(current => current.map(message => message.id === String(event.message_id) ? { ...message, message: event.content, editedAt: event.timestamp } : message));
    });
    const removeDelete = gateway.on('MESSAGE_DELETE', event => setMessages(current => current.filter(message => message.id !== String(event.message_id))));
    const removePresence = gateway.on('PRESENCE_UPDATE', event => setMembers(current => current.map(member => member.id === String(event.user_id) ? { ...member, status: event.status } : member)));
    gateway.connect(getUserTag() ?? '');
    return () => { removeStatus(); removeMessage(); removeUpdate(); removeDelete(); removePresence(); gateway.disconnect(); gatewayRef.current = null; };
    }, [user.id]);

    useEffect(() => {
    const handleVisibility = () => gatewayRef.current?.sendPresence(document.hidden ? 'idle' : 'online');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    useEffect(() => {
    document.title = room ? `#${room.name} · NexusCampus` : 'NexusCampus';
    }, [room]);

    useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    const updateLayoutMode = entries => {
        const width = entries[0]?.contentRect.width ?? shell.clientWidth;
        setLayoutMode(width < 1024 ? 'narrow' : 'wide');
    };
    const observer = new ResizeObserver(updateLayoutMode);
    observer.observe(shell);
    updateLayoutMode([{ contentRect: shell.getBoundingClientRect() }]);
    return () => observer.disconnect();
    }, []);

    if (!userTagId) return <AuthPanel onAuthenticated={nextUser => { setAuthUserTagId(getUserTag()); setUser(nextUser); }} />;
    return (
    <div className={`react-app ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar user={user} onToggleSidebar={() => setCollapsed(v => !v)} />
        <Sidebar collapsed={collapsed} />
        <main id="app-main">
        <div ref={shellRef} id="chat-shell" data-mode={layoutMode} data-channels={channelsOpen ? 'open' : 'closed'}
                data-members={membersOpen ? 'open' : 'closed'} data-scrim="off">
            <div id="channel-rail">
            <ServerRail
                servers={servers}
                activeId={serverId}
                onSelect={setServerId}
                onAction={setDialog}
            />
            <ChannelPanel
                user={user}
                rooms={rooms}
                contacts={contacts}
                activeRoom={room?.id}
                onToggle={() => setChannelsOpen(false)}
                onSelectRoom={id => setRoom(rooms.find(r => r.id === id) ?? null)}
                onSelectContact={async id => {
                    const contact = contacts.find(item => item.id === id);
                    if (!contact) return;
                    try {
                        const dmMessages = await chatApi.getDm(id);
                        setMessages(dmMessages);
                        setRoom({ id: contact.channelId ?? `dm-${id}`, name: contact.username, topic: 'Direct message', type: 'DM', partnerId: id });
                    } catch (error) { notify(error instanceof Error ? error.message : 'Direct message failed'); }
                }}
                onAction={setDialog}
                onProfile={() => setDialog('profile')}
            />
            </div>

            <section id="stage">
            <StageHeader
                room={room}
                huddle={huddle}
                channelsOpen={channelsOpen}
                onChannels={() => setChannelsOpen(v => !v)}
                onSearch={() => setSearchOpen(v => !v)}
                onMembers={() => setMembersOpen(v => !v)}
                onHuddle={async () => {
                    if (!room || !user.id) return;
                    try { if (huddle) await chatApi.leaveVoice(room.id, user.id); else await chatApi.joinVoice(room.id, user.id); setHuddle(v => !v); }
                    catch (error) { notify(error instanceof Error ? error.message : 'Voice action failed'); }
                }}
                onMore={() => notify('More room actions will appear here')}
            />
            {searchOpen && (
                <div id="search-bar">
                <Icon>search</Icon>
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search this room" />
                <button className="icon-btn" onClick={() => { setSearch(''); setSearchOpen(false); }}>
                    <Icon>close</Icon>
                </button>
                </div>
            )}
            {huddle && (
                <div id="huddle-bar">
                <span><i className="live-dot" /> Huddle <code>00:00</code></span>
                <button className="chip chip--danger" onClick={() => setHuddle(false)}>
                    <Icon>call_end</Icon> Leave
                </button>
                </div>
            )}
            <div id="messages-wrap">
                <div id="chat-messages-container">
                <MessageArea room={room} messages={messages} search={search} />
                </div>
            </div>
            <Composer room={room} onSend={send} />
            </section>

            <Roster open={membersOpen} onClose={() => setMembersOpen(false)} members={members} />
        </div>
        </main>

        {dialog && (
        <Dialog
            title={dialog === 'profile' ? 'Profile and status' : dialog === 'dm' ? 'Direct message' : 'Database action'}
            onClose={() => setDialog(null)}>
            <p className="empty">This control is ready for database-backed fields.</p>
            <div className="modal__foot">
            <button className="btn btn--primary" onClick={() => setDialog(null)}>Close</button>
            </div>
        </Dialog>
        )}
        {toast && <div className="toast"><p className="toast__title">{toast}</p></div>}
        <div className="connection-status" aria-live="polite">{connectionStatus}</div>
    </div>
    );
    }



    