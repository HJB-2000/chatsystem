(() => {
"use strict";
var __webpack_modules__ = ({
"./apps/gateway/src/app/config.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  HEARTBEAT_GRACE_MS: () => (HEARTBEAT_GRACE_MS),
  HEARTBEAT_INTERVAL_MS: () => (HEARTBEAT_INTERVAL_MS),
  IDENTIFY_TIMEOUT_MS: () => (IDENTIFY_TIMEOUT_MS),
  MAX_BUFFERED_BYTES: () => (MAX_BUFFERED_BYTES),
  PRESENCE_TTL_S: () => (PRESENCE_TTL_S),
  REPLAY_BUFFER_PER_CHANNEL: () => (REPLAY_BUFFER_PER_CHANNEL),
  TOPICS: () => (TOPICS),
  TYPING_COOLDOWN_MS: () => (TYPING_COOLDOWN_MS)
});
const HEARTBEAT_INTERVAL_MS = 41_250;
const HEARTBEAT_GRACE_MS = 10_000;
const IDENTIFY_TIMEOUT_MS = 10_000;
const MAX_BUFFERED_BYTES = 1_000_000; // slow consumer threshold
const TYPING_COOLDOWN_MS = 5_000;
const PRESENCE_TTL_S = 300;
const REPLAY_BUFFER_PER_CHANNEL = 100;
const TOPICS = {
    messages: 'messages',
    presence: 'presence',
    voice: 'voice_state'
};


},
"./apps/gateway/src/app/events.consumer.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  EventsConsumer: () => (EventsConsumer)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _config__rspack_import_1 = __webpack_require__("./apps/gateway/src/app/config.ts");
/* import */ var _kafka_service__rspack_import_2 = __webpack_require__("./apps/gateway/src/app/kafka.service.ts");
/* import */ var _protocol__rspack_import_3 = __webpack_require__("./apps/gateway/src/app/protocol.ts");
/* import */ var _registry_service__rspack_import_4 = __webpack_require__("./apps/gateway/src/app/registry.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}





class EventsConsumer {
    onMessage(v) {
        const channelId = String(v?.channel_id ?? '');
        const messageId = String(v?.message_id ?? '');
        if (!channelId || !messageId) return;
        const eventType = v.type === 'MESSAGE_EDIT' ? _protocol__rspack_import_3.Evt.MESSAGE_UPDATE : v.type === 'MESSAGE_DELETE' ? _protocol__rspack_import_3.Evt.MESSAGE_DELETE : _protocol__rspack_import_3.Evt.MESSAGE_CREATE;
        const out = (0,_protocol__rspack_import_3.dispatch)(eventType, {
            ...v,
            channel_id: channelId,
            message_id: messageId,
            author_id: v.author_id != null ? String(v.author_id) : undefined
        });
        if (eventType === _protocol__rspack_import_3.Evt.MESSAGE_CREATE) this.registry.remember(channelId, messageId, out);
        this.registry.toChannel(channelId, out); // serialized once, shared
    }
    onPresence(v) {
        const userId = String(v?.user_id ?? '');
        if (!userId) return;
        this.registry.toWatchers(userId, (0,_protocol__rspack_import_3.dispatch)(_protocol__rspack_import_3.Evt.PRESENCE_UPDATE, {
            user_id: userId,
            status: v.status,
            timestamp: v.timestamp
        }));
    }
    onVoice(v) {
        const channelId = String(v?.channel_id ?? '');
        const guildId = v?.guild_id != null ? String(v.guild_id) : this.registry.guildOf(channelId);
        if (!guildId) return;
        this.registry.toGuild(guildId, (0,_protocol__rspack_import_3.dispatch)(_protocol__rspack_import_3.Evt.VOICE_STATE_UPDATE, {
            user_id: String(v.user_id),
            channel_id: channelId,
            guild_id: guildId,
            action: v.action,
            self_mute: !!v.self_mute,
            self_deaf: !!v.self_deaf
        }));
    }
    constructor(kafka, registry){
        _define_property(this, "registry", void 0);
        this.registry = registry;
        kafka.on(_config__rspack_import_1.TOPICS.messages, (v)=>this.onMessage(v));
        kafka.on(_config__rspack_import_1.TOPICS.presence, (v)=>this.onPresence(v));
        kafka.on(_config__rspack_import_1.TOPICS.voice, (v)=>this.onVoice(v));
    }
}
EventsConsumer = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _kafka_service__rspack_import_2.KafkaService === "undefined" ? Object : _kafka_service__rspack_import_2.KafkaService,
        typeof _registry_service__rspack_import_4.RegistryService === "undefined" ? Object : _registry_service__rspack_import_4.RegistryService
    ])
], EventsConsumer);


},
"./apps/gateway/src/app/gateway.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  MyGateway: () => (MyGateway)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _nestjs_websockets__rspack_import_1 = __webpack_require__("@nestjs/websockets");
/* import */ var _nestjs_websockets__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_nestjs_websockets__rspack_import_1);
/* import */ var crypto__rspack_import_2 = __webpack_require__("crypto");
/* import */ var crypto__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(crypto__rspack_import_2);
/* import */ var ws__rspack_import_3 = __webpack_require__("ws");
/* import */ var ws__rspack_import_3_default = /*#__PURE__*/__webpack_require__.n(ws__rspack_import_3);
/* import */ var _config__rspack_import_4 = __webpack_require__("./apps/gateway/src/app/config.ts");
/* import */ var _presence_service__rspack_import_5 = __webpack_require__("./apps/gateway/src/app/presence.service.ts");
/* import */ var _protocol__rspack_import_6 = __webpack_require__("./apps/gateway/src/app/protocol.ts");
/* import */ var _registry_service__rspack_import_7 = __webpack_require__("./apps/gateway/src/app/registry.service.ts");
/* import */ var _session_loader_service__rspack_import_8 = __webpack_require__("./apps/gateway/src/app/session-loader.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}









const HELLO = (0,_protocol__rspack_import_6.frame)(_protocol__rspack_import_6.Op.HELLO, {
    heartbeat_interval: _config__rspack_import_4.HEARTBEAT_INTERVAL_MS
});
const HB_ACK = (0,_protocol__rspack_import_6.frame)(_protocol__rspack_import_6.Op.HEARTBEAT_ACK);
class MyGateway {
    afterInit() {
        this.sweeper = setInterval(()=>this.sweep(), 5_000);
        this.log.log('Gateway ready on /gateway');
    }
    onModuleDestroy() {
        clearInterval(this.sweeper);
    }
    handleConnection(ws) {
        const conn = {
            ws,
            identifying: false,
            lastHeartbeat: Date.now(),
            identifyTimer: setTimeout(()=>ws.close(_protocol__rspack_import_6.Close.IDENTIFY_TIMEOUT, 'identify timeout'), _config__rspack_import_4.IDENTIFY_TIMEOUT_MS)
        };
        this.conns.set(ws, conn);
        ws.on('error', (e)=>this.log.warn(e.message));
        ws.on('message', (raw)=>this.onMessage(conn, raw).catch((e)=>this.log.error(e)));
        ws.send(HELLO);
    }
    handleDisconnect(ws) {
        const conn = this.conns.get(ws);
        if (!conn) return;
        clearTimeout(conn.identifyTimer);
        this.conns.delete(ws);
        const s = conn.session;
        if (!s) return;
        if (this.registry.remove(s)) this.presence.set(s.userId, 'offline').catch((e)=>this.log.warn(e.message));
        this.log.log(`- ${s.userId} (${s.id})`);
    }
    /** heartbeat miss -> drop */ sweep() {
        const limit = _config__rspack_import_4.HEARTBEAT_INTERVAL_MS + _config__rspack_import_4.HEARTBEAT_GRACE_MS;
        const now = Date.now();
        for (const c of this.conns.values()){
            if (now - c.lastHeartbeat > limit) {
                this.registry.metrics.heartbeatMissed++;
                c.ws.terminate();
            }
        }
    }
    async onMessage(conn, raw) {
        let msg;
        try {
            const text = typeof raw === 'string' ? raw : Array.isArray(raw) ? Buffer.concat(raw).toString() : Buffer.from(raw).toString();
            msg = JSON.parse(text);
        } catch  {
            conn.ws.close(_protocol__rspack_import_6.Close.DECODE, 'decode error');
            return;
        }
        switch(msg?.op){
            case _protocol__rspack_import_6.Op.HEARTBEAT:
                return this.onHeartbeat(conn);
            case _protocol__rspack_import_6.Op.IDENTIFY:
                return this.identify(conn, msg.d);
        }
        const s = conn.session;
        if (!s) {
            conn.ws.close(_protocol__rspack_import_6.Close.NOT_AUTH, 'not authenticated');
            return;
        }
        switch(msg?.op){
            case _protocol__rspack_import_6.Op.PRESENCE:
                return this.onPresence(s, msg.d);
            case _protocol__rspack_import_6.Op.TYPING:
                return this.onTyping(s, msg.d);
            case _protocol__rspack_import_6.Op.ACK:
                return this.onAck(s, msg.d);
        }
    }
    onHeartbeat(conn) {
        conn.lastHeartbeat = Date.now();
        conn.ws.send(HB_ACK);
        if (conn.session) this.presence.touch(conn.session.userId).catch(()=>undefined);
    }
    async identify(conn, d) {
        if (conn.session || conn.identifying) {
            conn.ws.close(_protocol__rspack_import_6.Close.ALREADY_IDENTIFIED, 'already identified');
            return;
        }
        conn.identifying = true;
        clearTimeout(conn.identifyTimer);
        try {
            const state = await this.loader.load(String(d?.user_tag_id ?? ''));
            if (!state) {
                conn.ws.close(_protocol__rspack_import_6.Close.AUTH_FAILED, 'authentication failed');
                return;
            }
            if (conn.ws.readyState !== ws__rspack_import_3.WebSocket.OPEN) return; // closed while loading
            const session = {
                id: (0,crypto__rspack_import_2.randomUUID)(),
                ws: conn.ws,
                ...state,
                acks: new Map(),
                lastAckAt: Date.now(),
                lastTypingAt: new Map()
            };
            conn.session = session;
            this.registry.add(session);
            // reconnect: replay what this gateway still has after client's last id
            const lastId = _protocol__rspack_import_6.ID_RE.test(String(d?.last_message_id ?? '')) ? String(d.last_message_id) : null;
            const missed = lastId ? this.registry.missed(session.channels.keys(), lastId) : {
                frames: [],
                truncated: false
            };
            if (lastId) this.registry.metrics.reconnects++;
            // presence: Redis + Kafka (non-fatal)
            await this.presence.set(session.userId, 'online').catch((e)=>this.log.warn(e.message));
            const friendsOnline = await this.presence.online(session.friendIds).catch(()=>[]);
            this.registry.send(session, (0,_protocol__rspack_import_6.dispatch)(_protocol__rspack_import_6.Evt.READY, {
                session_id: session.id,
                user: {
                    id: session.userId,
                    username: session.username
                },
                guild_ids: session.guildIds,
                channel_ids: [
                    ...session.channels.keys()
                ],
                friends_online: friendsOnline,
                resync: missed.truncated
            }));
            for (const f of missed.frames)this.registry.send(session, f);
            this.log.log(`+ ${session.userId} (${session.id})`);
        } catch (e) {
            this.log.error(e);
            conn.ws.close(1011, 'internal error');
        }
    }
    onPresence(s, d) {
        const status = d?.status;
        if (![
            'online',
            'idle',
            'dnd'
        ].includes(status)) return;
        this.presence.set(s.userId, status).catch((e)=>this.log.warn(e.message));
    }
    onTyping(s, d) {
        const channelId = String(d?.channel_id ?? '');
        if (!s.channels.has(channelId)) return;
        const now = Date.now();
        if (now - (s.lastTypingAt.get(channelId) ?? 0) < _config__rspack_import_4.TYPING_COOLDOWN_MS) return;
        s.lastTypingAt.set(channelId, now);
        this.registry.toChannel(channelId, (0,_protocol__rspack_import_6.dispatch)(_protocol__rspack_import_6.Evt.TYPING_START, {
            channel_id: channelId,
            user_id: s.userId,
            timestamp: new Date(now).toISOString()
        }), s.userId);
    }
    onAck(s, d) {
        const channelId = String(d?.channel_id ?? '');
        const last = String(d?.last_message_id ?? '');
        if (!s.channels.has(channelId) || !_protocol__rspack_import_6.ID_RE.test(last)) return;
        s.acks.set(channelId, last);
        s.lastAckAt = Date.now();
    }
    constructor(registry, presence, loader){
        _define_property(this, "registry", void 0);
        _define_property(this, "presence", void 0);
        _define_property(this, "loader", void 0);
        _define_property(this, "log", void 0);
        _define_property(this, "conns", void 0);
        _define_property(this, "sweeper", void 0);
        this.registry = registry;
        this.presence = presence;
        this.loader = loader;
        this.log = new _nestjs_common__rspack_import_0.Logger(MyGateway.name);
        this.conns = new Map();
    }
}
MyGateway = _ts_decorate([
    (0,_nestjs_websockets__rspack_import_1.WebSocketGateway)({
        path: '/gateway'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registry_service__rspack_import_7.RegistryService === "undefined" ? Object : _registry_service__rspack_import_7.RegistryService,
        typeof _presence_service__rspack_import_5.PresenceService === "undefined" ? Object : _presence_service__rspack_import_5.PresenceService,
        typeof _session_loader_service__rspack_import_8.SessionLoader === "undefined" ? Object : _session_loader_service__rspack_import_8.SessionLoader
    ])
], MyGateway);


},
"./apps/gateway/src/app/info.controller.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  InfoController: () => (InfoController)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _registry_service__rspack_import_1 = __webpack_require__("./apps/gateway/src/app/registry.service.ts");
/* import */ var _session_loader_service__rspack_import_2 = __webpack_require__("./apps/gateway/src/app/session-loader.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}



class InfoController {
    /** spec: client asks API for best gateway URL (geo/load routing goes here) */ url() {
        return {
            url: process.env.GATEWAY_PUBLIC_URL ?? `ws://localhost:${process.env.GATEWAY_PORT ?? process.env.PORT ?? 3001}/gateway`
        };
    }
    async stats(request) {
        const userTagId = request.headers['x-user-tag'];
        if (!userTagId || !await this.loader.load(userTagId)) throw new _nestjs_common__rspack_import_0.UnauthorizedException();
        return this.registry.stats();
    }
    constructor(registry, loader){
        _define_property(this, "registry", void 0);
        _define_property(this, "loader", void 0);
        this.registry = registry;
        this.loader = loader;
    }
}
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('url'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], InfoController.prototype, "url", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('stats'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], InfoController.prototype, "stats", null);
InfoController = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Controller)('gateway'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registry_service__rspack_import_1.RegistryService === "undefined" ? Object : _registry_service__rspack_import_1.RegistryService,
        typeof _session_loader_service__rspack_import_2.SessionLoader === "undefined" ? Object : _session_loader_service__rspack_import_2.SessionLoader
    ])
], InfoController);


},
"./apps/gateway/src/app/kafka.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KafkaService: () => (KafkaService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var crypto__rspack_import_1 = __webpack_require__("crypto");
/* import */ var crypto__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(crypto__rspack_import_1);
/* import */ var kafkajs__rspack_import_2 = __webpack_require__("kafkajs");
/* import */ var kafkajs__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(kafkajs__rspack_import_2);
/* import */ var _config__rspack_import_3 = __webpack_require__("./apps/gateway/src/app/config.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}




class KafkaService {
    on(topic, fn) {
        this.handlers.set(topic, fn);
    }
    async publish(topic, key, value) {
        await this.producer.send({
            topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(value)
                }
            ]
        });
    }
    async onModuleInit() {
        const topics = Object.values(_config__rspack_import_3.TOPICS);
        const admin = this.kafka.admin();
        await admin.connect();
        const existing = await admin.listTopics();
        const missing = topics.filter((t)=>!existing.includes(t));
        if (missing.length) await admin.createTopics({
            waitForLeaders: true,
            topics: missing.map((topic)=>({
                    topic,
                    numPartitions: 3
                }))
        });
        await admin.disconnect();
        await this.producer.connect();
        await this.consumer.connect();
        await this.consumer.subscribe({
            topics,
            fromBeginning: false
        });
        await this.consumer.run({
            eachMessage: async ({ topic, message })=>{
                if (!message.value) return;
                try {
                    this.handlers.get(topic)?.(JSON.parse(message.value.toString()));
                } catch (e) {
                    this.log.error(`${topic}: ${e.message}`);
                }
            }
        });
        this.log.log(`consuming ${topics.join(', ')}`);
    }
    async onModuleDestroy() {
        await this.consumer.disconnect().catch(()=>undefined);
        await this.producer.disconnect().catch(()=>undefined);
    }
    constructor(){
        _define_property(this, "log", new _nestjs_common__rspack_import_0.Logger(KafkaService.name));
        _define_property(this, "kafka", new kafkajs__rspack_import_2.Kafka({
            clientId: 'gateway',
            brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
            logLevel: kafkajs__rspack_import_2.logLevel.WARN
        }));
        _define_property(this, "producer", this.kafka.producer({
            createPartitioner: kafkajs__rspack_import_2.Partitioners.DefaultPartitioner
        }));
        // unique group per instance: every gateway must see every event
        _define_property(this, "consumer", this.kafka.consumer({
            groupId: `gateway-${(0,crypto__rspack_import_1.randomUUID)()}`
        }));
        _define_property(this, "handlers", new Map());
    }
}
KafkaService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)()
], KafkaService);


},
"./apps/gateway/src/app/presence.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  PresenceService: () => (PresenceService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _config__rspack_import_1 = __webpack_require__("./apps/gateway/src/app/config.ts");
/* import */ var _kafka_service__rspack_import_2 = __webpack_require__("./apps/gateway/src/app/kafka.service.ts");
/* import */ var _redis_service__rspack_import_3 = __webpack_require__("./apps/gateway/src/app/redis.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}




const key = (id)=>`user:${id}:presence`;
class PresenceService {
    /** 1) store in Redis (TTL) 2) publish to Kafka. Gateways fan out on consume. */ async set(userId, status) {
        const value = {
            user_id: userId,
            status,
            timestamp: new Date().toISOString()
        };
        if (status === 'offline') await this.redis.del(key(userId));
        else await this.redis.set(key(userId), JSON.stringify(value), 'EX', _config__rspack_import_1.PRESENCE_TTL_S);
        await this.kafka.publish(_config__rspack_import_1.TOPICS.presence, `user:${userId}`, value);
    }
    /** heartbeat refreshes TTL */ async touch(userId) {
        await this.redis.expire(key(userId), _config__rspack_import_1.PRESENCE_TTL_S);
    }
    async online(userIds) {
        if (!userIds.length) return [];
        const vals = await this.redis.mget(userIds.map(key));
        return vals.flatMap((v, i)=>v ? [
                {
                    user_id: userIds[i],
                    status: JSON.parse(v).status
                }
            ] : []);
    }
    constructor(redis, kafka){
        _define_property(this, "redis", void 0);
        _define_property(this, "kafka", void 0);
        this.redis = redis;
        this.kafka = kafka;
    }
}
PresenceService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _redis_service__rspack_import_3.RedisService === "undefined" ? Object : _redis_service__rspack_import_3.RedisService,
        typeof _kafka_service__rspack_import_2.KafkaService === "undefined" ? Object : _kafka_service__rspack_import_2.KafkaService
    ])
], PresenceService);


},
"./apps/gateway/src/app/prisma.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  PrismaService: () => (PrismaService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _prisma_adapter_pg__rspack_import_1 = __webpack_require__("@prisma/adapter-pg");
/* import */ var _prisma_adapter_pg__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_prisma_adapter_pg__rspack_import_1);
/* import */ var _generated_prisma_client__rspack_import_2 = __webpack_require__("./generated/prisma/client.ts");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}


