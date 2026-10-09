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
        const out = (0,_protocol__rspack_import_3.dispatch)(_protocol__rspack_import_3.Evt.MESSAGE_CREATE, {
            ...v,
            channel_id: channelId,
            message_id: messageId,
            author_id: v.author_id != null ? String(v.author_id) : undefined
        });
        this.registry.remember(channelId, messageId, out);
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
            msg = JSON.parse(raw.toString());
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
            const state = await this.loader.load(String(d?.token ?? ''));
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


class InfoController {
    /** spec: client asks API for best gateway URL (geo/load routing goes here) */ url() {
        return {
            url: process.env.GATEWAY_PUBLIC_URL ?? `ws://localhost:${process.env.PORT ?? 3001}/gateway`
        };
    }
    stats() {
        return this.registry.stats();
    }
    constructor(registry){
        _define_property(this, "registry", void 0);
        this.registry = registry;
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
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], InfoController.prototype, "stats", null);
InfoController = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Controller)('gateway'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registry_service__rspack_import_1.RegistryService === "undefined" ? Object : _registry_service__rspack_import_1.RegistryService
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
        const first = m.size === 0;
        m.set(s.id, s);
        if (!first) return;
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
/* import */ var _protocol__rspack_import_1 = __webpack_require__("./apps/gateway/src/app/protocol.ts");
/* import */ var _prisma_service__rspack_import_2 = __webpack_require__("./apps/gateway/src/app/prisma.service.ts");
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
        if (!_protocol__rspack_import_1.ID_RE.test(token)) return null;
        const userId = BigInt(token);
        const user = await this.prisma.user.findUnique({
            where: {
                userId
            },
            select: {
                username: true
            }
        });
        if (!user) return null;
        const [members, friends] = await Promise.all([
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
            })
        ]);
        const channels = new Map();
        for (const m of members)for (const c of m.guild.channels)channels.set(c.channelId.toString(), m.guildId.toString());
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
        typeof _prisma_service__rspack_import_2.PrismaService === "undefined" ? Object : _prisma_service__rspack_import_2.PrismaService
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
    "inlineSchema": "generator client {\n  provider            = \"prisma-client\"\n  output              = \"../generated/prisma\"\n  moduleFormat        = \"cjs\"\n  importFileExtension = \"\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  // Prisma 7: url lives in prisma config, not here\n}\n\nenum ChannelType {\n  TEXT\n  VOICE\n  CATEGORY\n}\n\n// Minimal stub. Real user table belongs to the larger project.\nmodel User {\n  userId      BigInt       @id @default(autoincrement()) @map(\"user_id\")\n  username    String       @unique\n  guilds      Guild[]      @relation(\"GuildOwner\")\n  members     Member[]\n  messages    Message[]\n  friendships Friendship[] @relation(\"FriendshipUser\")\n  friendOf    Friendship[] @relation(\"FriendshipFriend\")\n\n  @@map(\"user\")\n}\n\nmodel Guild {\n  guildId     BigInt    @id @default(autoincrement()) @map(\"guild_id\")\n  name        String\n  iconUrl     String?   @map(\"icon_url\")\n  ownerId     BigInt    @map(\"owner_id\")\n  memberCount Int       @default(0) @map(\"member_count\")\n  owner       User      @relation(\"GuildOwner\", fields: [ownerId], references: [userId])\n  channels    Channel[]\n  members     Member[]\n  roles       Role[]\n\n  @@index([ownerId])\n  @@map(\"guild\")\n}\n\nmodel Channel {\n  channelId  BigInt      @id @default(autoincrement()) @map(\"channel_id\")\n  guildId    BigInt      @map(\"guild_id\")\n  name       String\n  type       ChannelType @default(TEXT)\n  categoryId BigInt?     @map(\"category_id\")\n  position   Int         @default(0)\n  guild      Guild       @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  category   Channel?    @relation(\"Category\", fields: [categoryId], references: [channelId], onDelete: SetNull)\n  children   Channel[]   @relation(\"Category\")\n  messages   Message[]\n\n  @@index([guildId, position])\n  @@map(\"channel\")\n}\n\nmodel Member {\n  guildId  BigInt   @map(\"guild_id\")\n  userId   BigInt   @map(\"user_id\")\n  nickname String?\n  roleIds  Json     @default(\"[]\") @map(\"role_ids\")\n  joinedAt DateTime @default(now()) @map(\"joined_at\")\n  guild    Guild    @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  user     User     @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@id([guildId, userId])\n  @@index([userId])\n  @@map(\"member\")\n}\n\nmodel Role {\n  roleId      BigInt @id @default(autoincrement()) @map(\"role_id\")\n  guildId     BigInt @map(\"guild_id\")\n  name        String\n  permissions BigInt @default(0)\n  position    Int    @default(0)\n  guild       Guild  @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n\n  @@index([guildId])\n  @@map(\"role\")\n}\n\nmodel Message {\n  messageId   BigInt    @id @default(autoincrement()) @map(\"message_id\")\n  channelId   BigInt    @map(\"channel_id\")\n  authorId    BigInt    @map(\"author_id\")\n  content     String\n  embeds      Json?\n  attachments Json?\n  createdAt   DateTime  @default(now()) @map(\"created_at\")\n  editedAt    DateTime? @map(\"edited_at\")\n  channel     Channel   @relation(fields: [channelId], references: [channelId], onDelete: Cascade)\n  author      User      @relation(fields: [authorId], references: [userId])\n\n  @@index([channelId, messageId])\n  @@map(\"message\")\n}\n\nmodel Friendship {\n  userId    BigInt   @map(\"user_id\")\n  friendId  BigInt   @map(\"friend_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  user      User     @relation(\"FriendshipUser\", fields: [userId], references: [userId], onDelete: Cascade)\n  friend    User     @relation(\"FriendshipFriend\", fields: [friendId], references: [userId], onDelete: Cascade)\n\n  @@id([userId, friendId])\n  @@index([friendId])\n  @@map(\"friendship\")\n}\n",
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
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"guilds\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildOwner\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToUser\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"MessageToUser\"},{\"name\":\"friendships\",\"kind\":\"object\",\"type\":\"Friendship\",\"relationName\":\"FriendshipUser\"},{\"name\":\"friendOf\",\"kind\":\"object\",\"type\":\"Friendship\",\"relationName\":\"FriendshipFriend\"}],\"dbName\":\"user\",\"schema\":null},\"Guild\":{\"fields\":[{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"iconUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"icon_url\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"owner_id\"},{\"name\":\"memberCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"member_count\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GuildOwner\"},{\"name\":\"channels\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"ChannelToGuild\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"GuildToMember\"},{\"name\":\"roles\",\"kind\":\"object\",\"type\":\"Role\",\"relationName\":\"GuildToRole\"}],\"dbName\":\"guild\",\"schema\":null},\"Channel\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"ChannelType\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"category_id\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"ChannelToGuild\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"Category\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"Category\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"ChannelToMessage\"}],\"dbName\":\"channel\",\"schema\":null},\"Member\":{\"fields\":[{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"nickname\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roleIds\",\"kind\":\"scalar\",\"type\":\"Json\",\"dbName\":\"role_ids\"},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"joined_at\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MemberToUser\"}],\"dbName\":\"member\",\"schema\":null},\"Role\":{\"fields\":[{\"name\":\"roleId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"role_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToRole\"}],\"dbName\":\"role\",\"schema\":null},\"Message\":{\"fields\":[{\"name\":\"messageId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"message_id\"},{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"author_id\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"embeds\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"attachments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"editedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"edited_at\"},{\"name\":\"channel\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"ChannelToMessage\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MessageToUser\"}],\"dbName\":\"message\",\"schema\":null},\"Friendship\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"friendId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"friend_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FriendshipUser\"},{\"name\":\"friend\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FriendshipFriend\"}],\"dbName\":\"friendship\",\"schema\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"owner\",\"guild\",\"category\",\"children\",\"channel\",\"author\",\"messages\",\"_count\",\"channels\",\"user\",\"members\",\"roles\",\"guilds\",\"friend\",\"friendships\",\"friendOf\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Guild.findUnique\",\"Guild.findUniqueOrThrow\",\"Guild.findFirst\",\"Guild.findFirstOrThrow\",\"Guild.findMany\",\"Guild.createOne\",\"Guild.createMany\",\"Guild.createManyAndReturn\",\"Guild.updateOne\",\"Guild.updateMany\",\"Guild.updateManyAndReturn\",\"Guild.upsertOne\",\"Guild.deleteOne\",\"Guild.deleteMany\",\"Guild.groupBy\",\"Guild.aggregate\",\"Channel.findUnique\",\"Channel.findUniqueOrThrow\",\"Channel.findFirst\",\"Channel.findFirstOrThrow\",\"Channel.findMany\",\"Channel.createOne\",\"Channel.createMany\",\"Channel.createManyAndReturn\",\"Channel.updateOne\",\"Channel.updateMany\",\"Channel.updateManyAndReturn\",\"Channel.upsertOne\",\"Channel.deleteOne\",\"Channel.deleteMany\",\"Channel.groupBy\",\"Channel.aggregate\",\"Member.findUnique\",\"Member.findUniqueOrThrow\",\"Member.findFirst\",\"Member.findFirstOrThrow\",\"Member.findMany\",\"Member.createOne\",\"Member.createMany\",\"Member.createManyAndReturn\",\"Member.updateOne\",\"Member.updateMany\",\"Member.updateManyAndReturn\",\"Member.upsertOne\",\"Member.deleteOne\",\"Member.deleteMany\",\"Member.groupBy\",\"Member.aggregate\",\"Role.findUnique\",\"Role.findUniqueOrThrow\",\"Role.findFirst\",\"Role.findFirstOrThrow\",\"Role.findMany\",\"Role.createOne\",\"Role.createMany\",\"Role.createManyAndReturn\",\"Role.updateOne\",\"Role.updateMany\",\"Role.updateManyAndReturn\",\"Role.upsertOne\",\"Role.deleteOne\",\"Role.deleteMany\",\"Role.groupBy\",\"Role.aggregate\",\"Message.findUnique\",\"Message.findUniqueOrThrow\",\"Message.findFirst\",\"Message.findFirstOrThrow\",\"Message.findMany\",\"Message.createOne\",\"Message.createMany\",\"Message.createManyAndReturn\",\"Message.updateOne\",\"Message.updateMany\",\"Message.updateManyAndReturn\",\"Message.upsertOne\",\"Message.deleteOne\",\"Message.deleteMany\",\"Message.groupBy\",\"Message.aggregate\",\"Friendship.findUnique\",\"Friendship.findUniqueOrThrow\",\"Friendship.findFirst\",\"Friendship.findFirstOrThrow\",\"Friendship.findMany\",\"Friendship.createOne\",\"Friendship.createMany\",\"Friendship.createManyAndReturn\",\"Friendship.updateOne\",\"Friendship.updateMany\",\"Friendship.updateManyAndReturn\",\"Friendship.upsertOne\",\"Friendship.deleteOne\",\"Friendship.deleteMany\",\"Friendship.groupBy\",\"Friendship.aggregate\",\"AND\",\"OR\",\"NOT\",\"userId\",\"friendId\",\"createdAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"messageId\",\"channelId\",\"authorId\",\"content\",\"embeds\",\"attachments\",\"editedAt\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"contains\",\"startsWith\",\"endsWith\",\"roleId\",\"guildId\",\"name\",\"permissions\",\"position\",\"nickname\",\"roleIds\",\"joinedAt\",\"ChannelType\",\"type\",\"categoryId\",\"iconUrl\",\"ownerId\",\"memberCount\",\"username\",\"every\",\"some\",\"none\",\"userId_friendId\",\"guildId_userId\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "jgRKcAoJAADyAQAgDQAA8QEAIA8AAPABACARAADzAQAgEgAA8wEAIIsBAADtAQAwjAEAACsAEI0BAADtAQAwjgEEAAAAAbcBAQAAAAEBAAAAAQAgDAMAAPcBACALAACHAgAgDQAA8QEAIA4AAIkCACCLAQAAiAIAMIwBAAADABCNAQAAiAIAMKoBBADuAQAhqwEBAO8BACG0AQEA_QEAIbUBBADuAQAhtgECAPkBACEFAwAAzgMAIAsAANEDACANAADLAwAgDgAA0gMAILQBAACVAgAgDAMAAPcBACALAACHAgAgDQAA8QEAIA4AAIkCACCLAQAAiAIAMIwBAAADABCNAQAAiAIAMKoBBAAAAAGrAQEA7wEAIbQBAQD9AQAhtQEEAO4BACG2AQIA-QEAIQMAAAADACABAAAEADACAAAFACANBAAA-gEAIAUAAIYCACAGAACHAgAgCQAA8gEAIIsBAACDAgAwjAEAAAcAEI0BAACDAgAwmgEEAO4BACGqAQQA7gEAIasBAQDvAQAhrQECAPkBACGyAQAAhAKyASKzAQQAhQIAIQUEAADPAwAgBQAA0AMAIAYAANEDACAJAADMAwAgswEAAJUCACANBAAA-gEAIAUAAIYCACAGAACHAgAgCQAA8gEAIIsBAACDAgAwjAEAAAcAEI0BAACDAgAwmgEEAAAAAaoBBADuAQAhqwEBAO8BACGtAQIA-QEAIbIBAACEArIBIrMBBACFAgAhAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAAHACADAAAABwAgAQAACAAwAgAACQAgDQcAAIICACAIAAD3AQAgiwEAAP8BADCMAQAADQAQjQEAAP8BADCQAUAA9gEAIZkBBADuAQAhmgEEAO4BACGbAQQA7gEAIZwBAQDvAQAhnQEAAIACACCeAQAAgAIAIJ8BQACBAgAhBQcAANADACAIAADOAwAgnQEAAJUCACCeAQAAlQIAIJ8BAACVAgAgDQcAAIICACAIAAD3AQAgiwEAAP8BADCMAQAADQAQjQEAAP8BADCQAUAA9gEAIZkBBAAAAAGaAQQA7gEAIZsBBADuAQAhnAEBAO8BACGdAQAAgAIAIJ4BAACAAgAgnwFAAIECACEDAAAADQAgAQAADgAwAgAADwAgAQAAAAcAIAEAAAANACAKBAAA-gEAIAwAAPcBACCLAQAA_AEAMIwBAAATABCNAQAA_AEAMI4BBADuAQAhqgEEAO4BACGuAQEA_QEAIa8BAAD-AQAgsAFAAPYBACEDBAAAzwMAIAwAAM4DACCuAQAAlQIAIAsEAAD6AQAgDAAA9wEAIIsBAAD8AQAwjAEAABMAEI0BAAD8AQAwjgEEAO4BACGqAQQA7gEAIa4BAQD9AQAhrwEAAP4BACCwAUAA9gEAIbwBAAD7AQAgAwAAABMAIAEAABQAMAIAABUAIAkEAAD6AQAgiwEAAPgBADCMAQAAFwAQjQEAAPgBADCpAQQA7gEAIaoBBADuAQAhqwEBAO8BACGsAQQA7gEAIa0BAgD5AQAhAQQAAM8DACAJBAAA-gEAIIsBAAD4AQAwjAEAABcAEI0BAAD4AQAwqQEEAAAAAaoBBADuAQAhqwEBAO8BACGsAQQA7gEAIa0BAgD5AQAhAwAAABcAIAEAABgAMAIAABkAIAEAAAAHACABAAAAEwAgAQAAABcAIAMAAAATACABAAAUADACAAAVACADAAAADQAgAQAADgAwAgAADwAgCAwAAPcBACAQAAD3AQAgiwEAAPUBADCMAQAAIAAQjQEAAPUBADCOAQQA7gEAIY8BBADuAQAhkAFAAPYBACECDAAAzgMAIBAAAM4DACAJDAAA9wEAIBAAAPcBACCLAQAA9QEAMIwBAAAgABCNAQAA9QEAMI4BBADuAQAhjwEEAO4BACGQAUAA9gEAIbsBAAD0AQAgAwAAACAAIAEAACEAMAIAACIAIAMAAAAgACABAAAhADACAAAiACABAAAAAwAgAQAAABMAIAEAAAANACABAAAAIAAgAQAAACAAIAEAAAABACAKCQAA8gEAIA0AAPEBACAPAADwAQAgEQAA8wEAIBIAAPMBACCLAQAA7QEAMIwBAAArABCNAQAA7QEAMI4BBADuAQAhtwEBAO8BACEFCQAAzAMAIA0AAMsDACAPAADKAwAgEQAAzQMAIBIAAM0DACADAAAAKwAgAQAALAAwAgAAAQAgAwAAACsAIAEAACwAMAIAAAEAIAMAAAArACABAAAsADACAAABACAHCQAAxwMAIA0AAMYDACAPAADFAwAgEQAAyAMAIBIAAMkDACCOAQQAAAABtwEBAAAAAQEYAAAwACACjgEEAAAAAbcBAQAAAAEBGAAAMgAwARgAADIAMAcJAACPAwAgDQAAjgMAIA8AAI0DACARAACQAwAgEgAAkQMAII4BBACQAgAhtwEBAJsCACECAAAAAQAgGAAANQAgAo4BBACQAgAhtwEBAJsCACECAAAAKwAgGAAANwAgAgAAACsAIBgAADcAIAMAAAABACAfAAAwACAgAAA1ACABAAAAAQAgAQAAACsAIAUKAACIAwAgJQAAiQMAICYAAIwDACAnAACLAwAgKAAAigMAIAWLAQAA7AEAMIwBAAA-ABCNAQAA7AEAMI4BBADIAQAhtwEBANEBACEDAAAAKwAgAQAAPQAwJAAAPgAgAwAAACsAIAEAACwAMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAIQDACALAACFAwAgDQAAhgMAIA4AAIcDACCqAQQAAAABqwEBAAAAAbQBAQAAAAG1AQQAAAABtgECAAAAAQEYAABGACAFqgEEAAAAAasBAQAAAAG0AQEAAAABtQEEAAAAAbYBAgAAAAEBGAAASAAwARgAAEgAMAkDAADfAgAgCwAA4AIAIA0AAOECACAOAADiAgAgqgEEAJACACGrAQEAmwIAIbQBAQCuAgAhtQEEAJACACG2AQIApgIAIQIAAAAFACAYAABLACAFqgEEAJACACGrAQEAmwIAIbQBAQCuAgAhtQEEAJACACG2AQIApgIAIQIAAAADACAYAABNACACAAAAAwAgGAAATQAgAwAAAAUAIB8AAEYAICAAAEsAIAEAAAAFACABAAAAAwAgBgoAANoCACAlAADbAgAgJgAA3gIAICcAAN0CACAoAADcAgAgtAEAAJUCACAIiwEAAOsBADCMAQAAVAAQjQEAAOsBADCqAQQAyAEAIasBAQDRAQAhtAEBAN4BACG1AQQAyAEAIbYBAgDbAQAhAwAAAAMAIAEAAFMAMCQAAFQAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAoEAADWAgAgBQAA2QIAIAYAANcCACAJAADYAgAgmgEEAAAAAaoBBAAAAAGrAQEAAAABrQECAAAAAbIBAAAAsgECswEEAAAAAQEYAABcACAGmgEEAAAAAaoBBAAAAAGrAQEAAAABrQECAAAAAbIBAAAAsgECswEEAAAAAQEYAABeADABGAAAXgAwAQAAAAcAIAoEAAC6AgAgBQAAuwIAIAYAALwCACAJAAC9AgAgmgEEAJACACGqAQQAkAIAIasBAQCbAgAhrQECAKYCACGyAQAAuAKyASKzAQQAuQIAIQIAAAAJACAYAABiACAGmgEEAJACACGqAQQAkAIAIasBAQCbAgAhrQECAKYCACGyAQAAuAKyASKzAQQAuQIAIQIAAAAHACAYAABkACACAAAABwAgGAAAZAAgAQAAAAcAIAMAAAAJACAfAABcACAgAABiACABAAAACQAgAQAAAAcAIAYKAACzAgAgJQAAtAIAICYAALcCACAnAAC2AgAgKAAAtQIAILMBAACVAgAgCYsBAADjAQAwjAEAAGwAEI0BAADjAQAwmgEEAMgBACGqAQQAyAEAIasBAQDRAQAhrQECANsBACGyAQAA5AGyASKzAQQA5QEAIQMAAAAHACABAABrADAkAABsACADAAAABwAgAQAACAAwAgAACQAgAQAAABUAIAEAAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACAHBAAAsQIAIAwAALICACCOAQQAAAABqgEEAAAAAa4BAQAAAAGvAYAAAAABsAFAAAAAAQEYAAB0ACAFjgEEAAAAAaoBBAAAAAGuAQEAAAABrwGAAAAAAbABQAAAAAEBGAAAdgAwARgAAHYAMAcEAACvAgAgDAAAsAIAII4BBACQAgAhqgEEAJACACGuAQEArgIAIa8BgAAAAAGwAUAAjwIAIQIAAAAVACAYAAB5ACAFjgEEAJACACGqAQQAkAIAIa4BAQCuAgAhrwGAAAAAAbABQACPAgAhAgAAABMAIBgAAHsAIAIAAAATACAYAAB7ACADAAAAFQAgHwAAdAAgIAAAeQAgAQAAABUAIAEAAAATACAGCgAAqQIAICUAAKoCACAmAACtAgAgJwAArAIAICgAAKsCACCuAQAAlQIAIAiLAQAA3QEAMIwBAACCAQAQjQEAAN0BADCOAQQAyAEAIaoBBADIAQAhrgEBAN4BACGvAQAA3wEAILABQADJAQAhAwAAABMAIAEAAIEBADAkAACCAQAgAwAAABMAIAEAABQAMAIAABUAIAEAAAAZACABAAAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgBgQAAKgCACCpAQQAAAABqgEEAAAAAasBAQAAAAGsAQQAAAABrQECAAAAAQEYAACKAQAgBakBBAAAAAGqAQQAAAABqwEBAAAAAawBBAAAAAGtAQIAAAABARgAAIwBADABGAAAjAEAMAYEAACnAgAgqQEEAJACACGqAQQAkAIAIasBAQCbAgAhrAEEAJACACGtAQIApgIAIQIAAAAZACAYAACPAQAgBakBBACQAgAhqgEEAJACACGrAQEAmwIAIawBBACQAgAhrQECAKYCACECAAAAFwAgGAAAkQEAIAIAAAAXACAYAACRAQAgAwAAABkAIB8AAIoBACAgAACPAQAgAQAAABkAIAEAAAAXACAFCgAAoQIAICUAAKICACAmAAClAgAgJwAApAIAICgAAKMCACAIiwEAANoBADCMAQAAmAEAEI0BAADaAQAwqQEEAMgBACGqAQQAyAEAIasBAQDRAQAhrAEEAMgBACGtAQIA2wEAIQMAAAAXACABAACXAQAwJAAAmAEAIAMAAAAXACABAAAYADACAAAZACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAoHAACfAgAgCAAAoAIAIJABQAAAAAGZAQQAAAABmgEEAAAAAZsBBAAAAAGcAQEAAAABnQGAAAAAAZ4BgAAAAAGfAUAAAAABARgAAKABACAIkAFAAAAAAZkBBAAAAAGaAQQAAAABmwEEAAAAAZwBAQAAAAGdAYAAAAABngGAAAAAAZ8BQAAAAAEBGAAAogEAMAEYAACiAQAwCgcAAJ0CACAIAACeAgAgkAFAAI8CACGZAQQAkAIAIZoBBACQAgAhmwEEAJACACGcAQEAmwIAIZ0BgAAAAAGeAYAAAAABnwFAAJwCACECAAAADwAgGAAApQEAIAiQAUAAjwIAIZkBBACQAgAhmgEEAJACACGbAQQAkAIAIZwBAQCbAgAhnQGAAAAAAZ4BgAAAAAGfAUAAnAIAIQIAAAANACAYAACnAQAgAgAAAA0AIBgAAKcBACADAAAADwAgHwAAoAEAICAAAKUBACABAAAADwAgAQAAAA0AIAgKAACWAgAgJQAAlwIAICYAAJoCACAnAACZAgAgKAAAmAIAIJ0BAACVAgAgngEAAJUCACCfAQAAlQIAIAuLAQAA0AEAMIwBAACuAQAQjQEAANABADCQAUAAyQEAIZkBBADIAQAhmgEEAMgBACGbAQQAyAEAIZwBAQDRAQAhnQEAANIBACCeAQAA0gEAIJ8BQADTAQAhAwAAAA0AIAEAAK0BADAkAACuAQAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAiACABAAAAIgAgAwAAACAAIAEAACEAMAIAACIAIAMAAAAgACABAAAhADACAAAiACADAAAAIAAgAQAAIQAwAgAAIgAgBQwAAJMCACAQAACUAgAgjgEEAAAAAY8BBAAAAAGQAUAAAAABARgAALYBACADjgEEAAAAAY8BBAAAAAGQAUAAAAABARgAALgBADABGAAAuAEAMAUMAACRAgAgEAAAkgIAII4BBACQAgAhjwEEAJACACGQAUAAjwIAIQIAAAAiACAYAAC7AQAgA44BBACQAgAhjwEEAJACACGQAUAAjwIAIQIAAAAgACAYAAC9AQAgAgAAACAAIBgAAL0BACADAAAAIgAgHwAAtgEAICAAALsBACABAAAAIgAgAQAAACAAIAUKAACKAgAgJQAAiwIAICYAAI4CACAnAACNAgAgKAAAjAIAIAaLAQAAxwEAMIwBAADEAQAQjQEAAMcBADCOAQQAyAEAIY8BBADIAQAhkAFAAMkBACEDAAAAIAAgAQAAwwEAMCQAAMQBACADAAAAIAAgAQAAIQAwAgAAIgAgBosBAADHAQAwjAEAAMQBABCNAQAAxwEAMI4BBADIAQAhjwEEAMgBACGQAUAAyQEAIQ0KAADLAQAgJQAAzgEAICYAAM8BACAnAADPAQAgKAAAzwEAIJEBBAAAAAGSAQQAAAAEkwEEAAAABJQBBAAAAAGVAQQAAAABlgEEAAAAAZcBBAAAAAGYAQQAzQEAIQsKAADLAQAgJwAAzAEAICgAAMwBACCRAUAAAAABkgFAAAAABJMBQAAAAASUAUAAAAABlQFAAAAAAZYBQAAAAAGXAUAAAAABmAFAAMoBACELCgAAywEAICcAAMwBACAoAADMAQAgkQFAAAAAAZIBQAAAAASTAUAAAAAElAFAAAAAAZUBQAAAAAGWAUAAAAABlwFAAAAAAZgBQADKAQAhCJEBAgAAAAGSAQIAAAAEkwECAAAABJQBAgAAAAGVAQIAAAABlgECAAAAAZcBAgAAAAGYAQIAywEAIQiRAUAAAAABkgFAAAAABJMBQAAAAASUAUAAAAABlQFAAAAAAZYBQAAAAAGXAUAAAAABmAFAAMwBACENCgAAywEAICUAAM4BACAmAADPAQAgJwAAzwEAICgAAM8BACCRAQQAAAABkgEEAAAABJMBBAAAAASUAQQAAAABlQEEAAAAAZYBBAAAAAGXAQQAAAABmAEEAM0BACEIkQEIAAAAAZIBCAAAAASTAQgAAAAElAEIAAAAAZUBCAAAAAGWAQgAAAABlwEIAAAAAZgBCADOAQAhCJEBBAAAAAGSAQQAAAAEkwEEAAAABJQBBAAAAAGVAQQAAAABlgEEAAAAAZcBBAAAAAGYAQQAzwEAIQuLAQAA0AEAMIwBAACuAQAQjQEAANABADCQAUAAyQEAIZkBBADIAQAhmgEEAMgBACGbAQQAyAEAIZwBAQDRAQAhnQEAANIBACCeAQAA0gEAIJ8BQADTAQAhDgoAAMsBACAnAADZAQAgKAAA2QEAIJEBAQAAAAGSAQEAAAAEkwEBAAAABJQBAQAAAAGVAQEAAAABlgEBAAAAAZcBAQAAAAGYAQEA2AEAIaYBAQAAAAGnAQEAAAABqAEBAAAAAQ8KAADVAQAgJwAA1wEAICgAANcBACCRAYAAAAABlAGAAAAAAZUBgAAAAAGWAYAAAAABlwGAAAAAAZgBgAAAAAGgAQEAAAABoQEBAAAAAaIBAQAAAAGjAYAAAAABpAGAAAAAAaUBgAAAAAELCgAA1QEAICcAANYBACAoAADWAQAgkQFAAAAAAZIBQAAAAAWTAUAAAAAFlAFAAAAAAZUBQAAAAAGWAUAAAAABlwFAAAAAAZgBQADUAQAhCwoAANUBACAnAADWAQAgKAAA1gEAIJEBQAAAAAGSAUAAAAAFkwFAAAAABZQBQAAAAAGVAUAAAAABlgFAAAAAAZcBQAAAAAGYAUAA1AEAIQiRAQIAAAABkgECAAAABZMBAgAAAAWUAQIAAAABlQECAAAAAZYBAgAAAAGXAQIAAAABmAECANUBACEIkQFAAAAAAZIBQAAAAAWTAUAAAAAFlAFAAAAAAZUBQAAAAAGWAUAAAAABlwFAAAAAAZgBQADWAQAhDJEBgAAAAAGUAYAAAAABlQGAAAAAAZYBgAAAAAGXAYAAAAABmAGAAAAAAaABAQAAAAGhAQEAAAABogEBAAAAAaMBgAAAAAGkAYAAAAABpQGAAAAAAQ4KAADLAQAgJwAA2QEAICgAANkBACCRAQEAAAABkgEBAAAABJMBAQAAAASUAQEAAAABlQEBAAAAAZYBAQAAAAGXAQEAAAABmAEBANgBACGmAQEAAAABpwEBAAAAAagBAQAAAAELkQEBAAAAAZIBAQAAAASTAQEAAAAElAEBAAAAAZUBAQAAAAGWAQEAAAABlwEBAAAAAZgBAQDZAQAhpgEBAAAAAacBAQAAAAGoAQEAAAABCIsBAADaAQAwjAEAAJgBABCNAQAA2gEAMKkBBADIAQAhqgEEAMgBACGrAQEA0QEAIawBBADIAQAhrQECANsBACENCgAAywEAICUAAM4BACAmAADLAQAgJwAAywEAICgAAMsBACCRAQIAAAABkgECAAAABJMBAgAAAASUAQIAAAABlQECAAAAAZYBAgAAAAGXAQIAAAABmAECANwBACENCgAAywEAICUAAM4BACAmAADLAQAgJwAAywEAICgAAMsBACCRAQIAAAABkgECAAAABJMBAgAAAASUAQIAAAABlQECAAAAAZYBAgAAAAGXAQIAAAABmAECANwBACEIiwEAAN0BADCMAQAAggEAEI0BAADdAQAwjgEEAMgBACGqAQQAyAEAIa4BAQDeAQAhrwEAAN8BACCwAUAAyQEAIQ4KAADVAQAgJwAA4gEAICgAAOIBACCRAQEAAAABkgEBAAAABZMBAQAAAAWUAQEAAAABlQEBAAAAAZYBAQAAAAGXAQEAAAABmAEBAOEBACGmAQEAAAABpwEBAAAAAagBAQAAAAEPCgAAywEAICcAAOABACAoAADgAQAgkQGAAAAAAZQBgAAAAAGVAYAAAAABlgGAAAAAAZcBgAAAAAGYAYAAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowGAAAAAAaQBgAAAAAGlAYAAAAABDJEBgAAAAAGUAYAAAAABlQGAAAAAAZYBgAAAAAGXAYAAAAABmAGAAAAAAaABAQAAAAGhAQEAAAABogEBAAAAAaMBgAAAAAGkAYAAAAABpQGAAAAAAQ4KAADVAQAgJwAA4gEAICgAAOIBACCRAQEAAAABkgEBAAAABZMBAQAAAAWUAQEAAAABlQEBAAAAAZYBAQAAAAGXAQEAAAABmAEBAOEBACGmAQEAAAABpwEBAAAAAagBAQAAAAELkQEBAAAAAZIBAQAAAAWTAQEAAAAFlAEBAAAAAZUBAQAAAAGWAQEAAAABlwEBAAAAAZgBAQDiAQAhpgEBAAAAAacBAQAAAAGoAQEAAAABCYsBAADjAQAwjAEAAGwAEI0BAADjAQAwmgEEAMgBACGqAQQAyAEAIasBAQDRAQAhrQECANsBACGyAQAA5AGyASKzAQQA5QEAIQcKAADLAQAgJwAA6gEAICgAAOoBACCRAQAAALIBApIBAAAAsgEIkwEAAACyAQiYAQAA6QGyASINCgAA1QEAICUAAOcBACAmAADoAQAgJwAA6AEAICgAAOgBACCRAQQAAAABkgEEAAAABZMBBAAAAAWUAQQAAAABlQEEAAAAAZYBBAAAAAGXAQQAAAABmAEEAOYBACENCgAA1QEAICUAAOcBACAmAADoAQAgJwAA6AEAICgAAOgBACCRAQQAAAABkgEEAAAABZMBBAAAAAWUAQQAAAABlQEEAAAAAZYBBAAAAAGXAQQAAAABmAEEAOYBACEIkQEIAAAAAZIBCAAAAAWTAQgAAAAFlAEIAAAAAZUBCAAAAAGWAQgAAAABlwEIAAAAAZgBCADnAQAhCJEBBAAAAAGSAQQAAAAFkwEEAAAABZQBBAAAAAGVAQQAAAABlgEEAAAAAZcBBAAAAAGYAQQA6AEAIQcKAADLAQAgJwAA6gEAICgAAOoBACCRAQAAALIBApIBAAAAsgEIkwEAAACyAQiYAQAA6QGyASIEkQEAAACyAQKSAQAAALIBCJMBAAAAsgEImAEAAOoBsgEiCIsBAADrAQAwjAEAAFQAEI0BAADrAQAwqgEEAMgBACGrAQEA0QEAIbQBAQDeAQAhtQEEAMgBACG2AQIA2wEAIQWLAQAA7AEAMIwBAAA-ABCNAQAA7AEAMI4BBADIAQAhtwEBANEBACEKCQAA8gEAIA0AAPEBACAPAADwAQAgEQAA8wEAIBIAAPMBACCLAQAA7QEAMIwBAAArABCNAQAA7QEAMI4BBADuAQAhtwEBAO8BACEIkQEEAAAAAZIBBAAAAASTAQQAAAAElAEEAAAAAZUBBAAAAAGWAQQAAAABlwEEAAAAAZgBBADPAQAhC5EBAQAAAAGSAQEAAAAEkwEBAAAABJQBAQAAAAGVAQEAAAABlgEBAAAAAZcBAQAAAAGYAQEA2QEAIaYBAQAAAAGnAQEAAAABqAEBAAAAAQO4AQAAAwAguQEAAAMAILoBAAADACADuAEAABMAILkBAAATACC6AQAAEwAgA7gBAAANACC5AQAADQAgugEAAA0AIAO4AQAAIAAguQEAACAAILoBAAAgACACjgEEAAAAAY8BBAAAAAEIDAAA9wEAIBAAAPcBACCLAQAA9QEAMIwBAAAgABCNAQAA9QEAMI4BBADuAQAhjwEEAO4BACGQAUAA9gEAIQiRAUAAAAABkgFAAAAABJMBQAAAAASUAUAAAAABlQFAAAAAAZYBQAAAAAGXAUAAAAABmAFAAMwBACEMCQAA8gEAIA0AAPEBACAPAADwAQAgEQAA8wEAIBIAAPMBACCLAQAA7QEAMIwBAAArABCNAQAA7QEAMI4BBADuAQAhtwEBAO8BACG9AQAAKwAgvgEAACsAIAkEAAD6AQAgiwEAAPgBADCMAQAAFwAQjQEAAPgBADCpAQQA7gEAIaoBBADuAQAhqwEBAO8BACGsAQQA7gEAIa0BAgD5AQAhCJEBAgAAAAGSAQIAAAAEkwECAAAABJQBAgAAAAGVAQIAAAABlgECAAAAAZcBAgAAAAGYAQIAywEAIQ4DAAD3AQAgCwAAhwIAIA0AAPEBACAOAACJAgAgiwEAAIgCADCMAQAAAwAQjQEAAIgCADCqAQQA7gEAIasBAQDvAQAhtAEBAP0BACG1AQQA7gEAIbYBAgD5AQAhvQEAAAMAIL4BAAADACACjgEEAAAAAaoBBAAAAAEKBAAA-gEAIAwAAPcBACCLAQAA_AEAMIwBAAATABCNAQAA_AEAMI4BBADuAQAhqgEEAO4BACGuAQEA_QEAIa8BAAD-AQAgsAFAAPYBACELkQEBAAAAAZIBAQAAAAWTAQEAAAAFlAEBAAAAAZUBAQAAAAGWAQEAAAABlwEBAAAAAZgBAQDiAQAhpgEBAAAAAacBAQAAAAGoAQEAAAABDJEBgAAAAAGUAYAAAAABlQGAAAAAAZYBgAAAAAGXAYAAAAABmAGAAAAAAaABAQAAAAGhAQEAAAABogEBAAAAAaMBgAAAAAGkAYAAAAABpQGAAAAAAQ0HAACCAgAgCAAA9wEAIIsBAAD_AQAwjAEAAA0AEI0BAAD_AQAwkAFAAPYBACGZAQQA7gEAIZoBBADuAQAhmwEEAO4BACGcAQEA7wEAIZ0BAACAAgAgngEAAIACACCfAUAAgQIAIQyRAYAAAAABlAGAAAAAAZUBgAAAAAGWAYAAAAABlwGAAAAAAZgBgAAAAAGgAQEAAAABoQEBAAAAAaIBAQAAAAGjAYAAAAABpAGAAAAAAaUBgAAAAAEIkQFAAAAAAZIBQAAAAAWTAUAAAAAFlAFAAAAAAZUBQAAAAAGWAUAAAAABlwFAAAAAAZgBQADWAQAhDwQAAPoBACAFAACGAgAgBgAAhwIAIAkAAPIBACCLAQAAgwIAMIwBAAAHABCNAQAAgwIAMJoBBADuAQAhqgEEAO4BACGrAQEA7wEAIa0BAgD5AQAhsgEAAIQCsgEiswEEAIUCACG9AQAABwAgvgEAAAcAIA0EAAD6AQAgBQAAhgIAIAYAAIcCACAJAADyAQAgiwEAAIMCADCMAQAABwAQjQEAAIMCADCaAQQA7gEAIaoBBADuAQAhqwEBAO8BACGtAQIA-QEAIbIBAACEArIBIrMBBACFAgAhBJEBAAAAsgECkgEAAACyAQiTAQAAALIBCJgBAADqAbIBIgiRAQQAAAABkgEEAAAABZMBBAAAAAWUAQQAAAABlQEEAAAAAZYBBAAAAAGXAQQAAAABmAEEAOgBACEPBAAA-gEAIAUAAIYCACAGAACHAgAgCQAA8gEAIIsBAACDAgAwjAEAAAcAEI0BAACDAgAwmgEEAO4BACGqAQQA7gEAIasBAQDvAQAhrQECAPkBACGyAQAAhAKyASKzAQQAhQIAIb0BAAAHACC-AQAABwAgA7gBAAAHACC5AQAABwAgugEAAAcAIAwDAAD3AQAgCwAAhwIAIA0AAPEBACAOAACJAgAgiwEAAIgCADCMAQAAAwAQjQEAAIgCADCqAQQA7gEAIasBAQDvAQAhtAEBAP0BACG1AQQA7gEAIbYBAgD5AQAhA7gBAAAXACC5AQAAFwAgugEAABcAIAAAAAAAAcIBQAAAAAEFwgEEAAAAAcgBBAAAAAHJAQQAAAABygEEAAAAAcsBBAAAAAEFHwAAhwQAICAAAI0EACC_AQAAiAQAIMABAACMBAAgxQEAAAEAIAUfAACFBAAgIAAAigQAIL8BAACGBAAgwAEAAIkEACDFAQAAAQAgAx8AAIcEACC_AQAAiAQAIMUBAAABACADHwAAhQQAIL8BAACGBAAgxQEAAAEAIAAAAAAAAAHCAQEAAAABAcIBQAAAAAEFHwAA_QMAICAAAIMEACC_AQAA_gMAIMABAACCBAAgxQEAAAkAIAUfAAD7AwAgIAAAgAQAIL8BAAD8AwAgwAEAAP8DACDFAQAAAQAgAx8AAP0DACC_AQAA_gMAIMUBAAAJACADHwAA-wMAIL8BAAD8AwAgxQEAAAEAIAAAAAAABcIBAgAAAAHIAQIAAAAByQECAAAAAcoBAgAAAAHLAQIAAAABBR8AAPYDACAgAAD5AwAgvwEAAPcDACDAAQAA-AMAIMUBAAAFACADHwAA9gMAIL8BAAD3AwAgxQEAAAUAIAAAAAAAAcIBAQAAAAEFHwAA7gMAICAAAPQDACC_AQAA7wMAIMABAADzAwAgxQEAAAUAIAUfAADsAwAgIAAA8QMAIL8BAADtAwAgwAEAAPADACDFAQAAAQAgAx8AAO4DACC_AQAA7wMAIMUBAAAFACADHwAA7AMAIL8BAADtAwAgxQEAAAEAIAAAAAAAAcIBAAAAsgECBcIBBAAAAAHIAQQAAAAByQEEAAAAAcoBBAAAAAHLAQQAAAABBR8AAOIDACAgAADqAwAgvwEAAOMDACDAAQAA6QMAIMUBAAAFACAHHwAA4AMAICAAAOcDACC_AQAA4QMAIMABAADmAwAgwwEAAAcAIMQBAAAHACDFAQAACQAgCx8AAMoCADAgAADPAgAwvwEAAMsCADDAAQAAzAIAMMEBAADNAgAgwgEAAM4CADDDAQAAzgIAMMQBAADOAgAwxQEAAM4CADDGAQAA0AIAMMcBAADRAgAwCx8AAL4CADAgAADDAgAwvwEAAL8CADDAAQAAwAIAMMEBAADBAgAgwgEAAMICADDDAQAAwgIAMMQBAADCAgAwxQEAAMICADDGAQAAxAIAMMcBAADFAgAwCAgAAKACACCQAUAAAAABmQEEAAAAAZsBBAAAAAGcAQEAAAABnQGAAAAAAZ4BgAAAAAGfAUAAAAABAgAAAA8AIB8AAMkCACADAAAADwAgHwAAyQIAICAAAMgCACABGAAA5QMAMA0HAACCAgAgCAAA9wEAIIsBAAD_AQAwjAEAAA0AEI0BAAD_AQAwkAFAAPYBACGZAQQAAAABmgEEAO4BACGbAQQA7gEAIZwBAQDvAQAhnQEAAIACACCeAQAAgAIAIJ8BQACBAgAhAgAAAA8AIBgAAMgCACACAAAAxgIAIBgAAMcCACALiwEAAMUCADCMAQAAxgIAEI0BAADFAgAwkAFAAPYBACGZAQQA7gEAIZoBBADuAQAhmwEEAO4BACGcAQEA7wEAIZ0BAACAAgAgngEAAIACACCfAUAAgQIAIQuLAQAAxQIAMIwBAADGAgAQjQEAAMUCADCQAUAA9gEAIZkBBADuAQAhmgEEAO4BACGbAQQA7gEAIZwBAQDvAQAhnQEAAIACACCeAQAAgAIAIJ8BQACBAgAhB5ABQACPAgAhmQEEAJACACGbAQQAkAIAIZwBAQCbAgAhnQGAAAAAAZ4BgAAAAAGfAUAAnAIAIQgIAACeAgAgkAFAAI8CACGZAQQAkAIAIZsBBACQAgAhnAEBAJsCACGdAYAAAAABngGAAAAAAZ8BQACcAgAhCAgAAKACACCQAUAAAAABmQEEAAAAAZsBBAAAAAGcAQEAAAABnQGAAAAAAZ4BgAAAAAGfAUAAAAABCAQAANYCACAGAADXAgAgCQAA2AIAIJoBBAAAAAGqAQQAAAABqwEBAAAAAa0BAgAAAAGyAQAAALIBAgIAAAAJACAfAADVAgAgAwAAAAkAIB8AANUCACAgAADUAgAgARgAAOQDADANBAAA-gEAIAUAAIYCACAGAACHAgAgCQAA8gEAIIsBAACDAgAwjAEAAAcAEI0BAACDAgAwmgEEAAAAAaoBBADuAQAhqwEBAO8BACGtAQIA-QEAIbIBAACEArIBIrMBBACFAgAhAgAAAAkAIBgAANQCACACAAAA0gIAIBgAANMCACAJiwEAANECADCMAQAA0gIAEI0BAADRAgAwmgEEAO4BACGqAQQA7gEAIasBAQDvAQAhrQECAPkBACGyAQAAhAKyASKzAQQAhQIAIQmLAQAA0QIAMIwBAADSAgAQjQEAANECADCaAQQA7gEAIaoBBADuAQAhqwEBAO8BACGtAQIA-QEAIbIBAACEArIBIrMBBACFAgAhBZoBBACQAgAhqgEEAJACACGrAQEAmwIAIa0BAgCmAgAhsgEAALgCsgEiCAQAALoCACAGAAC8AgAgCQAAvQIAIJoBBACQAgAhqgEEAJACACGrAQEAmwIAIa0BAgCmAgAhsgEAALgCsgEiCAQAANYCACAGAADXAgAgCQAA2AIAIJoBBAAAAAGqAQQAAAABqwEBAAAAAa0BAgAAAAGyAQAAALIBAgMfAADiAwAgvwEAAOMDACDFAQAABQAgBB8AAMoCADC_AQAAywIAMMEBAADNAgAgxQEAAM4CADAEHwAAvgIAML8BAAC_AgAwwQEAAMECACDFAQAAwgIAMAMfAADgAwAgvwEAAOEDACDFAQAACQAgAAAAAAAFHwAA2AMAICAAAN4DACC_AQAA2QMAIMABAADdAwAgxQEAAAEAIAsfAAD7AgAwIAAA_wIAML8BAAD8AgAwwAEAAP0CADDBAQAA_gIAIMIBAADOAgAwwwEAAM4CADDEAQAAzgIAMMUBAADOAgAwxgEAAIADADDHAQAA0QIAMAsfAADvAgAwIAAA9AIAML8BAADwAgAwwAEAAPECADDBAQAA8gIAIMIBAADzAgAwwwEAAPMCADDEAQAA8wIAMMUBAADzAgAwxgEAAPUCADDHAQAA9gIAMAsfAADjAgAwIAAA6AIAML8BAADkAgAwwAEAAOUCADDBAQAA5gIAIMIBAADnAgAwwwEAAOcCADDEAQAA5wIAMMUBAADnAgAwxgEAAOkCADDHAQAA6gIAMASpAQQAAAABqwEBAAAAAawBBAAAAAGtAQIAAAABAgAAABkAIB8AAO4CACADAAAAGQAgHwAA7gIAICAAAO0CACABGAAA3AMAMAkEAAD6AQAgiwEAAPgBADCMAQAAFwAQjQEAAPgBADCpAQQAAAABqgEEAO4BACGrAQEA7wEAIawBBADuAQAhrQECAPkBACECAAAAGQAgGAAA7QIAIAIAAADrAgAgGAAA7AIAIAiLAQAA6gIAMIwBAADrAgAQjQEAAOoCADCpAQQA7gEAIaoBBADuAQAhqwEBAO8BACGsAQQA7gEAIa0BAgD5AQAhCIsBAADqAgAwjAEAAOsCABCNAQAA6gIAMKkBBADuAQAhqgEEAO4BACGrAQEA7wEAIawBBADuAQAhrQECAPkBACEEqQEEAJACACGrAQEAmwIAIawBBACQAgAhrQECAKYCACEEqQEEAJACACGrAQEAmwIAIawBBACQAgAhrQECAKYCACEEqQEEAAAAAasBAQAAAAGsAQQAAAABrQECAAAAAQUMAACyAgAgjgEEAAAAAa4BAQAAAAGvAYAAAAABsAFAAAAAAQIAAAAVACAfAAD6AgAgAwAAABUAIB8AAPoCACAgAAD5AgAgARgAANsDADALBAAA-gEAIAwAAPcBACCLAQAA_AEAMIwBAAATABCNAQAA_AEAMI4BBADuAQAhqgEEAO4BACGuAQEA_QEAIa8BAAD-AQAgsAFAAPYBACG8AQAA-wEAIAIAAAAVACAYAAD5AgAgAgAAAPcCACAYAAD4AgAgCIsBAAD2AgAwjAEAAPcCABCNAQAA9gIAMI4BBADuAQAhqgEEAO4BACGuAQEA_QEAIa8BAAD-AQAgsAFAAPYBACEIiwEAAPYCADCMAQAA9wIAEI0BAAD2AgAwjgEEAO4BACGqAQQA7gEAIa4BAQD9AQAhrwEAAP4BACCwAUAA9gEAIQSOAQQAkAIAIa4BAQCuAgAhrwGAAAAAAbABQACPAgAhBQwAALACACCOAQQAkAIAIa4BAQCuAgAhrwGAAAAAAbABQACPAgAhBQwAALICACCOAQQAAAABrgEBAAAAAa8BgAAAAAGwAUAAAAABCAUAANkCACAGAADXAgAgCQAA2AIAIJoBBAAAAAGrAQEAAAABrQECAAAAAbIBAAAAsgECswEEAAAAAQIAAAAJACAfAACDAwAgAwAAAAkAIB8AAIMDACAgAACCAwAgARgAANoDADACAAAACQAgGAAAggMAIAIAAADSAgAgGAAAgQMAIAWaAQQAkAIAIasBAQCbAgAhrQECAKYCACGyAQAAuAKyASKzAQQAuQIAIQgFAAC7AgAgBgAAvAIAIAkAAL0CACCaAQQAkAIAIasBAQCbAgAhrQECAKYCACGyAQAAuAKyASKzAQQAuQIAIQgFAADZAgAgBgAA1wIAIAkAANgCACCaAQQAAAABqwEBAAAAAa0BAgAAAAGyAQAAALIBArMBBAAAAAEDHwAA2AMAIL8BAADZAwAgxQEAAAEAIAQfAAD7AgAwvwEAAPwCADDBAQAA_gIAIMUBAADOAgAwBB8AAO8CADC_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_QEAIbUBBADuAQAhtgECAPkBACECAAAABQAgGAAAwwMAIAIAAADBAwAgGAAAwgMAIAiLAQAAwAMAMIwBAADBAwAQjQEAAMADADCqAQQA7gEAIasBAQDvAQAhtAEBAP0BACG1AQQA7gEAIbYBAgD5AQAhCIsBAADAAwAwjAEAAMEDABCNAQAAwAMAMKoBBADuAQAhqwEBAO8BACG0AQEA_QEAIbUBBADuAQAhtgECAPkBACEEqgEEAJACACGrAQEAmwIAIbQBAQCuAgAhtgECAKYCACEHCwAA4AIAIA0AAOECACAOAADiAgAgqgEEAJACACGrAQEAmwIAIbQBAQCuAgAhtgECAKYCACEHCwAAhQMAIA0AAIYDACAOAACHAwAgqgEEAAAAAasBAQAAAAG0AQEAAAABtgECAAAAAQQfAAC5AwAwvwEAALoDADDBAQAAvAMAIMUBAAC9AwAwBB8AALADADC_AQAAsQMAMMEBAACzAwAgxQEAAPMCADAEHwAApwMAML8BAACoAwAwwQEAAKoDACDFAQAAwgIAMAQfAACeAwAwvwEAAJ8DADDBAQAAoQMAIMUBAACWAwAwBB8AAJIDADC_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AQEAAAABAgAAAAEAIB8AAPsDACAJBAAA1gIAIAUAANkCACAGAADXAgAgmgEEAAAAAaoBBAAAAAGrAQEAAAABrQECAAAAAbIBAAAAsgECswEEAAAAAQIAAAAJACAfAAD9AwAgAwAAACsAIB8AAPsDACAgAACBBAAgCAAAACsAIA0AAI4DACAPAACNAwAgEQAAkAMAIBIAAJEDACAYAACBBAAgjgEEAJACACG3AQEAmwIAIQYNAACOAwAgDwAAjQMAIBEAAJADACASAACRAwAgjgEEAJACACG3AQEAmwIAIQMAAAAHACAfAAD9AwAgIAAAhAQAIAsAAAAHACAEAAC6AgAgBQAAuwIAIAYAALwCACAYAACEBAAgmgEEAJACACGqAQQAkAIAIasBAQCbAgAhrQECAKYCACGyAQAAuAKyASKzAQQAuQIAIQkEAAC6AgAgBQAAuwIAIAYAALwCACCaAQQAkAIAIaoBBACQAgAhqwEBAJsCACGtAQIApgIAIbIBAAC4ArIBIrMBBAC5AgAhBgkAAMcDACANAADGAwAgDwAAxQMAIBEAAMgDACCOAQQAAAABtwEBAAAAAQIAAAABACAfAACFBAAgBgkAAMcDACANAADGAwAgDwAAxQMAIBIAAMkDACCOAQQAAAABtwEBAAAAAQIAAAABACAfAACHBAAgAwAAACsAIB8AAIUEACAgAACLBAAgCAAAACsAIAkAAI8DACANAACOAwAgDwAAjQMAIBEAAJADACAYAACLBAAgjgEEAJACACG3AQEAmwIAIQYJAACPAwAgDQAAjgMAIA8AAI0DACARAACQAwAgjgEEAJACACG3AQEAmwIAIQMAAAArACAfAACHBAAgIAAAjgQAIAgAAAArACAJAACPAwAgDQAAjgMAIA8AAI0DACASAACRAwAgGAAAjgQAII4BBACQAgAhtwEBAJsCACEGCQAAjwMAIA0AAI4DACAPAACNAwAgEgAAkQMAII4BBACQAgAhtwEBAJsCACEGCR8ECgAKDR4GDwYCESMJEiQJBQMAAQoACAsKAw0WBg4aBwUEAAIFCwMGDAMJEAQKAAUCBwADCAABAgYRAAkSAAIEAAIMAAEBBAACAwsbAA0cAA4dAAIMAAEQAAEFCScADSYADyUAESgAEikAAAAABQoADyUAECYAEScAEigAEwAAAAAABQoADyUAECYAEScAEigAEwEDAAEBAwABBQoAGCUAGSYAGicAGygAHAAAAAAABQoAGCUAGSYAGicAGygAHAIEAAIFYQMCBAACBWcDBQoAISUAIiYAIycAJCgAJQAAAAAABQoAISUAIiYAIycAJCgAJQIEAAIMAAECBAACDAABBQoAKiUAKyYALCcALSgALgAAAAAABQoAKiUAKyYALCcALSgALgEEAAIBBAACBQoAMyUANCYANScANigANwAAAAAABQoAMyUANCYANScANigANwIHAAMIAAECBwADCAABBQoAPCUAPSYAPicAPygAQAAAAAAABQoAPCUAPSYAPicAPygAQAIMAAEQAAECDAABEAABBQoARSUARiYARycASCgASQAAAAAABQoARSUARiYARycASCgASRMCARQqARUtARYuARcvARkxARozCxs0DBw2AR04Cx45DSE6ASI7ASM8Cyk_DipAFCtBAixCAi1DAi5EAi9FAjBHAjFJCzJKFTNMAjROCzVPFjZQAjdRAjhSCzlVFzpWHTtXAzxYAz1ZAz5aAz9bA0BdA0FfC0JgHkNjA0RlC0VmH0ZoA0dpA0hqC0ltIEpuJktvBkxwBk1xBk5yBk9zBlB1BlF3C1J4J1N6BlR8C1V9KFZ-Bld_BliAAQtZgwEpWoQBL1uFAQdchgEHXYcBB16IAQdfiQEHYIsBB2GNAQtijgEwY5ABB2SSAQtlkwExZpQBB2eVAQdolgELaZkBMmqaAThrmwEEbJwBBG2dAQRungEEb58BBHChAQRxowELcqQBOXOmAQR0qAELdakBOnaqAQR3qwEEeKwBC3mvATt6sAFBe7EBCXyyAQl9swEJfrQBCX-1AQmAAbcBCYEBuQELggG6AUKDAbwBCYQBvgELhQG_AUOGAcABCYcBwQEJiAHCAQuJAcUBRIoBxgFK"
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
  FriendshipScalarFieldEnum: () => (FriendshipScalarFieldEnum),
  GuildScalarFieldEnum: () => (GuildScalarFieldEnum),
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
    Friendship: 'Friendship'
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
    username: 'username'
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
    type: 'type',
    categoryId: 'categoryId',
    position: 'position'
};
const MemberScalarFieldEnum = {
    guildId: 'guildId',
    userId: 'userId',
    nickname: 'nickname',
    roleIds: 'roleIds',
    joinedAt: 'joinedAt'
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
    app.useWebSocketAdapter(new _nestjs_platform_ws__rspack_import_2.WsAdapter(app));
    app.enableCors();
    app.enableShutdownHooks();
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

})();

module.exports = __webpack_exports__;
})()
;
//# sourceMappingURL=main.js.map