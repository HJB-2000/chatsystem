import { useEffect, useRef, useState } from 'react';
import { emojis, placeholderData, placeholderUser } from './data/placeholders.js';

export const mockUser = { id: 'u1', username: 'amine', userTag: '0001' };

export const mockServers = [
  { id: 's1', name: 'Dev Lab', image: 'https://picsum.photos/seed/dev/120' },
  { id: 's2', name: 'Design',  image: 'https://picsum.photos/seed/design/120' },
  { id: 's3', name: 'Gaming' }, // no image -> letter fallback
];
export const mockRooms = [
  { id: 'r1', name: 'general', topic: 'Main discussion', count: 12, max: 25, image: 'https://picsum.photos/seed/r1/400/200' },
  { id: 'r2', name: 'frontend', topic: 'React, CSS, UI', count: 6, max: 10, image: 'https://picsum.photos/seed/r10/400/200' },
];

export const mockContacts = [
  { id: 'c1', username: 'sara',   userTag: '4821', time: '10:42', last: 'Pushed the fix',        unread: 2 },
  { id: 'c2', username: 'youssef',userTag: '1177', time: '09:15', last: 'See you in voice-lab',  unread: 0 },
  { id: 'c3', username: 'lina',   userTag: '3390', time: 'Mon',   last: 'Sent the mockups',      unread: 1 },
  { id: 'c4', username: 'omar',   userTag: '7054', time: 'Sun',   last: 'ok',                    unread: 0 },
];






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
        {/* <li className="rail__group" /><li className="rail__group rail__group--end">
            <button className="rail__btn rail__btn--ghost" title="Join collective" onClick={() => onAction('join')}>
                <Icon>link</Icon>
            </button>
            <button className="rail__btn rail__btn--ghost" title="Create collective" onClick={() => onAction('create')}>
                <Icon>add</Icon>
            </button>
        </li> */}
    </ul>;
}

// function ChannelPanel({ user, onAction, onProfile }) {
//     return <aside id="sub-channel-column">
//         <div className="col-head">
//             <div>
//                 <strong>No collective</strong>
//                 <div className="stats">
//                     <span>0 online</span>
//                     <span>/</span>
//                     <span>0 labs active</span>
//                 </div>
//             </div>
//             <button className="icon-btn" title="Collapse channels">
//                 <Icon>dock_to_left</Icon>
//             </button>
//         </div>
//         <div className="col-scroll">
//             <section>
//                 <div className="col-title">
//                     <span>Public rooms</span>
//                     <span className="col-title__btns">
//                         <button className="icon-btn" title="Create room" onClick={() => onAction('room')}>
//                             <Icon>add</Icon>
//                         </button>
//                         <button className="icon-btn" title="Create invite" onClick={() => onAction('invite')}>
//                             <Icon>person_add</Icon>
//                         </button>
//                     </span>
//                 </div>
//                 <div className="empty">Rooms will appear here when connected.</div>
//             </section>
//                 <section>
//                     <div className="col-title">
//                         <span>Direct messages <b className="dm-count">0</b></span>
//                         <button className="icon-btn" title="New message" onClick={() => onAction('dm')}>
//                             <Icon>add_comment</Icon>
//                         </button>
//                     </div>
//                     <input className="filter-input" aria-label="Filter contacts" placeholder="Filter contacts" />
//                     <div className="empty">No conversations yet.</div>
//                 </section>
//                 </div>
//                 <div className="col-foot">
//                     <button className="profile-button" onClick={onProfile}>
//                         <Avatar user={user} size={32} />
//                     </button>
//                     <div className="min-w-0">
//                         <p className="truncate">{user.username}</p>
//                         <p className="user-tag">#{user.userTag}</p>
//                     </div>
//                     <button className="icon-btn" title="Mute microphone">
//                         <Icon>mic</Icon>
//                     </button>
//                     <button className="icon-btn" title="Settings" onClick={onProfile}>
//                         <Icon>settings</Icon>
//                     </button>
//         </div>
//     </aside>;
// }