// apps/gateway/src/app -> repo root = 4 levels up

class PrismaService extends _generated_prisma_client__rspack_import_2.PrismaClient {
    onModuleInit() {
        return this.$connect();
    }
    onModuleDestroy() {
        return this.$disconnect();
    }
    constructor(){
        super({
            adapter: new _prisma_adapter_pg__rspack_import_1.PrismaPg({
                connectionString: process.env.DATABASE_URL
            })
        });
    }
}
PrismaService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], PrismaService);


},
"./apps/gateway/src/app/protocol.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Close: () => (Close),
  Evt: () => (Evt),
  ID_RE: () => (ID_RE),
  Op: () => (Op),
  dispatch: () => (dispatch),
  frame: () => (frame)
});
var Op = /*#__PURE__*/ function(Op) {
    Op[Op["DISPATCH"] = 0] = "DISPATCH";
    Op[Op["HEARTBEAT"] = 1] = "HEARTBEAT";
    Op[Op["IDENTIFY"] = 2] = "IDENTIFY";
    Op[Op["PRESENCE"] = 3] = "PRESENCE";
    Op[Op["TYPING"] = 8] = "TYPING";
    Op[Op["HELLO"] = 10] = "HELLO";
    Op[Op["ACK"] = 11] = "ACK";
    Op[Op["HEARTBEAT_ACK"] = 12] = "HEARTBEAT_ACK";
    return Op;
}({});
var Close = /*#__PURE__*/ function(Close) {
    Close[Close["NOT_AUTH"] = 4001] = "NOT_AUTH";
    Close[Close["DECODE"] = 4002] = "DECODE";
    Close[Close["ALREADY_IDENTIFIED"] = 4003] = "ALREADY_IDENTIFIED";
    Close[Close["AUTH_FAILED"] = 4004] = "AUTH_FAILED";
    Close[Close["SLOW_CONSUMER"] = 4008] = "SLOW_CONSUMER";
    Close[Close["HEARTBEAT_TIMEOUT"] = 4009] = "HEARTBEAT_TIMEOUT";
    Close[Close["IDENTIFY_TIMEOUT"] = 4010] = "IDENTIFY_TIMEOUT";
    return Close;
}({});
const Evt = {
    READY: 'READY',
    MESSAGE_CREATE: 'MESSAGE_CREATE',
    MESSAGE_UPDATE: 'MESSAGE_UPDATE',
    MESSAGE_DELETE: 'MESSAGE_DELETE',
    PRESENCE_UPDATE: 'PRESENCE_UPDATE',
    TYPING_START: 'TYPING_START',
    VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE'
};
const ID_RE = /^\d{1,19}$/;
/** Serialize once, share the string across all recipients. */ const frame = (op, d, t)=>JSON.stringify({
        op,
        t,
        d
    });
const dispatch = (t, d)=>frame(0, d, t);


},
"./apps/gateway/src/app/redis.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  RedisService: () => (RedisService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var ioredis__rspack_import_1 = __webpack_require__("ioredis");
/* import */ var ioredis__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(ioredis__rspack_import_1);
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}


class RedisService extends ioredis__rspack_import_1.Redis {
    onModuleDestroy() {
        this.disconnect();
    }
    constructor(){
        super(process.env.REDIS_URL ?? 'redis://localhost:6379', {
            maxRetriesPerRequest: 3
        });
    }
}
RedisService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], RedisService);


},
"./apps/gateway/src/app/registry.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  RegistryService: () => (RegistryService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var ws__rspack_import_1 = __webpack_require__("ws");
/* import */ var ws__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(ws__rspack_import_1);
/* import */ var _config__rspack_import_2 = __webpack_require__("./apps/gateway/src/app/config.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}



const put = (m, k, v)=>{
    let s = m.get(k);
    if (!s) m.set(k, s = new Set());
    s.add(v);
};
const drop = (m, k, v)=>{
    const s = m.get(k);
    if (!s) return;
    s.delete(v);
    if (!s.size) m.delete(k);
};
class RegistryService {
    add(s) {
        let m = this.sessions.get(s.userId);
        if (!m) this.sessions.set(s.userId, m = new Map());
        m.set(s.id, s);
        for (const [c, g] of s.channels){
            put(this.channelUsers, c, s.userId);
            this.channelGuild.set(c, g);
        }
        for (const g of s.guildIds)put(this.guildUsers, g, s.userId);
        for (const f of s.friendIds)put(this.watchers, f, s.userId);
    }
    /** @returns true if this was the user's last local session */ remove(s) {
        const m = this.sessions.get(s.userId);
        if (!m) return false;
        m.delete(s.id);
        if (m.size) return false;
        this.sessions.delete(s.userId);
        for (const c of s.channels.keys()){
            drop(this.channelUsers, c, s.userId);
            if (!this.channelUsers.has(c)) {
                this.channelGuild.delete(c);
                this.replay.delete(c);
            }
        }
        for (const g of s.guildIds)drop(this.guildUsers, g, s.userId);
        for (const f of s.friendIds)drop(this.watchers, f, s.userId);
        return true;
    }
    send(s, frame) {
        const ws = s.ws;
        if (ws.readyState !== ws__rspack_import_1.WebSocket.OPEN) return;
        if (ws.bufferedAmount > _config__rspack_import_2.MAX_BUFFERED_BYTES) {
            this.metrics.slowConsumers++;
            ws.terminate(); // drop slow consumer, protect others
            return;
        }
        this.metrics.sent++;
        ws.send(frame);
    }
    toUsers(ids, frame, except) {
        for (const uid of ids){
            if (uid === except) continue;
            const m = this.sessions.get(uid);
            if (m) for (const s of m.values())this.send(s, frame);
        }
    }
    toChannel(channelId, frame, except) {
        this.toUsers(this.channelUsers.get(channelId) ?? [], frame, except);
    }
    toGuild(guildId, frame) {
        this.toUsers(this.guildUsers.get(guildId) ?? [], frame);
    }
    toWatchers(userId, frame) {
        this.toUsers(this.watchers.get(userId) ?? [], frame);
    }
    guildOf(channelId) {
        return this.channelGuild.get(channelId);
    }
    remember(channelId, messageId, frame) {
        if (!this.channelUsers.has(channelId)) return; // no local interest
        let buf = this.replay.get(channelId);
        if (!buf) this.replay.set(channelId, buf = []);
        buf.push({
            id: BigInt(messageId),
            frame
        });
        if (buf.length > _config__rspack_import_2.REPLAY_BUFFER_PER_CHANNEL) buf.shift();
    }
    missed(channelIds, lastId) {
        const last = BigInt(lastId);
        const out = [];
        let truncated = false;
        for (const c of channelIds){
            const buf = this.replay.get(c);
            if (!buf) continue;
            if (buf.length >= _config__rspack_import_2.REPLAY_BUFFER_PER_CHANNEL && buf[0].id > last) truncated = true;
            for (const e of buf)if (e.id > last) out.push(e);
        }
        out.sort((a, b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
        return {
            frames: out.map((e)=>e.frame),
            truncated
        };
    }
    stats() {
        let connections = 0;
        for (const m of this.sessions.values())connections += m.size;
        return {
            users: this.sessions.size,
            connections,
            channelsIndexed: this.channelUsers.size,
            ...this.metrics
        };
    }
    constructor(){
        /** user_id -> session_id -> session */ _define_property(this, "sessions", new Map());
        /** channel_id -> Set<user_id> */ _define_property(this, "channelUsers", new Map());
        _define_property(this, "guildUsers", new Map());
        /** friend_id -> Set<local user_id watching them> */ _define_property(this, "watchers", new Map());
        _define_property(this, "channelGuild", new Map());
        _define_property(this, "replay", new Map());
        _define_property(this, "metrics", {
            slowConsumers: 0,
            heartbeatMissed: 0,
            reconnects: 0,
            sent: 0
        });
    }
}
RegistryService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)()
], RegistryService);


},
"./apps/gateway/src/app/session-loader.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SessionLoader: () => (SessionLoader)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _prisma_service__rspack_import_1 = __webpack_require__("./apps/gateway/src/app/prisma.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}


class SessionLoader {
    async load(token) {
        const user = await this.prisma.user.findUnique({
            where: {
                userTagId: token
            },
            select: {
                userId: true,
                username: true
            }
        });
        if (!user) return null;
        const userId = user.userId;
        const [members, friends, directChannels] = await Promise.all([
            this.prisma.member.findMany({
                where: {
                    userId
                },
                select: {
                    guildId: true,
                    guild: {
                        select: {
                            channels: {
                                where: {
                                    type: {
                                        not: 'CATEGORY'
                                    }
                                },
                                select: {
                                    channelId: true
                                }
                            }
                        }
                    }
                }
            }),
            this.prisma.friendship.findMany({
                where: {
                    userId
                },
                select: {
                    friendId: true
                }
            }),
            this.prisma.directChannelMember.findMany({
                where: {
                    userId
                },
                select: {
                    channelId: true
                }
            })
        ]);
        const channels = new Map();
        for (const m of members)for (const c of m.guild.channels)channels.set(c.channelId.toString(), m.guildId.toString());
        for (const c of directChannels)channels.set(c.channelId.toString(), '');
        return {
            userId: userId.toString(),
            username: user.username,
            guildIds: members.map((m)=>m.guildId.toString()),
            channels,
            friendIds: friends.map((f)=>f.friendId.toString())
        };
    }
    constructor(prisma){
        _define_property(this, "prisma", void 0);
        this.prisma = prisma;
    }
}
SessionLoader = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prisma_service__rspack_import_1.PrismaService === "undefined" ? Object : _prisma_service__rspack_import_1.PrismaService
    ])
], SessionLoader);


},
"./apps/gateway/src/gateway.controller.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  GatewayController: () => (GatewayController)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _gateway_service__rspack_import_1 = __webpack_require__("./apps/gateway/src/gateway.service.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}


class GatewayController {
    getHello() {
        return this.gatewayService.getHello();
    }
    constructor(gatewayService){
        _define_property(this, "gatewayService", void 0);
        this.gatewayService = gatewayService;
    }
}
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], GatewayController.prototype, "getHello", null);
GatewayController = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _gateway_service__rspack_import_1.GatewayService === "undefined" ? Object : _gateway_service__rspack_import_1.GatewayService
    ])
], GatewayController);


},
"./apps/gateway/src/gateway.module.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  GatewayModule: () => (GatewayModule)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _gateway_controller__rspack_import_1 = __webpack_require__("./apps/gateway/src/gateway.controller.ts");
/* import */ var _gateway_service__rspack_import_2 = __webpack_require__("./apps/gateway/src/gateway.service.ts");
/* import */ var _app_gateway__rspack_import_3 = __webpack_require__("./apps/gateway/src/app/gateway.ts");
/* import */ var _app_events_consumer__rspack_import_4 = __webpack_require__("./apps/gateway/src/app/events.consumer.ts");
/* import */ var _app_info_controller__rspack_import_5 = __webpack_require__("./apps/gateway/src/app/info.controller.ts");
/* import */ var _app_kafka_service__rspack_import_6 = __webpack_require__("./apps/gateway/src/app/kafka.service.ts");
/* import */ var _app_presence_service__rspack_import_7 = __webpack_require__("./apps/gateway/src/app/presence.service.ts");
/* import */ var _app_prisma_service__rspack_import_8 = __webpack_require__("./apps/gateway/src/app/prisma.service.ts");
/* import */ var _app_redis_service__rspack_import_9 = __webpack_require__("./apps/gateway/src/app/redis.service.ts");
/* import */ var _app_registry_service__rspack_import_10 = __webpack_require__("./apps/gateway/src/app/registry.service.ts");
/* import */ var _app_session_loader_service__rspack_import_11 = __webpack_require__("./apps/gateway/src/app/session-loader.service.ts");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}












class GatewayModule {
}
GatewayModule = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Module)({
        imports: [],
        controllers: [
            _gateway_controller__rspack_import_1.GatewayController,
            _app_info_controller__rspack_import_5.InfoController
        ],
        providers: [
            _gateway_service__rspack_import_2.GatewayService,
            _app_gateway__rspack_import_3.MyGateway,
            _app_prisma_service__rspack_import_8.PrismaService,
            _app_redis_service__rspack_import_9.RedisService,
            _app_kafka_service__rspack_import_6.KafkaService,
            _app_registry_service__rspack_import_10.RegistryService,
            _app_presence_service__rspack_import_7.PresenceService,
            _app_session_loader_service__rspack_import_11.SessionLoader,
            _app_events_consumer__rspack_import_4.EventsConsumer
        ]
    })
], GatewayModule);


},
"./apps/gateway/src/gateway.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  GatewayService: () => (GatewayService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

class GatewayService {
    getHello() {
        return 'Hello World!';
    }
}
GatewayService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)()
], GatewayService);


},
"./generated/prisma/client.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  $Enums: () => (/* reexport module object */ _enums__rspack_import_2),
  ChannelType: () => (/* reexport safe */ _enums__rspack_import_2.ChannelType),
  Prisma: () => (/* reexport module object */ _internal_prismaNamespace__rspack_import_1),
  PrismaClient: () => (PrismaClient)
});
/* import */ var _internal_class__rspack_import_0 = __webpack_require__("./generated/prisma/internal/class.ts");
/* import */ var _internal_prismaNamespace__rspack_import_1 = __webpack_require__("./generated/prisma/internal/prismaNamespace.ts");
/* import */ var _enums__rspack_import_2 = __webpack_require__("./generated/prisma/enums.ts");
/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file should be your main import to use Prisma. Through it you get access to all the models, enums, and input types.
 * If you're looking for something you can import in the client-side of your application, please refer to the `browser.ts` file instead.
 *
 * 🟢 You can import this file directly.
 */ 



/**
 * ## Prisma Client
 * 
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 * 
 * Read more in our [docs](https://pris.ly/d/client).
 */ const PrismaClient = _internal_class__rspack_import_0.getPrismaClientClass();



},
"./generated/prisma/enums.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ChannelType: () => (ChannelType)
});
/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
* This file exports all enum related types from the schema.
*
* 🟢 You can import this file directly.
*/ const ChannelType = {
    TEXT: 'TEXT',
    VOICE: 'VOICE',
    CATEGORY: 'CATEGORY'
};


},
"./generated/prisma/internal/class.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getPrismaClientClass: () => (getPrismaClientClass)
});
/* import */ var _prisma_client_runtime_client__rspack_import_0 = __webpack_require__("@prisma/client/runtime/client");
/* import */ var _prisma_client_runtime_client__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_prisma_client_runtime_client__rspack_import_0);
/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * Please import the `PrismaClient` class from the `client.ts` file instead.
 */ 