function ChannelPanel({ user, rooms = [], contacts = [], activeRoom, onAction, onSelectRoom, onSelectContact, onSettingsChange }) {
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
        <button className="icon-btn" title="Menu" onClick={() => onAction('menu')}>
            <Icon>menu</Icon>
        </button>
        </div>

        <div className="col-scroll">
        {showProfile ? (
            <div className="profile-panel">
            <div className="profile-card">
                <Avatar user={user} size={64} />
                <p className="profile-card__name">{user.username}</p>
                <p className="user-tag">#{user.userTag}</p>
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
                <span className="room-card__icon"><Icon>tag</Icon></span>
                <span className="min-w-0 flex-1 text-left">
                <span className="room-card__name">{r.name}</span>
                <span className="room-card__topic">{r.topic}</span>
                </span>
                <span className="room-card__meta">
                <span className={`room-card__count ${r.count >= r.max ? 'is-full' : ''}`}>{r.count}/{r.max}</span>
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




















// function ChannelPanel({ user, rooms = [], contacts = [], activeRoom, onAction, onProfile, onSelectRoom, onSelectContact }) {
// const [tab, setTab] = useState('rooms'); // 'rooms' | 'contacts'

// return (
// <aside id="sub-channel-column">
//     <div className="col-head col-tabs" role="tablist">
//     <button role="tab" aria-selected={tab === 'rooms'}
//         className={`col-tab ${tab === 'rooms' ? 'is-active' : ''}`}
//         onClick={() => setTab('rooms')}>rooms</button>
//     <button role="tab" aria-selected={tab === 'contacts'}
//         className={`col-tab ${tab === 'contacts' ? 'is-active' : ''}`}
//         onClick={() => setTab('contacts')}>contact</button>
//     <button className="icon-btn" title="Menu" onClick={() => onAction('menu')}>
//         <Icon>menu</Icon>
//     </button>
//     </div>

//     <div className="col-scroll">
//     {tab === 'rooms' ? (
//         rooms.length ? rooms.map(r => (
//         <button key={r.id}
//             className={`room-card ${r.image ? 'has-bg' : ''} ${r.id === activeRoom ? 'is-active' : ''}`}
//             style={r.image ? { '--bg': `url(${r.image})` } : undefined}
//             onClick={() => onSelectRoom?.(r.id)}>
//             <span className="room-card__icon"><Icon>tag</Icon></span>
//             <span className="min-w-0 flex-1 text-left">
//                 <span className="room-card__name">{r.name}</span>
//                 <span className="room-card__topic">{r.topic}</span>
//             </span>
//             <span className="room-card__meta">
//                 <span className={`room-card__count ${r.count >= r.max ? 'is-full' : ''}`}>{r.count}/{r.max}</span>
//             </span>
//         </button>
//         )) : <div className="empty">No rooms.</div>
//     ) : (
//         contacts.length ? contacts.map(c => (
//         <button key={c.id} className="dm-row" onClick={() => onSelectContact?.(c.id)}>
//             <span className="relative shrink-0">
//             <Avatar user={c} size={32} />
//             </span>
//             <span className="min-w-0 flex-1 text-left">
//             <span className="dm-row__top">
//                 <span className="dm-row__name">{c.username}</span>
//                 <span className="dm-row__time">{c.time}</span>
//             </span>
//             <span className="dm-row__last">{c.last}</span>
//             </span>
//             {c.unread > 0 && <span className="dm-row__unread">{c.unread}</span>}
//         </button>
//         )) : <div className="empty">No contacts.</div>
//     )}
//     </div>

//     <div className="col-foot">
//         <button className="profile-button" onClick={onProfile}>
//             <Avatar user={user} size={32} />
//         </button>
//         <div className="min-w-0 flex-1">
//             <p className="truncate">{user.username}</p>
//             <p className="user-tag">#{user.userTag}</p>
//         </div>
//         <button className="icon-btn" title="Mute microphone"><Icon>mic</Icon></button>
//         <button className="icon-btn" title="Settings" onClick={onProfile}><Icon>settings</Icon></button>
//     </div>
// </aside>
// );
// }

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

/********************************************************************************************************** */
function StageHeader({ room, huddle, onSearch, onMembers, onHuddle, onMore }) {
    return <header id="stage-header">
        {/* <button className="icon-btn" title="Channels">
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
        </div> */}
    </header>;
}

function MessageArea({ room, messages, search }) {
    const visible = messages.filter(message => !search || message.message.toLowerCase().includes(search.toLowerCase()));
    return <div id="msg-list" role="log" aria-live="polite">
        {/* {room && <div className="welcome">
            <div className="welcome__icon">
                <Icon>tag</Icon>
            </div>
            <h2>Welcome to #{room.name}</h2>
            <p>{room.topic || 'This is the start of the channel.'}</p>
        </div>}
        <div className="empty-state">
            <Icon>forum</Icon>
            <p>{visible.length ? `${visible.length} message placeholder(s)` : search ? 'No messages match your search.' : room ? 'No messages yet. Say hello.' : 'Create or join a room to see its messages.'}</p>
        </div> */}
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
        {/* <form className="composer__box" onSubmit={submit}>
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
            </form><p className="kbd-hint"><kbd>Enter</kbd> send · <kbd>Shift</kbd>+<kbd>Enter</kbd> new line</p> */}
    </footer>;
}

function Roster({ open, onClose }) {
  return <aside id="member-list-panel" className={open ? 'is-open' : ''}>
    {/* <div className="col-head">
        <strong>Roster</strong>
        <span className="pill pill--live">0 online</span>
        <button className="icon-btn" onClick={onClose}>
            <Icon>dock_to_right</Icon>
        </button>
        </div><div id="room-roster"><div className="empty">Members will appear when a room is selected.</div></div> */}
    </aside>;
}

function Dialog({ title, onClose, children }) {
  return <div className="modal" role="dialog" aria-modal="true">
    {/* <div className="modal__card"><div className="modal__head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><Icon>close</Icon></button></div>{children}</div> */}
    </div>;
}

// export function App() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [membersOpen, setMembersOpen] = useState(true);
//   const [room, setRoom] = useState(null);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const [huddle, setHuddle] = useState(false);
//   const [dialog, setDialog] = useState(null);
//   const [toast, setToast] = useState('');
//   const [messages, setMessages] = useState(placeholderData.messages);
//   const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 3000); };
//   const send = message => { setMessages(current => [...current, { id: Date.now(), message }]); notify('Message queued for database connection'); };
//   useEffect(() => { document.title = room ? `#${room.name} · NexusCampus` : 'NexusCampus'; }, [room]);
//   return <div className={`react-app ${collapsed ? 'sidebar-collapsed' : ''}`}><TopBar user={placeholderUser} onToggleSidebar={() => setCollapsed(value => !value)} /><Sidebar collapsed={collapsed} /><main id="app-main"><div id="chat-shell" data-mode="wide" data-channels="open" data-members={membersOpen ? 'open' : 'closed'} data-scrim="off"><div id="channel-rail"><ChannelRail onAction={setDialog} /><ChannelPanel user={placeholderUser} onAction={setDialog} onProfile={() => setDialog('profile')} /></div><section id="stage"><StageHeader room={room} huddle={huddle} onSearch={() => setSearchOpen(value => !value)} onMembers={() => setMembersOpen(value => !value)} onHuddle={() => setHuddle(value => !value)} onMore={() => notify('More room actions will appear here')} />{searchOpen && <div id="search-bar"><Icon>search</Icon><input autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder="Search this room" /><button className="icon-btn" onClick={() => { setSearch(''); setSearchOpen(false); }}><Icon>close</Icon></button></div>}{huddle && <div id="huddle-bar"><span><i className="live-dot" /> Huddle <code>00:00</code></span><button className="chip chip--danger" onClick={() => setHuddle(false)}><Icon>call_end</Icon> Leave</button></div>}<div id="messages-wrap"><div id="chat-messages-container"><MessageArea room={room} messages={messages} search={search} /></div></div><Composer room={room} onSend={send} /></section><Roster open={membersOpen} onClose={() => setMembersOpen(false)} /></div></main>{dialog && <Dialog title={dialog === 'profile' ? 'Profile and status' : dialog === 'dm' ? 'Direct message' : 'Database action'} onClose={() => setDialog(null)}><p className="empty">This control is ready for database-backed fields.</p><div className="modal__foot"><button className="btn btn--primary" onClick={() => setDialog(null)}>Close</button></div></Dialog>}{toast && <div className="toast"><p className="toast__title">{toast}</p></div>}</div>;
// }




export function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [membersOpen, setMembersOpen] = useState(true);
    const [serverId, setServerId] = useState(mockServers[0].id);
    const [room, setRoom] = useState(mockRooms[0]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [huddle, setHuddle] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [toast, setToast] = useState('');
    const [messages, setMessages] = useState(placeholderData.messages);

    const notify = message => { setToast(message); window.setTimeout(() => setToast(''), 3000); };
    const send = message => {
    setMessages(current => [...current, { id: Date.now(), message }]);
    notify('Message queued for database connection');
    };

    useEffect(() => {
    document.title = room ? `#${room.name} · NexusCampus` : 'NexusCampus';
    }, [room]);

    return (
    <div className={`react-app ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar user={mockUser} onToggleSidebar={() => setCollapsed(v => !v)} />
        <Sidebar collapsed={collapsed} />
        <main id="app-main">
        <div id="chat-shell" data-mode="wide" data-channels="open"
                data-members={membersOpen ? 'open' : 'closed'} data-scrim="off">
            <div id="channel-rail">
            <ServerRail
                servers={mockServers}
                activeId={serverId}
                onSelect={setServerId}
                onAction={setDialog}
            />
            <ChannelPanel
                user={mockUser}
                rooms={mockRooms}
                contacts={mockContacts}
                activeRoom={room?.id}
                onSelectRoom={id => setRoom(mockRooms.find(r => r.id === id) ?? null)}
                onSelectContact={() => setDialog('dm')}
                onAction={setDialog}
                onProfile={() => setDialog('profile')}
            />
            </div>

            <section id="stage">
            <StageHeader
                room={room}
                huddle={huddle}
                onSearch={() => setSearchOpen(v => !v)}
                onMembers={() => setMembersOpen(v => !v)}
                onHuddle={() => setHuddle(v => !v)}
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

            <Roster open={membersOpen} onClose={() => setMembersOpen(false)} />
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
    </div>
    );
    }