const config = {
    "previewFeatures": [],
    "clientVersion": "7.10.0",
    "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider            = \"prisma-client\"\n  output              = \"../generated/prisma\"\n  moduleFormat        = \"cjs\"\n  importFileExtension = \"\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  // Prisma 7: url lives in prisma config, not here\n}\n\nenum ChannelType {\n  TEXT\n  VOICE\n  CATEGORY\n}\n\n// Minimal stub. Real user table belongs to the larger project.\nmodel User {\n  userId          BigInt                @id @default(autoincrement()) @map(\"user_id\")\n  userTagId       String?               @unique @map(\"user_tag_id\")\n  username        String                @unique\n  avatarUrl       String?               @map(\"avatar_url\")\n  roleTitle       String?               @map(\"role_title\")\n  currentActivity String?               @map(\"current_activity\")\n  lastPresence    String?               @map(\"last_presence\") // online | idle | dnd | offline\n  guilds          Guild[]               @relation(\"GuildOwner\")\n  members         Member[]\n  messages        Message[]\n  friendships     Friendship[]          @relation(\"FriendshipUser\")\n  friendOf        Friendship[]          @relation(\"FriendshipFriend\")\n  dmChannels      DirectChannelMember[]\n  invitesCreated  Invite[]\n\n  @@map(\"user\")\n}\n\nmodel Guild {\n  guildId     BigInt    @id @default(autoincrement()) @map(\"guild_id\")\n  name        String\n  iconUrl     String?   @map(\"icon_url\")\n  ownerId     BigInt    @map(\"owner_id\")\n  memberCount Int       @default(0) @map(\"member_count\")\n  owner       User      @relation(\"GuildOwner\", fields: [ownerId], references: [userId])\n  channels    Channel[]\n  members     Member[]\n  roles       Role[]\n  invites     Invite[]\n\n  @@index([ownerId])\n  @@map(\"guild\")\n}\n\nmodel Channel {\n  // Shared BIGSERIAL sequence with DirectChannel: both tables hand out ids\n  // from the same generator so Message.channel_id can reference either one.\n  channelId  BigInt      @id @default(autoincrement()) @map(\"channel_id\")\n  guildId    BigInt      @map(\"guild_id\")\n  name       String\n  topic      String?\n  icon       String?\n  capacity   Int         @default(100)\n  type       ChannelType @default(TEXT)\n  categoryId BigInt?     @map(\"category_id\")\n  position   Int         @default(0)\n  guild      Guild       @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  category   Channel?    @relation(\"Category\", fields: [categoryId], references: [channelId], onDelete: SetNull)\n  children   Channel[]   @relation(\"Category\")\n  messages   Message[]   @relation(\"ChannelMessages\")\n\n  @@index([guildId, position])\n  @@map(\"channel\")\n}\n\nmodel Member {\n  guildId        BigInt   @map(\"guild_id\")\n  userId         BigInt   @map(\"user_id\")\n  nickname       String?\n  roleIds        Json     @default(\"[]\") @map(\"role_ids\")\n  joinedAt       DateTime @default(now()) @map(\"joined_at\")\n  voiceChannelId BigInt?  @map(\"voice_channel_id\")\n  guild          Guild    @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  user           User     @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@id([guildId, userId])\n  @@index([userId])\n  @@map(\"member\")\n}\n\nmodel Role {\n  roleId      BigInt @id @default(autoincrement()) @map(\"role_id\")\n  guildId     BigInt @map(\"guild_id\")\n  name        String\n  permissions BigInt @default(0)\n  position    Int    @default(0)\n  guild       Guild  @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n\n  @@index([guildId])\n  @@map(\"role\")\n}\n\nmodel Message {\n  messageId   BigInt    @id @default(autoincrement()) @map(\"message_id\")\n  channelId   BigInt?   @map(\"channel_id\")\n  dmChannelId BigInt?   @map(\"dm_channel_id\")\n  authorId    BigInt    @map(\"author_id\")\n  content     String\n  embeds      Json?\n  attachments Json?\n  createdAt   DateTime  @default(now()) @map(\"created_at\")\n  editedAt    DateTime? @map(\"edited_at\")\n\n  channel   Channel?       @relation(\"ChannelMessages\", fields: [channelId], references: [channelId], onDelete: Cascade, map: \"message_channel_id_fkey\")\n  dmChannel DirectChannel? @relation(\"DmChannelMessages\", fields: [dmChannelId], references: [channelId], onDelete: Cascade, map: \"message_dm_channel_id_fkey\")\n  author    User           @relation(fields: [authorId], references: [userId])\n\n  @@index([channelId, messageId])\n  @@index([dmChannelId, messageId])\n  @@map(\"message\")\n}\n\nmodel Friendship {\n  userId    BigInt   @map(\"user_id\")\n  friendId  BigInt   @map(\"friend_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  user      User     @relation(\"FriendshipUser\", fields: [userId], references: [userId], onDelete: Cascade)\n  friend    User     @relation(\"FriendshipFriend\", fields: [friendId], references: [userId], onDelete: Cascade)\n\n  @@id([userId, friendId])\n  @@index([friendId])\n  @@map(\"friendship\")\n}\n\nmodel Invite {\n  inviteId    BigInt    @id @default(autoincrement()) @map(\"invite_id\")\n  guildId     BigInt    @map(\"guild_id\")\n  code        String    @unique\n  createdById BigInt    @map(\"created_by_id\")\n  createdAt   DateTime  @default(now()) @map(\"created_at\")\n  expiresAt   DateTime? @map(\"expires_at\")\n  guild       Guild     @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  createdBy   User      @relation(fields: [createdById], references: [userId])\n\n  @@index([guildId])\n  @@map(\"invite\")\n}\n\n// DM channels are just channels with no guild; membership is explicit.\n// Shares the \"channel_channel_id_seq\" sequence with Channel (see above).\nmodel DirectChannel {\n  channelId BigInt                @id @default(autoincrement()) @map(\"channel_id\")\n  userA     BigInt                @map(\"user_a\")\n  userB     BigInt                @map(\"user_b\")\n  createdAt DateTime              @default(now()) @map(\"created_at\")\n  members   DirectChannelMember[]\n  messages  Message[]             @relation(\"DmChannelMessages\")\n\n  @@unique([userA, userB])\n  @@map(\"direct_channel\")\n}\n\nmodel DirectChannelMember {\n  channelId         BigInt        @map(\"channel_id\")\n  userId            BigInt        @map(\"user_id\")\n  lastReadMessageId BigInt?       @map(\"last_read_message_id\")\n  channel           DirectChannel @relation(fields: [channelId], references: [channelId], onDelete: Cascade)\n  user              User          @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@id([channelId, userId])\n  @@index([userId])\n  @@index([channelId])\n  @@map(\"direct_channel_member\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"userTagId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_tag_id\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avatarUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"avatar_url\"},{\"name\":\"roleTitle\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"role_title\"},{\"name\":\"currentActivity\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"current_activity\"},{\"name\":\"lastPresence\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"last_presence\"},{\"name\":\"guilds\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildOwner\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToUser\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"MessageToUser\"},{\"name\":\"friendships\",\"kind\":\"object\",\"type\":\"Friendship\",\"relationName\":\"FriendshipUser\"},{\"name\":\"friendOf\",\"kind\":\"object\",\"type\":\"Friendship\",\"relationName\":\"FriendshipFriend\"},{\"name\":\"dmChannels\",\"kind\":\"object\",\"type\":\"DirectChannelMember\",\"relationName\":\"DirectChannelMemberToUser\"},{\"name\":\"invitesCreated\",\"kind\":\"object\",\"type\":\"Invite\",\"relationName\":\"InviteToUser\"}],\"dbName\":\"user\",\"schema\":null},\"Guild\":{\"fields\":[{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"iconUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"icon_url\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"owner_id\"},{\"name\":\"memberCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"member_count\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GuildOwner\"},{\"name\":\"channels\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"ChannelToGuild\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"GuildToMember\"},{\"name\":\"roles\",\"kind\":\"object\",\"type\":\"Role\",\"relationName\":\"GuildToRole\"},{\"name\":\"invites\",\"kind\":\"object\",\"type\":\"Invite\",\"relationName\":\"GuildToInvite\"}],\"dbName\":\"guild\",\"schema\":null},\"Channel\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"topic\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"capacity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"ChannelType\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"category_id\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"ChannelToGuild\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"Category\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"Category\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"ChannelMessages\"}],\"dbName\":\"channel\",\"schema\":null},\"Member\":{\"fields\":[{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"nickname\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roleIds\",\"kind\":\"scalar\",\"type\":\"Json\",\"dbName\":\"role_ids\"},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"joined_at\"},{\"name\":\"voiceChannelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"voice_channel_id\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MemberToUser\"}],\"dbName\":\"member\",\"schema\":null},\"Role\":{\"fields\":[{\"name\":\"roleId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"role_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToRole\"}],\"dbName\":\"role\",\"schema\":null},\"Message\":{\"fields\":[{\"name\":\"messageId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"message_id\"},{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"dmChannelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"dm_channel_id\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"author_id\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"embeds\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"attachments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"editedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"edited_at\"},{\"name\":\"channel\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"ChannelMessages\"},{\"name\":\"dmChannel\",\"kind\":\"object\",\"type\":\"DirectChannel\",\"relationName\":\"DmChannelMessages\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MessageToUser\"}],\"dbName\":\"message\",\"schema\":null},\"Friendship\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"friendId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"friend_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FriendshipUser\"},{\"name\":\"friend\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FriendshipFriend\"}],\"dbName\":\"friendship\",\"schema\":null},\"Invite\":{\"fields\":[{\"name\":\"inviteId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"invite_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"created_by_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"expires_at\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToInvite\"},{\"name\":\"createdBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"InviteToUser\"}],\"dbName\":\"invite\",\"schema\":null},\"DirectChannel\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"userA\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_a\"},{\"name\":\"userB\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_b\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"DirectChannelMember\",\"relationName\":\"DirectChannelToDirectChannelMember\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"DmChannelMessages\"}],\"dbName\":\"direct_channel\",\"schema\":null},\"DirectChannelMember\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"lastReadMessageId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"last_read_message_id\"},{\"name\":\"channel\",\"kind\":\"object\",\"type\":\"DirectChannel\",\"relationName\":\"DirectChannelToDirectChannelMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DirectChannelMemberToUser\"}],\"dbName\":\"direct_channel_member\",\"schema\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"owner\",\"guild\",\"category\",\"children\",\"channel\",\"user\",\"members\",\"messages\",\"_count\",\"dmChannel\",\"author\",\"channels\",\"roles\",\"createdBy\",\"invites\",\"guilds\",\"friend\",\"friendships\",\"friendOf\",\"dmChannels\",\"invitesCreated\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Guild.findUnique\",\"Guild.findUniqueOrThrow\",\"Guild.findFirst\",\"Guild.findFirstOrThrow\",\"Guild.findMany\",\"Guild.createOne\",\"Guild.createMany\",\"Guild.createManyAndReturn\",\"Guild.updateOne\",\"Guild.updateMany\",\"Guild.updateManyAndReturn\",\"Guild.upsertOne\",\"Guild.deleteOne\",\"Guild.deleteMany\",\"Guild.groupBy\",\"Guild.aggregate\",\"Channel.findUnique\",\"Channel.findUniqueOrThrow\",\"Channel.findFirst\",\"Channel.findFirstOrThrow\",\"Channel.findMany\",\"Channel.createOne\",\"Channel.createMany\",\"Channel.createManyAndReturn\",\"Channel.updateOne\",\"Channel.updateMany\",\"Channel.updateManyAndReturn\",\"Channel.upsertOne\",\"Channel.deleteOne\",\"Channel.deleteMany\",\"Channel.groupBy\",\"Channel.aggregate\",\"Member.findUnique\",\"Member.findUniqueOrThrow\",\"Member.findFirst\",\"Member.findFirstOrThrow\",\"Member.findMany\",\"Member.createOne\",\"Member.createMany\",\"Member.createManyAndReturn\",\"Member.updateOne\",\"Member.updateMany\",\"Member.updateManyAndReturn\",\"Member.upsertOne\",\"Member.deleteOne\",\"Member.deleteMany\",\"Member.groupBy\",\"Member.aggregate\",\"Role.findUnique\",\"Role.findUniqueOrThrow\",\"Role.findFirst\",\"Role.findFirstOrThrow\",\"Role.findMany\",\"Role.createOne\",\"Role.createMany\",\"Role.createManyAndReturn\",\"Role.updateOne\",\"Role.updateMany\",\"Role.updateManyAndReturn\",\"Role.upsertOne\",\"Role.deleteOne\",\"Role.deleteMany\",\"Role.groupBy\",\"Role.aggregate\",\"Message.findUnique\",\"Message.findUniqueOrThrow\",\"Message.findFirst\",\"Message.findFirstOrThrow\",\"Message.findMany\",\"Message.createOne\",\"Message.createMany\",\"Message.createManyAndReturn\",\"Message.updateOne\",\"Message.updateMany\",\"Message.updateManyAndReturn\",\"Message.upsertOne\",\"Message.deleteOne\",\"Message.deleteMany\",\"Message.groupBy\",\"Message.aggregate\",\"Friendship.findUnique\",\"Friendship.findUniqueOrThrow\",\"Friendship.findFirst\",\"Friendship.findFirstOrThrow\",\"Friendship.findMany\",\"Friendship.createOne\",\"Friendship.createMany\",\"Friendship.createManyAndReturn\",\"Friendship.updateOne\",\"Friendship.updateMany\",\"Friendship.updateManyAndReturn\",\"Friendship.upsertOne\",\"Friendship.deleteOne\",\"Friendship.deleteMany\",\"Friendship.groupBy\",\"Friendship.aggregate\",\"Invite.findUnique\",\"Invite.findUniqueOrThrow\",\"Invite.findFirst\",\"Invite.findFirstOrThrow\",\"Invite.findMany\",\"Invite.createOne\",\"Invite.createMany\",\"Invite.createManyAndReturn\",\"Invite.updateOne\",\"Invite.updateMany\",\"Invite.updateManyAndReturn\",\"Invite.upsertOne\",\"Invite.deleteOne\",\"Invite.deleteMany\",\"Invite.groupBy\",\"Invite.aggregate\",\"DirectChannel.findUnique\",\"DirectChannel.findUniqueOrThrow\",\"DirectChannel.findFirst\",\"DirectChannel.findFirstOrThrow\",\"DirectChannel.findMany\",\"DirectChannel.createOne\",\"DirectChannel.createMany\",\"DirectChannel.createManyAndReturn\",\"DirectChannel.updateOne\",\"DirectChannel.updateMany\",\"DirectChannel.updateManyAndReturn\",\"DirectChannel.upsertOne\",\"DirectChannel.deleteOne\",\"DirectChannel.deleteMany\",\"DirectChannel.groupBy\",\"DirectChannel.aggregate\",\"DirectChannelMember.findUnique\",\"DirectChannelMember.findUniqueOrThrow\",\"DirectChannelMember.findFirst\",\"DirectChannelMember.findFirstOrThrow\",\"DirectChannelMember.findMany\",\"DirectChannelMember.createOne\",\"DirectChannelMember.createMany\",\"DirectChannelMember.createManyAndReturn\",\"DirectChannelMember.updateOne\",\"DirectChannelMember.updateMany\",\"DirectChannelMember.updateManyAndReturn\",\"DirectChannelMember.upsertOne\",\"DirectChannelMember.deleteOne\",\"DirectChannelMember.deleteMany\",\"DirectChannelMember.groupBy\",\"DirectChannelMember.aggregate\",\"AND\",\"OR\",\"NOT\",\"channelId\",\"userId\",\"lastReadMessageId\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"userA\",\"userB\",\"createdAt\",\"userA_userB\",\"every\",\"some\",\"none\",\"inviteId\",\"guildId\",\"code\",\"createdById\",\"expiresAt\",\"contains\",\"startsWith\",\"endsWith\",\"friendId\",\"messageId\",\"dmChannelId\",\"authorId\",\"content\",\"embeds\",\"attachments\",\"editedAt\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"roleId\",\"name\",\"permissions\",\"position\",\"nickname\",\"roleIds\",\"joinedAt\",\"voiceChannelId\",\"topic\",\"icon\",\"capacity\",\"ChannelType\",\"type\",\"categoryId\",\"iconUrl\",\"ownerId\",\"memberCount\",\"userTagId\",\"username\",\"avatarUrl\",\"roleTitle\",\"currentActivity\",\"lastPresence\",\"userId_friendId\",\"guildId_userId\",\"channelId_userId\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "6wVpoAERCQAA1QIAIAoAALYCACASAADUAgAgFAAA1gIAIBUAANYCACAWAAC1AgAgFwAA1wIAIMABAADRAgAwwQEAAD4AEMIBAADRAgAwxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBANICACH_AQEA0gIAIYACAQDSAgAhgQIBANICACEBAAAAAQAgDQMAANoCACAJAADVAgAgDgAA7QIAIA8AAO8CACARAADXAgAgwAEAAO4CADDBAQAAAwAQwgEAAO4CADDWAQQAswIAIewBAQDTAgAh-QEBANICACH6AQQAswIAIfsBAgDfAgAhBgMAAIwFACAJAACJBQAgDgAAkAUAIA8AAJEFACARAACLBQAg-QEAAPACACANAwAA2gIAIAkAANUCACAOAADtAgAgDwAA7wIAIBEAANcCACDAAQAA7gIAMMEBAAADABDCAQAA7gIAMNYBBAAAAAHsAQEA0wIAIfkBAQDSAgAh-gEEALMCACH7AQIA3wIAIQMAAAADACABAAAEADACAAAFACAQBAAA3QIAIAUAAOkCACAGAADtAgAgCgAAtgIAIMABAADrAgAwwQEAAAcAEMIBAADrAgAwwwEEALMCACHWAQQAswIAIewBAQDTAgAh7gECAN8CACHzAQEA0gIAIfQBAQDSAgAh9QECAN8CACH3AQAA7AL3ASL4AQQA4wIAIQcEAACNBQAgBQAAjwUAIAYAAJAFACAKAAClAwAg8wEAAPACACD0AQAA8AIAIPgBAADwAgAgEAQAAN0CACAFAADpAgAgBgAA7QIAIAoAALYCACDAAQAA6wIAMMEBAAAHABDCAQAA6wIAMMMBBAAAAAHWAQQAswIAIewBAQDTAgAh7gECAN8CACHzAQEA0gIAIfQBAQDSAgAh9QECAN8CACH3AQAA7AL3ASL4AQQA4wIAIQMAAAAHACABAAAIADACAAAJACABAAAABwAgAwAAAAcAIAEAAAgAMAIAAAkAIA8HAADpAgAgDAAA6gIAIA0AANoCACDAAQAA5wIAMMEBAAANABDCAQAA5wIAMMMBBADjAgAh0AFAALQCACHeAQQAswIAId8BBADjAgAh4AEEALMCACHhAQEA0wIAIeIBAADoAgAg4wEAAOgCACDkAUAA3AIAIQgHAACPBQAgDAAAjgUAIA0AAIwFACDDAQAA8AIAIN8BAADwAgAg4gEAAPACACDjAQAA8AIAIOQBAADwAgAgDwcAAOkCACAMAADqAgAgDQAA2gIAIMABAADnAgAwwQEAAA0AEMIBAADnAgAwwwEEAOMCACHQAUAAtAIAId4BBAAAAAHfAQQA4wIAIeABBACzAgAh4QEBANMCACHiAQAA6AIAIOMBAADoAgAg5AFAANwCACEDAAAADQAgAQAADgAwAgAADwAgAQAAAAcAIAkJAAC1AgAgCgAAtgIAIMABAACyAgAwwQEAABIAEMIBAACyAgAwwwEEALMCACHOAQQAswIAIc8BBACzAgAh0AFAALQCACEBAAAAEgAgCAcAAOYCACAIAADaAgAgwAEAAOUCADDBAQAAFAAQwgEAAOUCADDDAQQAswIAIcQBBACzAgAhxQEEAOMCACEDBwAAjgUAIAgAAIwFACDFAQAA8AIAIAkHAADmAgAgCAAA2gIAIMABAADlAgAwwQEAABQAEMIBAADlAgAwwwEEALMCACHEAQQAswIAIcUBBADjAgAhhAIAAOQCACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAUACABAAAADQAgAQAAAAcAIAEAAAANACALBAAA3QIAIAgAANoCACDAAQAA4QIAMMEBAAAdABDCAQAA4QIAMMQBBACzAgAh1gEEALMCACHvAQEA0gIAIfABAADiAgAg8QFAALQCACHyAQQA4wIAIQQEAACNBQAgCAAAjAUAIO8BAADwAgAg8gEAAPACACAMBAAA3QIAIAgAANoCACDAAQAA4QIAMMEBAAAdABDCAQAA4QIAMMQBBACzAgAh1gEEALMCACHvAQEA0gIAIfABAADiAgAg8QFAALQCACHyAQQA4wIAIYMCAADgAgAgAwAAAB0AIAEAAB4AMAIAAB8AIAkEAADdAgAgwAEAAN4CADDBAQAAIQAQwgEAAN4CADDWAQQAswIAIesBBACzAgAh7AEBANMCACHtAQQAswIAIe4BAgDfAgAhAQQAAI0FACAJBAAA3QIAIMABAADeAgAwwQEAACEAEMIBAADeAgAw1gEEALMCACHrAQQAAAAB7AEBANMCACHtAQQAswIAIe4BAgDfAgAhAwAAACEAIAEAACIAMAIAACMAIAsEAADdAgAgEAAA2gIAIMABAADbAgAwwQEAACUAEMIBAADbAgAw0AFAALQCACHVAQQAswIAIdYBBACzAgAh1wEBANMCACHYAQQAswIAIdkBQADcAgAhAwQAAI0FACAQAACMBQAg2QEAAPACACALBAAA3QIAIBAAANoCACDAAQAA2wIAMMEBAAAlABDCAQAA2wIAMNABQAC0AgAh1QEEAAAAAdYBBACzAgAh1wEBAAAAAdgBBACzAgAh2QFAANwCACEDAAAAJQAgAQAAJgAwAgAAJwAgAQAAAAcAIAEAAAAdACABAAAAIQAgAQAAACUAIAMAAAAdACABAAAeADACAAAfACADAAAADQAgAQAADgAwAgAADwAgCAgAANoCACATAADaAgAgwAEAANkCADDBAQAALwAQwgEAANkCADDEAQQAswIAIdABQAC0AgAh3QEEALMCACECCAAAjAUAIBMAAIwFACAJCAAA2gIAIBMAANoCACDAAQAA2QIAMMEBAAAvABDCAQAA2QIAMMQBBACzAgAh0AFAALQCACHdAQQAswIAIYICAADYAgAgAwAAAC8AIAEAADAAMAIAADEAIAMAAAAvACABAAAwADACAAAxACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAACUAIAEAACYAMAIAACcAIAEAAAADACABAAAAHQAgAQAAAA0AIAEAAAAvACABAAAALwAgAQAAABQAIAEAAAAlACABAAAAAQAgEQkAANUCACAKAAC2AgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAtQIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACzAgAh_AEBANICACH9AQEA0wIAIf4BAQDSAgAh_wEBANICACGAAgEA0gIAIYECAQDSAgAhDAkAAIkFACAKAAClAwAgEgAAiAUAIBQAAIoFACAVAACKBQAgFgAApAMAIBcAAIsFACD8AQAA8AIAIP4BAADwAgAg_wEAAPACACCAAgAA8AIAIIECAADwAgAgAwAAAD4AIAEAAD8AMAIAAAEAIAMAAAA-ACABAAA_ADACAAABACADAAAAPgAgAQAAPwAwAgAAAQAgDgkAAIIFACAKAACDBQAgEgAAgQUAIBQAAIQFACAVAACFBQAgFgAAhgUAIBcAAIcFACDEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAR0AAEMAIAfEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAR0AAEUAMAEdAABFADAOCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIMQBBAD3AgAh_AEBAMwDACH9AQEAjgMAIf4BAQDMAwAh_wEBAMwDACGAAgEAzAMAIYECAQDMAwAhAgAAAAEAIB0AAEgAIAfEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQIAAAA-ACAdAABKACACAAAAPgAgHQAASgAgAwAAAAEAICQAAEMAICUAAEgAIAEAAAABACABAAAAPgAgCgsAALAEACAqAACxBAAgKwAAtAQAICwAALMEACAtAACyBAAg_AEAAPACACD-AQAA8AIAIP8BAADwAgAggAIAAPACACCBAgAA8AIAIArAAQAA0AIAMMEBAABRABDCAQAA0AIAMMQBBACjAgAh_AEBAMYCACH9AQEAuAIAIf4BAQDGAgAh_wEBAMYCACGAAgEAxgIAIYECAQDGAgAhAwAAAD4AIAEAAFAAMCkAAFEAIAMAAAA-ACABAAA_ADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAoDAACrBAAgCQAArQQAIA4AAKwEACAPAACuBAAgEQAArwQAINYBBAAAAAHsAQEAAAAB-QEBAAAAAfoBBAAAAAH7AQIAAAABAR0AAFkAIAXWAQQAAAAB7AEBAAAAAfkBAQAAAAH6AQQAAAAB-wECAAAAAQEdAABbADABHQAAWwAwCgMAAPkDACAJAAD7AwAgDgAA-gMAIA8AAPwDACARAAD9AwAg1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQIAAAAFACAdAABeACAF1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQIAAAADACAdAABgACACAAAAAwAgHQAAYAAgAwAAAAUAICQAAFkAICUAAF4AIAEAAAAFACABAAAAAwAgBgsAAPQDACAqAAD1AwAgKwAA-AMAICwAAPcDACAtAAD2AwAg-QEAAPACACAIwAEAAM8CADDBAQAAZwAQwgEAAM8CADDWAQQAowIAIewBAQC4AgAh-QEBAMYCACH6AQQAowIAIfsBAgDDAgAhAwAAAAMAIAEAAGYAMCkAAGcAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA0EAADwAwAgBQAA8wMAIAYAAPEDACAKAADyAwAgwwEEAAAAAdYBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQEdAABvACAJwwEEAAAAAdYBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQEdAABxADABHQAAcQAwAQAAAAcAIA0EAADXAwAgBQAA2AMAIAYAANkDACAKAADaAwAgwwEEAPcCACHWAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQIAAAAJACAdAAB1ACAJwwEEAPcCACHWAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQIAAAAHACAdAAB3ACACAAAABwAgHQAAdwAgAQAAAAcAIAMAAAAJACAkAABvACAlAAB1ACABAAAACQAgAQAAAAcAIAgLAADRAwAgKgAA0gMAICsAANUDACAsAADUAwAgLQAA0wMAIPMBAADwAgAg9AEAAPACACD4AQAA8AIAIAzAAQAAywIAMMEBAAB_ABDCAQAAywIAMMMBBACjAgAh1gEEAKMCACHsAQEAuAIAIe4BAgDDAgAh8wEBAMYCACH0AQEAxgIAIfUBAgDDAgAh9wEAAMwC9wEi-AEEAKQCACEDAAAABwAgAQAAfgAwKQAAfwAgAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAAfACABAAAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgCAQAAM8DACAIAADQAwAgxAEEAAAAAdYBBAAAAAHvAQEAAAAB8AGAAAAAAfEBQAAAAAHyAQQAAAABAR0AAIcBACAGxAEEAAAAAdYBBAAAAAHvAQEAAAAB8AGAAAAAAfEBQAAAAAHyAQQAAAABAR0AAIkBADABHQAAiQEAMAgEAADNAwAgCAAAzgMAIMQBBAD3AgAh1gEEAPcCACHvAQEAzAMAIfABgAAAAAHxAUAAgQMAIfIBBAD2AgAhAgAAAB8AIB0AAIwBACAGxAEEAPcCACHWAQQA9wIAIe8BAQDMAwAh8AGAAAAAAfEBQACBAwAh8gEEAPYCACECAAAAHQAgHQAAjgEAIAIAAAAdACAdAACOAQAgAwAAAB8AICQAAIcBACAlAACMAQAgAQAAAB8AIAEAAAAdACAHCwAAxwMAICoAAMgDACArAADLAwAgLAAAygMAIC0AAMkDACDvAQAA8AIAIPIBAADwAgAgCcABAADFAgAwwQEAAJUBABDCAQAAxQIAMMQBBACjAgAh1gEEAKMCACHvAQEAxgIAIfABAADHAgAg8QFAAK4CACHyAQQApAIAIQMAAAAdACABAACUAQAwKQAAlQEAIAMAAAAdACABAAAeADACAAAfACABAAAAIwAgAQAAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAYEAADGAwAg1gEEAAAAAesBBAAAAAHsAQEAAAAB7QEEAAAAAe4BAgAAAAEBHQAAnQEAIAXWAQQAAAAB6wEEAAAAAewBAQAAAAHtAQQAAAAB7gECAAAAAQEdAACfAQAwAR0AAJ8BADAGBAAAxQMAINYBBAD3AgAh6wEEAPcCACHsAQEAjgMAIe0BBAD3AgAh7gECAMQDACECAAAAIwAgHQAAogEAIAXWAQQA9wIAIesBBAD3AgAh7AEBAI4DACHtAQQA9wIAIe4BAgDEAwAhAgAAACEAIB0AAKQBACACAAAAIQAgHQAApAEAIAMAAAAjACAkAACdAQAgJQAAogEAIAEAAAAjACABAAAAIQAgBQsAAL8DACAqAADAAwAgKwAAwwMAICwAAMIDACAtAADBAwAgCMABAADCAgAwwQEAAKsBABDCAQAAwgIAMNYBBACjAgAh6wEEAKMCACHsAQEAuAIAIe0BBACjAgAh7gECAMMCACEDAAAAIQAgAQAAqgEAMCkAAKsBACADAAAAIQAgAQAAIgAwAgAAIwAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAMBwAAlAMAIAwAAL4DACANAACVAwAgwwEEAAAAAdABQAAAAAHeAQQAAAAB3wEEAAAAAeABBAAAAAHhAQEAAAAB4gGAAAAAAeMBgAAAAAHkAUAAAAABAR0AALMBACAJwwEEAAAAAdABQAAAAAHeAQQAAAAB3wEEAAAAAeABBAAAAAHhAQEAAAAB4gGAAAAAAeMBgAAAAAHkAUAAAAABAR0AALUBADABHQAAtQEAMAEAAAAHACABAAAAEgAgDAcAAJEDACAMAAC9AwAgDQAAkgMAIMMBBAD2AgAh0AFAAIEDACHeAQQA9wIAId8BBAD2AgAh4AEEAPcCACHhAQEAjgMAIeIBgAAAAAHjAYAAAAAB5AFAAI8DACECAAAADwAgHQAAugEAIAnDAQQA9gIAIdABQACBAwAh3gEEAPcCACHfAQQA9gIAIeABBAD3AgAh4QEBAI4DACHiAYAAAAAB4wGAAAAAAeQBQACPAwAhAgAAAA0AIB0AALwBACACAAAADQAgHQAAvAEAIAEAAAAHACABAAAAEgAgAwAAAA8AICQAALMBACAlAAC6AQAgAQAAAA8AIAEAAAANACAKCwAAuAMAICoAALkDACArAAC8AwAgLAAAuwMAIC0AALoDACDDAQAA8AIAIN8BAADwAgAg4gEAAPACACDjAQAA8AIAIOQBAADwAgAgDMABAAC_AgAwwQEAAMUBABDCAQAAvwIAMMMBBACkAgAh0AFAAK4CACHeAQQAowIAId8BBACkAgAh4AEEAKMCACHhAQEAuAIAIeIBAADAAgAg4wEAAMACACDkAUAAuQIAIQMAAAANACABAADEAQAwKQAAxQEAIAMAAAANACABAAAOADACAAAPACABAAAAMQAgAQAAADEAIAMAAAAvACABAAAwADACAAAxACADAAAALwAgAQAAMAAwAgAAMQAgAwAAAC8AIAEAADAAMAIAADEAIAUIAAC2AwAgEwAAtwMAIMQBBAAAAAHQAUAAAAAB3QEEAAAAAQEdAADNAQAgA8QBBAAAAAHQAUAAAAAB3QEEAAAAAQEdAADPAQAwAR0AAM8BADAFCAAAtAMAIBMAALUDACDEAQQA9wIAIdABQACBAwAh3QEEAPcCACECAAAAMQAgHQAA0gEAIAPEAQQA9wIAIdABQACBAwAh3QEEAPcCACECAAAALwAgHQAA1AEAIAIAAAAvACAdAADUAQAgAwAAADEAICQAAM0BACAlAADSAQAgAQAAADEAIAEAAAAvACAFCwAArwMAICoAALADACArAACzAwAgLAAAsgMAIC0AALEDACAGwAEAAL4CADDBAQAA2wEAEMIBAAC-AgAwxAEEAKMCACHQAUAArgIAId0BBACjAgAhAwAAAC8AIAEAANoBADApAADbAQAgAwAAAC8AIAEAADAAMAIAADEAIAEAAAAnACABAAAAJwAgAwAAACUAIAEAACYAMAIAACcAIAMAAAAlACABAAAmADACAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgCAQAAK0DACAQAACuAwAg0AFAAAAAAdUBBAAAAAHWAQQAAAAB1wEBAAAAAdgBBAAAAAHZAUAAAAABAR0AAOMBACAG0AFAAAAAAdUBBAAAAAHWAQQAAAAB1wEBAAAAAdgBBAAAAAHZAUAAAAABAR0AAOUBADABHQAA5QEAMAgEAACrAwAgEAAArAMAINABQACBAwAh1QEEAPcCACHWAQQA9wIAIdcBAQCOAwAh2AEEAPcCACHZAUAAjwMAIQIAAAAnACAdAADoAQAgBtABQACBAwAh1QEEAPcCACHWAQQA9wIAIdcBAQCOAwAh2AEEAPcCACHZAUAAjwMAIQIAAAAlACAdAADqAQAgAgAAACUAIB0AAOoBACADAAAAJwAgJAAA4wEAICUAAOgBACABAAAAJwAgAQAAACUAIAYLAACmAwAgKgAApwMAICsAAKoDACAsAACpAwAgLQAAqAMAINkBAADwAgAgCcABAAC3AgAwwQEAAPEBABDCAQAAtwIAMNABQACuAgAh1QEEAKMCACHWAQQAowIAIdcBAQC4AgAh2AEEAKMCACHZAUAAuQIAIQMAAAAlACABAADwAQAwKQAA8QEAIAMAAAAlACABAAAmADACAAAnACAKCQAAtQIAIAoAALYCACDAAQAAsgIAMMEBAAASABDCAQAAsgIAMMMBBAAAAAHOAQQAswIAIc8BBACzAgAh0AFAALQCACHRAQAAsQIAIAEAAAD0AQAgAQAAAPQBACACCQAApAMAIAoAAKUDACADAAAAEgAgAQAA9wEAMAIAAPQBACADAAAAEgAgAQAA9wEAMAIAAPQBACADAAAAEgAgAQAA9wEAMAIAAPQBACAGCQAAogMAIAoAAKMDACDDAQQAAAABzgEEAAAAAc8BBAAAAAHQAUAAAAABAR0AAPsBACAEwwEEAAAAAc4BBAAAAAHPAQQAAAAB0AFAAAAAAQEdAAD9AQAwAR0AAP0BADAGCQAAggMAIAoAAIMDACDDAQQA9wIAIc4BBAD3AgAhzwEEAPcCACHQAUAAgQMAIQIAAAD0AQAgHQAAgAIAIATDAQQA9wIAIc4BBAD3AgAhzwEEAPcCACHQAUAAgQMAIQIAAAASACAdAACCAgAgAgAAABIAIB0AAIICACADAAAA9AEAICQAAPsBACAlAACAAgAgAQAAAPQBACABAAAAEgAgBQsAAPwCACAqAAD9AgAgKwAAgAMAICwAAP8CACAtAAD-AgAgB8ABAACtAgAwwQEAAIkCABDCAQAArQIAMMMBBACjAgAhzgEEAKMCACHPAQQAowIAIdABQACuAgAhAwAAABIAIAEAAIgCADApAACJAgAgAwAAABIAIAEAAPcBADACAAD0AQAgAQAAABYAIAEAAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACAFBwAA-gIAIAgAAPsCACDDAQQAAAABxAEEAAAAAcUBBAAAAAEBHQAAkQIAIAPDAQQAAAABxAEEAAAAAcUBBAAAAAEBHQAAkwIAMAEdAACTAgAwBQcAAPgCACAIAAD5AgAgwwEEAPcCACHEAQQA9wIAIcUBBAD2AgAhAgAAABYAIB0AAJYCACADwwEEAPcCACHEAQQA9wIAIcUBBAD2AgAhAgAAABQAIB0AAJgCACACAAAAFAAgHQAAmAIAIAMAAAAWACAkAACRAgAgJQAAlgIAIAEAAAAWACABAAAAFAAgBgsAAPECACAqAADyAgAgKwAA9QIAICwAAPQCACAtAADzAgAgxQEAAPACACAGwAEAAKICADDBAQAAnwIAEMIBAACiAgAwwwEEAKMCACHEAQQAowIAIcUBBACkAgAhAwAAABQAIAEAAJ4CADApAACfAgAgAwAAABQAIAEAABUAMAIAABYAIAbAAQAAogIAMMEBAACfAgAQwgEAAKICADDDAQQAowIAIcQBBACjAgAhxQEEAKQCACENCwAAqgIAICoAAKsCACArAACsAgAgLAAArAIAIC0AAKwCACDGAQQAAAABxwEEAAAABMgBBAAAAATJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKkCACENCwAApgIAICoAAKcCACArAACoAgAgLAAAqAIAIC0AAKgCACDGAQQAAAABxwEEAAAABcgBBAAAAAXJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKUCACENCwAApgIAICoAAKcCACArAACoAgAgLAAAqAIAIC0AAKgCACDGAQQAAAABxwEEAAAABcgBBAAAAAXJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKUCACEIxgECAAAAAccBAgAAAAXIAQIAAAAFyQECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgCmAgAhCMYBCAAAAAHHAQgAAAAFyAEIAAAABckBCAAAAAHKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgApwIAIQjGAQQAAAABxwEEAAAABcgBBAAAAAXJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKgCACENCwAAqgIAICoAAKsCACArAACsAgAgLAAArAIAIC0AAKwCACDGAQQAAAABxwEEAAAABMgBBAAAAATJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKkCACEIxgECAAAAAccBAgAAAATIAQIAAAAEyQECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgCqAgAhCMYBCAAAAAHHAQgAAAAEyAEIAAAABMkBCAAAAAHKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgAqwIAIQjGAQQAAAABxwEEAAAABMgBBAAAAATJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKwCACEHwAEAAK0CADDBAQAAiQIAEMIBAACtAgAwwwEEAKMCACHOAQQAowIAIc8BBACjAgAh0AFAAK4CACELCwAAqgIAICwAALACACAtAACwAgAgxgFAAAAAAccBQAAAAATIAUAAAAAEyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQACvAgAhCwsAAKoCACAsAACwAgAgLQAAsAIAIMYBQAAAAAHHAUAAAAAEyAFAAAAABMkBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAArwIAIQjGAUAAAAABxwFAAAAABMgBQAAAAATJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAALACACECzgEEAAAAAc8BBAAAAAEJCQAAtQIAIAoAALYCACDAAQAAsgIAMMEBAAASABDCAQAAsgIAMMMBBACzAgAhzgEEALMCACHPAQQAswIAIdABQAC0AgAhCMYBBAAAAAHHAQQAAAAEyAEEAAAABMkBBAAAAAHKAQQAAAABywEEAAAAAcwBBAAAAAHNAQQArAIAIQjGAUAAAAABxwFAAAAABMgBQAAAAATJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAALACACED0gEAABQAINMBAAAUACDUAQAAFAAgA9IBAAANACDTAQAADQAg1AEAAA0AIAnAAQAAtwIAMMEBAADxAQAQwgEAALcCADDQAUAArgIAIdUBBACjAgAh1gEEAKMCACHXAQEAuAIAIdgBBACjAgAh2QFAALkCACEOCwAAqgIAICwAAL0CACAtAAC9AgAgxgEBAAAAAccBAQAAAATIAQEAAAAEyQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQC8AgAh2gEBAAAAAdsBAQAAAAHcAQEAAAABCwsAAKYCACAsAAC7AgAgLQAAuwIAIMYBQAAAAAHHAUAAAAAFyAFAAAAABckBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAugIAIQsLAACmAgAgLAAAuwIAIC0AALsCACDGAUAAAAABxwFAAAAABcgBQAAAAAXJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAALoCACEIxgFAAAAAAccBQAAAAAXIAUAAAAAFyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQAC7AgAhDgsAAKoCACAsAAC9AgAgLQAAvQIAIMYBAQAAAAHHAQEAAAAEyAEBAAAABMkBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAvAIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQvGAQEAAAABxwEBAAAABMgBAQAAAATJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAL0CACHaAQEAAAAB2wEBAAAAAdwBAQAAAAEGwAEAAL4CADDBAQAA2wEAEMIBAAC-AgAwxAEEAKMCACHQAUAArgIAId0BBACjAgAhDMABAAC_AgAwwQEAAMUBABDCAQAAvwIAMMMBBACkAgAh0AFAAK4CACHeAQQAowIAId8BBACkAgAh4AEEAKMCACHhAQEAuAIAIeIBAADAAgAg4wEAAMACACDkAUAAuQIAIQ8LAACmAgAgLAAAwQIAIC0AAMECACDGAYAAAAAByQGAAAAAAcoBgAAAAAHLAYAAAAABzAGAAAAAAc0BgAAAAAHlAQEAAAAB5gEBAAAAAecBAQAAAAHoAYAAAAAB6QGAAAAAAeoBgAAAAAEMxgGAAAAAAckBgAAAAAHKAYAAAAABywGAAAAAAcwBgAAAAAHNAYAAAAAB5QEBAAAAAeYBAQAAAAHnAQEAAAAB6AGAAAAAAekBgAAAAAHqAYAAAAABCMABAADCAgAwwQEAAKsBABDCAQAAwgIAMNYBBACjAgAh6wEEAKMCACHsAQEAuAIAIe0BBACjAgAh7gECAMMCACENCwAAqgIAICoAAKsCACArAACqAgAgLAAAqgIAIC0AAKoCACDGAQIAAAABxwECAAAABMgBAgAAAATJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAMQCACENCwAAqgIAICoAAKsCACArAACqAgAgLAAAqgIAIC0AAKoCACDGAQIAAAABxwECAAAABMgBAgAAAATJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAMQCACEJwAEAAMUCADDBAQAAlQEAEMIBAADFAgAwxAEEAKMCACHWAQQAowIAIe8BAQDGAgAh8AEAAMcCACDxAUAArgIAIfIBBACkAgAhDgsAAKYCACAsAADKAgAgLQAAygIAIMYBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAyQIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQ8LAACqAgAgLAAAyAIAIC0AAMgCACDGAYAAAAAByQGAAAAAAcoBgAAAAAHLAYAAAAABzAGAAAAAAc0BgAAAAAHlAQEAAAAB5gEBAAAAAecBAQAAAAHoAYAAAAAB6QGAAAAAAeoBgAAAAAEMxgGAAAAAAckBgAAAAAHKAYAAAAABywGAAAAAAcwBgAAAAAHNAYAAAAAB5QEBAAAAAeYBAQAAAAHnAQEAAAAB6AGAAAAAAekBgAAAAAHqAYAAAAABDgsAAKYCACAsAADKAgAgLQAAygIAIMYBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAyQIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQvGAQEAAAABxwEBAAAABcgBAQAAAAXJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAMoCACHaAQEAAAAB2wEBAAAAAdwBAQAAAAEMwAEAAMsCADDBAQAAfwAQwgEAAMsCADDDAQQAowIAIdYBBACjAgAh7AEBALgCACHuAQIAwwIAIfMBAQDGAgAh9AEBAMYCACH1AQIAwwIAIfcBAADMAvcBIvgBBACkAgAhBwsAAKoCACAsAADOAgAgLQAAzgIAIMYBAAAA9wECxwEAAAD3AQjIAQAAAPcBCM0BAADNAvcBIgcLAACqAgAgLAAAzgIAIC0AAM4CACDGAQAAAPcBAscBAAAA9wEIyAEAAAD3AQjNAQAAzQL3ASIExgEAAAD3AQLHAQAAAPcBCMgBAAAA9wEIzQEAAM4C9wEiCMABAADPAgAwwQEAAGcAEMIBAADPAgAw1gEEAKMCACHsAQEAuAIAIfkBAQDGAgAh-gEEAKMCACH7AQIAwwIAIQrAAQAA0AIAMMEBAABRABDCAQAA0AIAMMQBBACjAgAh_AEBAMYCACH9AQEAuAIAIf4BAQDGAgAh_wEBAMYCACGAAgEAxgIAIYECAQDGAgAhEQkAANUCACAKAAC2AgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAtQIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACzAgAh_AEBANICACH9AQEA0wIAIf4BAQDSAgAh_wEBANICACGAAgEA0gIAIYECAQDSAgAhC8YBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAygIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQvGAQEAAAABxwEBAAAABMgBAQAAAATJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAL0CACHaAQEAAAAB2wEBAAAAAdwBAQAAAAED0gEAAAMAINMBAAADACDUAQAAAwAgA9IBAAAdACDTAQAAHQAg1AEAAB0AIAPSAQAALwAg0wEAAC8AINQBAAAvACAD0gEAACUAINMBAAAlACDUAQAAJQAgAsQBBAAAAAHdAQQAAAABCAgAANoCACATAADaAgAgwAEAANkCADDBAQAALwAQwgEAANkCADDEAQQAswIAIdABQAC0AgAh3QEEALMCACETCQAA1QIAIAoAALYCACASAADUAgAgFAAA1gIAIBUAANYCACAWAAC1AgAgFwAA1wIAIMABAADRAgAwwQEAAD4AEMIBAADRAgAwxAEEALMCACH8AQEA0gIAIf0BAQDTAgAh_gEBANICACH_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_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-AwAwJQAAgwQAMIcCAAD_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-QQAMIsCAAD5BAAwjAIAAPkEADCNAgAA-QQAMI4CAAD7BAAwjwIAAPwEADALJAAA7AQAMCUAAPAEADCHAgAA7QQAMIgCAADuBAAwiQIAAO8EACCKAgAAmgQAMIsCAACaBAAwjAIAAJoEADCNAgAAmgQAMI4CAADxBAAwjwIAAJ0EADALJAAA4wQAMCUAAOcEADCHAgAA5AQAMIgCAADlBAAwiQIAAOYEACCKAgAAiAMAMIsCAACIAwAwjAIAAIgDADCNAgAAiAMAMI4CAADoBAAwjwIAAIsDADALJAAA2gQAMCUAAN4EADCHAgAA2wQAMIgCAADcBAAwiQIAAN0EACCKAgAA0gQAMIsCAADSBAAwjAIAANIEADCNAgAA0gQAMI4CAADfBAAwjwIAANUEADALJAAAzgQAMCUAANMEADCHAgAAzwQAMIgCAADQBAAwiQIAANEEACCKAgAA0gQAMIsCAADSBAAwjAIAANIEADCNAgAA0gQAMI4CAADUBAAwjwIAANUEADALJAAAxQQAMCUAAMkEADCHAgAAxgQAMIgCAADHBAAwiQIAAMgEACCKAgAAmgMAMIsCAACaAwAwjAIAAJoDADCNAgAAmgMAMI4CAADKBAAwjwIAAJ0DADALJAAAvAQAMCUAAMAEADCHAgAAvQQAMIgCAAC-BAAwiQIAAL8EACCKAgAAggQAMIsCAACCBAAwjAIAAIIEADCNAgAAggQAMI4CAADBBAAwjwIAAIUEADAGBAAArQMAINABQAAAAAHVAQQAAAAB1gEEAAAAAdcBAQAAAAHZAUAAAAABAgAAACcAICQAAMQEACADAAAAJwAgJAAAxAQAICUAAMMEACABHQAAmAUAMAIAAAAnACAdAADDBAAgAgAAAIYEACAdAADCBAAgBdABQACBAwAh1QEEAPcCACHWAQQA9wIAIdcBAQCOAwAh2QFAAI8DACEGBAAAqwMAINABQACBAwAh1QEEAPcCACHWAQQA9wIAIdcBAQCOAwAh2QFAAI8DACEGBAAArQMAINABQAAAAAHVAQQAAAAB1gEEAAAAAdcBAQAAAAHZAUAAAAABAwcAAPoCACDDAQQAAAABxQEEAAAAAQIAAAAWACAkAADNBAAgAwAAABYAICQAAM0EACAlAADMBAAgAR0AAJcFADACAAAAFgAgHQAAzAQAIAIAAACeAwAgHQAAywQAIALDAQQA9wIAIcUBBAD2AgAhAwcAAPgCACDDAQQA9wIAIcUBBAD2AgAhAwcAAPoCACDDAQQAAAABxQEEAAAAAQMIAAC2AwAgxAEEAAAAAdABQAAAAAECAAAAMQAgJAAA2QQAIAMAAAAxACAkAADZBAAgJQAA2AQAIAEdAACWBQAwCQgAANoCACATAADaAgAgwAEAANkCADDBAQAALwAQwgEAANkCADDEAQQAswIAIdABQAC0AgAh3QEEALMCACGCAgAA2AIAIAIAAAAxACAdAADYBAAgAgAAANYEACAdAADXBAAgBsABAADVBAAwwQEAANYEABDCAQAA1QQAMMQBBACzAgAh0AFAALQCACHdAQQAswIAIQbAAQAA1QQAMMEBAADWBAAQwgEAANUEADDEAQQAswIAIdABQAC0AgAh3QEEALMCACECxAEEAPcCACHQAUAAgQMAIQMIAAC0AwAgxAEEAPcCACHQAUAAgQMAIQMIAAC2AwAgxAEEAAAAAdABQAAAAAEDEwAAtwMAINABQAAAAAHdAQQAAAABAgAAADEAICQAAOIEACADAAAAMQAgJAAA4gQAICUAAOEEACABHQAAlQUAMAIAAAAxACAdAADhBAAgAgAAANYEACAdAADgBAAgAtABQACBAwAh3QEEAPcCACEDEwAAtQMAINABQACBAwAh3QEEAPcCACEDEwAAtwMAINABQAAAAAHdAQQAAAABCgcAAJQDACAMAAC-AwAgwwEEAAAAAdABQAAAAAHeAQQAAAAB3wEEAAAAAeEBAQAAAAHiAYAAAAAB4wGAAAAAAeQBQAAAAAECAAAADwAgJAAA6wQAIAMAAAAPACAkAADrBAAgJQAA6gQAIAEdAACUBQAwAgAAAA8AIB0AAOoEACACAAAAjAMAIB0AAOkEACAIwwEEAPYCACHQAUAAgQMAId4BBAD3AgAh3wEEAPYCACHhAQEAjgMAIeIBgAAAAAHjAYAAAAAB5AFAAI8DACEKBwAAkQMAIAwAAL0DACDDAQQA9gIAIdABQACBAwAh3gEEAPcCACHfAQQA9gIAIeEBAQCOAwAh4gGAAAAAAeMBgAAAAAHkAUAAjwMAIQoHAACUAwAgDAAAvgMAIMMBBAAAAAHQAUAAAAAB3gEEAAAAAd8BBAAAAAHhAQEAAAAB4gGAAAAAAeMBgAAAAAHkAUAAAAABBgQAAM8DACDWAQQAAAAB7wEBAAAAAfABgAAAAAHxAUAAAAAB8gEEAAAAAQIAAAAfACAkAAD0BAAgAwAAAB8AICQAAPQEACAlAADzBAAgAR0AAJMFADACAAAAHwAgHQAA8wQAIAIAAACeBAAgHQAA8gQAIAXWAQQA9wIAIe8BAQDMAwAh8AGAAAAAAfEBQACBAwAh8gEEAPYCACEGBAAAzQMAINYBBAD3AgAh7wEBAMwDACHwAYAAAAAB8QFAAIEDACHyAQQA9gIAIQYEAADPAwAg1gEEAAAAAe8BAQAAAAHwAYAAAAAB8QFAAAAAAfIBBAAAAAEICQAArQQAIA4AAKwEACAPAACuBAAgEQAArwQAINYBBAAAAAHsAQEAAAAB-QEBAAAAAfsBAgAAAAECAAAABQAgJAAAgAUAIAMAAAAFACAkAACABQAgJQAA_wQAIAEdAACSBQAwDQMAANoCACAJAADVAgAgDgAA7QIAIA8AAO8CACARAADXAgAgwAEAAO4CADDBAQAAAwAQwgEAAO4CADDWAQQAAAAB7AEBANMCACH5AQEA0gIAIfoBBACzAgAh-wECAN8CACECAAAABQAgHQAA_wQAIAIAAAD9BAAgHQAA_gQAIAjAAQAA_AQAMMEBAAD9BAAQwgEAAPwEADDWAQQAswIAIewBAQDTAgAh-QEBANICACH6AQQAswIAIfsBAgDfAgAhCMABAAD8BAAwwQEAAP0EABDCAQAA_AQAMNYBBACzAgAh7AEBANMCACH5AQEA0gIAIfoBBACzAgAh-wECAN8CACEE1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-wECAMQDACEICQAA-wMAIA4AAPoDACAPAAD8AwAgEQAA_QMAINYBBAD3AgAh7AEBAI4DACH5AQEAzAMAIfsBAgDEAwAhCAkAAK0EACAOAACsBAAgDwAArgQAIBEAAK8EACDWAQQAAAAB7AEBAAAAAfkBAQAAAAH7AQIAAAABBCQAAPUEADCHAgAA9gQAMIkCAAD4BAAgjQIAAPkEADAEJAAA7AQAMIcCAADtBAAwiQIAAO8EACCNAgAAmgQAMAQkAADjBAAwhwIAAOQEADCJAgAA5gQAII0CAACIAwAwBCQAANoEADCHAgAA2wQAMIkCAADdBAAgjQIAANIEADAEJAAAzgQAMIcCAADPBAAwiQIAANEEACCNAgAA0gQAMAQkAADFBAAwhwIAAMYEADCJAgAAyAQAII0CAACaAwAwBCQAALwEADCHAgAAvQQAMIkCAAC_BAAgjQIAAIIEADAAAAAADAkAAIkFACAKAAClAwAgEgAAiAUAIBQAAIoFACAVAACKBQAgFgAApAMAIBcAAIsFACD8AQAA8AIAIP4BAADwAgAg_wEAAPACACCAAgAA8AIAIIECAADwAgAgBgMAAIwFACAJAACJBQAgDgAAkAUAIA8AAJEFACARAACLBQAg-QEAAPACACACCQAApAMAIAoAAKUDACAHBAAAjQUAIAUAAI8FACAGAACQBQAgCgAApQMAIPMBAADwAgAg9AEAAPACACD4AQAA8AIAIAAABNYBBAAAAAHsAQEAAAAB-QEBAAAAAfsBAgAAAAEF1gEEAAAAAe8BAQAAAAHwAYAAAAAB8QFAAAAAAfIBBAAAAAEIwwEEAAAAAdABQAAAAAHeAQQAAAAB3wEEAAAAAeEBAQAAAAHiAYAAAAAB4wGAAAAAAeQBQAAAAAEC0AFAAAAAAd0BBAAAAAECxAEEAAAAAdABQAAAAAECwwEEAAAAAcUBBAAAAAEF0AFAAAAAAdUBBAAAAAHWAQQAAAAB1wEBAAAAAdkBQAAAAAENCQAAggUAIAoAAIMFACAUAACEBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAACZBQAgCMMBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQXEAQQAAAAB7wEBAAAAAfABgAAAAAHxAUAAAAAB8gEEAAAAAQTrAQQAAAAB7AEBAAAAAe0BBAAAAAHuAQIAAAABBdABQAAAAAHVAQQAAAAB1wEBAAAAAdgBBAAAAAHZAUAAAAABAwAAAD4AICQAAJkFACAlAAChBQAgDwAAAD4AIAkAALYEACAKAAC3BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIB0AAKEFACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQ0JAAC2BAAgCgAAtwQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQwEAADwAwAgBQAA8wMAIAoAAPIDACDDAQQAAAAB1gEEAAAAAewBAQAAAAHuAQIAAAAB8wEBAAAAAfQBAQAAAAH1AQIAAAAB9wEAAAD3AQL4AQQAAAABAgAAAAkAICQAAKIFACAJAwAAqwQAIAkAAK0EACAPAACuBAAgEQAArwQAINYBBAAAAAHsAQEAAAAB-QEBAAAAAfoBBAAAAAH7AQIAAAABAgAAAAUAICQAAKQFACAIwwEEAAAAAdYBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wECCNABQAAAAAHeAQQAAAAB3wEEAAAAAeABBAAAAAHhAQEAAAAB4gGAAAAAAeMBgAAAAAHkAUAAAAABAwAAAAcAICQAAKIFACAlAACqBQAgDgAAAAcAIAQAANcDACAFAADYAwAgCgAA2gMAIB0AAKoFACDDAQQA9wIAIdYBBAD3AgAh7AEBAI4DACHuAQIAxAMAIfMBAQDMAwAh9AEBAMwDACH1AQIAxAMAIfcBAADWA_cBIvgBBAD2AgAhDAQAANcDACAFAADYAwAgCgAA2gMAIMMBBAD3AgAh1gEEAPcCACHsAQEAjgMAIe4BAgDEAwAh8wEBAMwDACH0AQEAzAMAIfUBAgDEAwAh9wEAANYD9wEi-AEEAPYCACEDAAAAAwAgJAAApAUAICUAAK0FACALAAAAAwAgAwAA-QMAIAkAAPsDACAPAAD8AwAgEQAA_QMAIB0AAK0FACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhCQMAAPkDACAJAAD7AwAgDwAA_AMAIBEAAP0DACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhDQoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgFwAAhwUAIMQBBAAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAECAAAAAQAgJAAArgUAIAkDAACrBAAgDgAArAQAIA8AAK4EACARAACvBAAg1gEEAAAAAewBAQAAAAH5AQEAAAAB-gEEAAAAAfsBAgAAAAECAAAABQAgJAAAsAUAIAMAAAA-ACAkAACuBQAgJQAAtAUAIA8AAAA-ACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACAdAAC0BQAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACEDAAAAAwAgJAAAsAUAICUAALcFACALAAAAAwAgAwAA-QMAIA4AAPoDACAPAAD8AwAgEQAA_QMAIB0AALcFACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhCQMAAPkDACAOAAD6AwAgDwAA_AMAIBEAAP0DACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhCQMAAKsEACAJAACtBAAgDgAArAQAIBEAAK8EACDWAQQAAAAB7AEBAAAAAfkBAQAAAAH6AQQAAAAB-wECAAAAAQIAAAAFACAkAAC4BQAgAwAAAAMAICQAALgFACAlAAC8BQAgCwAAAAMAIAMAAPkDACAJAAD7AwAgDgAA-gMAIBEAAP0DACAdAAC8BQAg1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQkDAAD5AwAgCQAA-wMAIA4AAPoDACARAAD9AwAg1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQUJAACiAwAgwwEEAAAAAc4BBAAAAAHPAQQAAAAB0AFAAAAAAQIAAAD0AQAgJAAAvQUAIAMAAAASACAkAAC9BQAgJQAAwQUAIAcAAAASACAJAACCAwAgHQAAwQUAIMMBBAD3AgAhzgEEAPcCACHPAQQA9wIAIdABQACBAwAhBQkAAIIDACDDAQQA9wIAIc4BBAD3AgAhzwEEAPcCACHQAUAAgQMAIQ0JAACCBQAgCgAAgwUAIBIAAIEFACAUAACEBQAgFgAAhgUAIBcAAIcFACDEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAgAAAAEAICQAAMIFACANCQAAggUAIAoAAIMFACASAACBBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAADEBQAgAwAAAD4AICQAAMIFACAlAADIBQAgDwAAAD4AIAkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAWAAC6BAAgFwAAuwQAIB0AAMgFACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQ0JAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFgAAugQAIBcAALsEACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQMAAAA-ACAkAADEBQAgJQAAywUAIA8AAAA-ACAJAAC2BAAgCgAAtwQAIBIAALUEACAVAAC5BAAgFgAAugQAIBcAALsEACAdAADLBQAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCQAAtgQAIAoAALcEACASAAC1BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCQAAggUAIAoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAADMBQAgCQMAAKsEACAJAACtBAAgDgAArAQAIA8AAK4EACDWAQQAAAAB7AEBAAAAAfkBAQAAAAH6AQQAAAAB-wECAAAAAQIAAAAFACAkAADOBQAgAwAAAD4AICQAAMwFACAlAADSBQAgDwAAAD4AIAkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFgAAugQAIB0AANIFACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQ0JAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQMAAAADACAkAADOBQAgJQAA1QUAIAsAAAADACADAAD5AwAgCQAA-wMAIA4AAPoDACAPAAD8AwAgHQAA1QUAINYBBAD3AgAh7AEBAI4DACH5AQEAzAMAIfoBBAD3AgAh-wECAMQDACEJAwAA-QMAIAkAAPsDACAOAAD6AwAgDwAA_AMAINYBBAD3AgAh7AEBAI4DACH5AQEAzAMAIfoBBAD3AgAh-wECAMQDACECxAEEAAAAAcUBBAAAAAENCQAAggUAIBIAAIEFACAUAACEBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAADXBQAgDAQAAPADACAFAADzAwAgBgAA8QMAIMMBBAAAAAHWAQQAAAAB7AEBAAAAAe4BAgAAAAHzAQEAAAAB9AEBAAAAAfUBAgAAAAH3AQAAAPcBAvgBBAAAAAECAAAACQAgJAAA2QUAIAMAAAA-ACAkAADXBQAgJQAA3QUAIA8AAAA-ACAJAAC2BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACAdAADdBQAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCQAAtgQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACEDAAAABwAgJAAA2QUAICUAAOAFACAOAAAABwAgBAAA1wMAIAUAANgDACAGAADZAwAgHQAA4AUAIMMBBAD3AgAh1gEEAPcCACHsAQEAjgMAIe4BAgDEAwAh8wEBAMwDACH0AQEAzAMAIfUBAgDEAwAh9wEAANYD9wEi-AEEAPYCACEMBAAA1wMAIAUAANgDACAGAADZAwAgwwEEAPcCACHWAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQjDAQQAAAAB0AFAAAAAAd4BBAAAAAHgAQQAAAAB4QEBAAAAAeIBgAAAAAHjAYAAAAAB5AFAAAAAAQ0JAACCBQAgCgAAgwUAIBIAAIEFACAUAACEBQAgFQAAhQUAIBcAAIcFACDEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAgAAAAEAICQAAOIFACAFCgAAowMAIMMBBAAAAAHOAQQAAAABzwEEAAAAAdABQAAAAAECAAAA9AEAICQAAOQFACADAAAAPgAgJAAA4gUAICUAAOgFACAPAAAAPgAgCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAXAAC7BAAgHQAA6AUAIMQBBAD3AgAh_AEBAMwDACH9AQEAjgMAIf4BAQDMAwAh_wEBAMwDACGAAgEAzAMAIYECAQDMAwAhDQkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFwAAuwQAIMQBBAD3AgAh_AEBAMwDACH9AQEAjgMAIf4BAQDMAwAh_wEBAMwDACGAAgEAzAMAIYECAQDMAwAhAwAAABIAICQAAOQFACAlAADrBQAgBwAAABIAIAoAAIMDACAdAADrBQAgwwEEAPcCACHOAQQA9wIAIc8BBAD3AgAh0AFAAIEDACEFCgAAgwMAIMMBBAD3AgAhzgEEAPcCACHPAQQA9wIAIdABQACBAwAhCAktCQouBAsADhIGAhQyDRUzDRY0Bhc1CwYDAAEJIAkLAAwOCgMPJAoRKAsFBAACBQsDBgwDChAECwAIAwcRAwwTBQ0AAQMJFwYKGAQLAAcCBwAFCAABAgkZAAoaAAIGGwAKHAACBAACCAABAQQAAgIEAAIQAAEECSoADikADysAESwAAggAARMAAQcJNwAKOAASNgAUOQAVOgAWOwAXPAAAAAAFCwATKgAUKwAVLAAWLQAXAAAAAAAFCwATKgAUKwAVLAAWLQAXAQMAAQEDAAEFCwAcKgAdKwAeLAAfLQAgAAAAAAAFCwAcKgAdKwAeLAAfLQAgAgQAAgV0AwIEAAIFegMFCwAlKgAmKwAnLAAoLQApAAAAAAAFCwAlKgAmKwAnLAAoLQApAgQAAggAAQIEAAIIAAEFCwAuKgAvKwAwLAAxLQAyAAAAAAAFCwAuKgAvKwAwLAAxLQAyAQQAAgEEAAIFCwA3KgA4KwA5LAA6LQA7AAAAAAAFCwA3KgA4KwA5LAA6LQA7Awe4AQMMuQEFDQABAwe_AQMMwAEFDQABBQsAQCoAQSsAQiwAQy0ARAAAAAAABQsAQCoAQSsAQiwAQy0ARAIIAAETAAECCAABEwABBQsASSoASisASywATC0ATQAAAAAABQsASSoASisASywATC0ATQIEAAIQAAECBAACEAABBQsAUioAUysAVCwAVS0AVgAAAAAABQsAUioAUysAVCwAVS0AVgAABQsAWyoAXCsAXSwAXi0AXwAAAAAABQsAWyoAXCsAXSwAXi0AXwIHAAUIAAECBwAFCAABBQsAZCoAZSsAZiwAZy0AaAAAAAAABQsAZCoAZSsAZiwAZy0AaBgCARk9ARpAARtBARxCAR5EAR9GDyBHECFJASJLDyNMESZNASdOAShPDy5SEi9TGDBUAjFVAjJWAjNXAjRYAjVaAjZcDzddGThfAjlhDzpiGjtjAjxkAj1lDz5oGz9pIUBqA0FrA0JsA0NtA0RuA0VwA0ZyD0dzIkh2A0l4D0p5I0t7A0x8A019D06AASRPgQEqUIIBCVGDAQlShAEJU4UBCVSGAQlViAEJVooBD1eLAStYjQEJWY8BD1qQASxbkQEJXJIBCV2TAQ9elgEtX5cBM2CYAQphmQEKYpoBCmObAQpknAEKZZ4BCmagAQ9noQE0aKMBCmmlAQ9qpgE1a6cBCmyoAQptqQEPbqwBNm-tATxwrgEEca8BBHKwAQRzsQEEdLIBBHW0AQR2tgEPd7cBPXi7AQR5vQEPer4BPnvBAQR8wgEEfcMBD37GAT9_xwFFgAHIAQ2BAckBDYIBygENgwHLAQ2EAcwBDYUBzgENhgHQAQ-HAdEBRogB0wENiQHVAQ-KAdYBR4sB1wENjAHYAQ2NAdkBD44B3AFIjwHdAU6QAd4BC5EB3wELkgHgAQuTAeEBC5QB4gELlQHkAQuWAeYBD5cB5wFPmAHpAQuZAesBD5oB7AFQmwHtAQucAe4BC50B7wEPngHyAVGfAfMBV6AB9QEFoQH2AQWiAfgBBaMB-QEFpAH6AQWlAfwBBaYB_gEPpwH_AVioAYECBakBgwIPqgGEAlmrAYUCBawBhgIFrQGHAg-uAYoCWq8BiwJgsAGMAgaxAY0CBrIBjgIGswGPAga0AZACBrUBkgIGtgGUAg-3AZUCYbgBlwIGuQGZAg-6AZoCYrsBmwIGvAGcAga9AZ0CD74BoAJjvwGhAmk"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "node:buffer", 23));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async ()=>await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "@prisma/client/runtime/query_compiler_fast_bg.postgresql.js", 23)),
    getQueryCompilerWasmModule: async ()=>{
        const { wasm } = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js", 23));
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return _prisma_client_runtime_client__rspack_import_0.getPrismaClient(config);
}


},
"./generated/prisma/internal/prismaNamespace.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AnyNull: () => (AnyNull),
  ChannelScalarFieldEnum: () => (ChannelScalarFieldEnum),
  DbNull: () => (DbNull),
  Decimal: () => (Decimal),
  DirectChannelMemberScalarFieldEnum: () => (DirectChannelMemberScalarFieldEnum),
  DirectChannelScalarFieldEnum: () => (DirectChannelScalarFieldEnum),
  FriendshipScalarFieldEnum: () => (FriendshipScalarFieldEnum),
  GuildScalarFieldEnum: () => (GuildScalarFieldEnum),
  InviteScalarFieldEnum: () => (InviteScalarFieldEnum),
  JsonNull: () => (JsonNull),
  JsonNullValueFilter: () => (JsonNullValueFilter),
  JsonNullValueInput: () => (JsonNullValueInput),
  MemberScalarFieldEnum: () => (MemberScalarFieldEnum),
  MessageScalarFieldEnum: () => (MessageScalarFieldEnum),
  ModelName: () => (ModelName),
  NullTypes: () => (NullTypes),
  NullableJsonNullValueInput: () => (NullableJsonNullValueInput),
  NullsOrder: () => (NullsOrder),
  PrismaClientInitializationError: () => (PrismaClientInitializationError),
  PrismaClientKnownRequestError: () => (PrismaClientKnownRequestError),
  PrismaClientRustPanicError: () => (PrismaClientRustPanicError),
  PrismaClientUnknownRequestError: () => (PrismaClientUnknownRequestError),
  PrismaClientValidationError: () => (PrismaClientValidationError),
  QueryMode: () => (QueryMode),
  RoleScalarFieldEnum: () => (RoleScalarFieldEnum),
  SortOrder: () => (SortOrder),
  Sql: () => (Sql),
  TransactionIsolationLevel: () => (TransactionIsolationLevel),
  UserScalarFieldEnum: () => (UserScalarFieldEnum),
  defineExtension: () => (defineExtension),
  empty: () => (empty),
  getExtensionContext: () => (getExtensionContext),
  join: () => (join),
  prismaVersion: () => (prismaVersion),
  raw: () => (raw),
  sql: () => (sql)
});
/* import */ var _prisma_client_runtime_client__rspack_import_0 = __webpack_require__("@prisma/client/runtime/client");
/* import */ var _prisma_client_runtime_client__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_prisma_client_runtime_client__rspack_import_0);
/* !!! This is code generated by Prisma. Do not edit directly. !!! */ /* eslint-disable */ // biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * All exports from this file are wrapped under a `Prisma` namespace object in the client.ts file.
 * While this enables partial backward compatibility, it is not part of the stable public API.
 *
 * If you are looking for your Models, Enums, and Input Types, please import them from the respective
 * model files in the `model` directory!
 */ 
/**
 * Prisma Errors
 */ const PrismaClientKnownRequestError = _prisma_client_runtime_client__rspack_import_0.PrismaClientKnownRequestError;
const PrismaClientUnknownRequestError = _prisma_client_runtime_client__rspack_import_0.PrismaClientUnknownRequestError;
const PrismaClientRustPanicError = _prisma_client_runtime_client__rspack_import_0.PrismaClientRustPanicError;
const PrismaClientInitializationError = _prisma_client_runtime_client__rspack_import_0.PrismaClientInitializationError;
const PrismaClientValidationError = _prisma_client_runtime_client__rspack_import_0.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */ const sql = _prisma_client_runtime_client__rspack_import_0.sqltag;
const empty = _prisma_client_runtime_client__rspack_import_0.empty;
const join = _prisma_client_runtime_client__rspack_import_0.join;
const raw = _prisma_client_runtime_client__rspack_import_0.raw;
const Sql = _prisma_client_runtime_client__rspack_import_0.Sql;
/**
 * Decimal.js
 */ const Decimal = _prisma_client_runtime_client__rspack_import_0.Decimal;
const getExtensionContext = _prisma_client_runtime_client__rspack_import_0.Extensions.getExtensionContext;
/**
 * Prisma Client JS version: 7.10.0
 * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
 */ const prismaVersion = {
    client: "7.10.0",
    engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
const NullTypes = {
    DbNull: _prisma_client_runtime_client__rspack_import_0.NullTypes.DbNull,
    JsonNull: _prisma_client_runtime_client__rspack_import_0.NullTypes.JsonNull,
    AnyNull: _prisma_client_runtime_client__rspack_import_0.NullTypes.AnyNull
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */ const DbNull = _prisma_client_runtime_client__rspack_import_0.DbNull;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */ const JsonNull = _prisma_client_runtime_client__rspack_import_0.JsonNull;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */ const AnyNull = _prisma_client_runtime_client__rspack_import_0.AnyNull;
const ModelName = {
    User: 'User',
    Guild: 'Guild',
    Channel: 'Channel',
    Member: 'Member',
    Role: 'Role',
    Message: 'Message',
    Friendship: 'Friendship',
    Invite: 'Invite',
    DirectChannel: 'DirectChannel',
    DirectChannelMember: 'DirectChannelMember'
};
/**
 * Enums
 */ const TransactionIsolationLevel = _prisma_client_runtime_client__rspack_import_0.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
const UserScalarFieldEnum = {
    userId: 'userId',
    userTagId: 'userTagId',
    username: 'username',
    avatarUrl: 'avatarUrl',
    roleTitle: 'roleTitle',
    currentActivity: 'currentActivity',
    lastPresence: 'lastPresence'
};
const GuildScalarFieldEnum = {
    guildId: 'guildId',
    name: 'name',
    iconUrl: 'iconUrl',
    ownerId: 'ownerId',
    memberCount: 'memberCount'
};
const ChannelScalarFieldEnum = {
    channelId: 'channelId',
    guildId: 'guildId',
    name: 'name',
    topic: 'topic',
    icon: 'icon',
    capacity: 'capacity',
    type: 'type',
    categoryId: 'categoryId',
    position: 'position'
};
const MemberScalarFieldEnum = {
    guildId: 'guildId',
    userId: 'userId',
    nickname: 'nickname',
    roleIds: 'roleIds',
    joinedAt: 'joinedAt',
    voiceChannelId: 'voiceChannelId'
};
const RoleScalarFieldEnum = {
    roleId: 'roleId',
    guildId: 'guildId',
    name: 'name',
    permissions: 'permissions',
    position: 'position'
};
const MessageScalarFieldEnum = {
    messageId: 'messageId',
    channelId: 'channelId',
    dmChannelId: 'dmChannelId',
    authorId: 'authorId',
    content: 'content',
    embeds: 'embeds',
    attachments: 'attachments',
    createdAt: 'createdAt',
    editedAt: 'editedAt'
};
const FriendshipScalarFieldEnum = {
    userId: 'userId',
    friendId: 'friendId',
    createdAt: 'createdAt'
};
const InviteScalarFieldEnum = {
    inviteId: 'inviteId',
    guildId: 'guildId',
    code: 'code',
    createdById: 'createdById',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
};
const DirectChannelScalarFieldEnum = {
    channelId: 'channelId',
    userA: 'userA',
    userB: 'userB',
    createdAt: 'createdAt'
};
const DirectChannelMemberScalarFieldEnum = {
    channelId: 'channelId',
    userId: 'userId',
    lastReadMessageId: 'lastReadMessageId'
};
const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
const JsonNullValueInput = {
    JsonNull: JsonNull
};
const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
const NullsOrder = {
    first: 'first',
    last: 'last'
};
const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
const defineExtension = _prisma_client_runtime_client__rspack_import_0.Extensions.defineExtension;


},
"@nestjs/common"(module) {
module.exports = require("@nestjs/common");

},
"@nestjs/core"(module) {
module.exports = require("@nestjs/core");

},
"@nestjs/platform-ws"(module) {
module.exports = require("@nestjs/platform-ws");

},
"@nestjs/websockets"(module) {
module.exports = require("@nestjs/websockets");

},
"@prisma/adapter-pg"(module) {
module.exports = require("@prisma/adapter-pg");

},
"@prisma/client/runtime/client"(module) {
module.exports = require("@prisma/client/runtime/client");

},
"@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"(module) {
module.exports = require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js");

},
"@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js"(module) {
module.exports = require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");

},
"dotenv/config"(module) {
module.exports = require("dotenv/config");

},
"ioredis"(module) {
module.exports = require("ioredis");

},
"kafkajs"(module) {
module.exports = require("kafkajs");

},
"ws"(module) {
module.exports = require("ws");

},
"crypto"(module) {
module.exports = require("crypto");

},
"node:buffer"(module) {
module.exports = require("node:buffer");

},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/create_fake_namespace_object
(() => {
var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
var leafPrototypes;
// create a fake namespace object
// mode & 1: value is a module id, require it
// mode & 2: merge all properties of value into the ns
// mode & 4: return value when already ns object
// mode & 16: return value when it's Promise-like
// mode & 8|1: behave like require
__webpack_require__.t = function(value, mode) {
	if(mode & 1) value = this(value);
	if(mode & 8) return value;
	if(typeof value === 'object' && value) {
		if((mode & 4) && value.__esModule) return value;
		if((mode & 16) && typeof value.then === 'function') return value;
	}
	var ns = Object.create(null);
  __webpack_require__.r(ns);
	var def = {};
	leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
	for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
		Object.getOwnPropertyNames(current).forEach((key) => { def[key] = () => (value[key]) });
	}
	def['default'] = () => (value);
	__webpack_require__.d(ns, def);
	return ns;
};
})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, getters, values) => {
	var define = (defs, kind) => {
		for(var key in defs) {
			if(__webpack_require__.o(defs, key) && !__webpack_require__.o(exports, key)) {
				Object.defineProperty(exports, key, { enumerable: true, [kind]: defs[key] });
			}
		}
	};
	define(getters, "get");
	define(values, "value");
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* import */ var dotenv_config__rspack_import_0 = __webpack_require__("dotenv/config");
/* import */ var dotenv_config__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(dotenv_config__rspack_import_0);
/* import */ var _nestjs_core__rspack_import_1 = __webpack_require__("@nestjs/core");
/* import */ var _nestjs_core__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_nestjs_core__rspack_import_1);
/* import */ var _nestjs_platform_ws__rspack_import_2 = __webpack_require__("@nestjs/platform-ws");
/* import */ var _nestjs_platform_ws__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(_nestjs_platform_ws__rspack_import_2);
/* import */ var _gateway_module__rspack_import_3 = __webpack_require__("./apps/gateway/src/gateway.module.ts");




async function bootstrap() {
    const app = await _nestjs_core__rspack_import_1.NestFactory.create(_gateway_module__rspack_import_3.GatewayModule);
    app.useWebSocketAdapter(new _nestjs_platform_ws__rspack_import_2.WsAdapter(app, {
        maxPayload: 4096
    }));
    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
    });
    app.enableShutdownHooks();
    await app.listen(process.env.GATEWAY_PORT ?? process.env.PORT ?? 3001);
}
void bootstrap();

})();

module.exports = __webpack_exports__;
})()
;
//# sourceMappingURL=main.js.map