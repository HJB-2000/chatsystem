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
            url: process.env.GATEWAY_PUBLIC_URL ?? `ws://localhost:${process.env.GATEWAY_PORT ?? process.env.PORT ?? 3001}/gateway`
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
    "inlineSchema": "generator client {\n  provider            = \"prisma-client\"\n  output              = \"../generated/prisma\"\n  moduleFormat        = \"cjs\"\n  importFileExtension = \"\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  // Prisma 7: url lives in prisma config, not here\n}\n\nenum ChannelType {\n  TEXT\n  VOICE\n  CATEGORY\n}\n\n// Minimal stub. Real user table belongs to the larger project.\nmodel User {\n  userId          BigInt                @id @default(autoincrement()) @map(\"user_id\")\n  username        String                @unique\n  avatarUrl       String?               @map(\"avatar_url\")\n  roleTitle       String?               @map(\"role_title\")\n  currentActivity String?               @map(\"current_activity\")\n  lastPresence    String?               @map(\"last_presence\") // online | idle | dnd | offline\n  guilds          Guild[]               @relation(\"GuildOwner\")\n  members         Member[]\n  messages        Message[]\n  friendships     Friendship[]          @relation(\"FriendshipUser\")\n  friendOf        Friendship[]          @relation(\"FriendshipFriend\")\n  dmChannels      DirectChannelMember[]\n  invitesCreated  Invite[]\n\n  @@map(\"user\")\n}\n\nmodel Guild {\n  guildId     BigInt    @id @default(autoincrement()) @map(\"guild_id\")\n  name        String\n  iconUrl     String?   @map(\"icon_url\")\n  ownerId     BigInt    @map(\"owner_id\")\n  memberCount Int       @default(0) @map(\"member_count\")\n  owner       User      @relation(\"GuildOwner\", fields: [ownerId], references: [userId])\n  channels    Channel[]\n  members     Member[]\n  roles       Role[]\n  invites     Invite[]\n\n  @@index([ownerId])\n  @@map(\"guild\")\n}\n\nmodel Channel {\n  // Shared BIGSERIAL sequence with DirectChannel: both tables hand out ids\n  // from the same generator so Message.channel_id can reference either one.\n  channelId  BigInt      @id @default(autoincrement()) @map(\"channel_id\")\n  guildId    BigInt      @map(\"guild_id\")\n  name       String\n  topic      String?\n  icon       String?\n  capacity   Int         @default(100)\n  type       ChannelType @default(TEXT)\n  categoryId BigInt?     @map(\"category_id\")\n  position   Int         @default(0)\n  guild      Guild       @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  category   Channel?    @relation(\"Category\", fields: [categoryId], references: [channelId], onDelete: SetNull)\n  children   Channel[]   @relation(\"Category\")\n  messages   Message[]   @relation(\"ChannelMessages\")\n\n  @@index([guildId, position])\n  @@map(\"channel\")\n}\n\nmodel Member {\n  guildId        BigInt   @map(\"guild_id\")\n  userId         BigInt   @map(\"user_id\")\n  nickname       String?\n  roleIds        Json     @default(\"[]\") @map(\"role_ids\")\n  joinedAt       DateTime @default(now()) @map(\"joined_at\")\n  voiceChannelId BigInt?  @map(\"voice_channel_id\")\n  guild          Guild    @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  user           User     @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@id([guildId, userId])\n  @@index([userId])\n  @@map(\"member\")\n}\n\nmodel Role {\n  roleId      BigInt @id @default(autoincrement()) @map(\"role_id\")\n  guildId     BigInt @map(\"guild_id\")\n  name        String\n  permissions BigInt @default(0)\n  position    Int    @default(0)\n  guild       Guild  @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n\n  @@index([guildId])\n  @@map(\"role\")\n}\n\nmodel Message {\n  messageId   BigInt         @id @default(autoincrement()) @map(\"message_id\")\n  channelId   BigInt         @map(\"channel_id\")\n  authorId    BigInt         @map(\"author_id\")\n  content     String\n  embeds      Json?\n  attachments Json?\n  createdAt   DateTime       @default(now()) @map(\"created_at\")\n  editedAt    DateTime?      @map(\"edited_at\")\n  channel     Channel?       @relation(\"ChannelMessages\", fields: [channelId], references: [channelId], onDelete: Cascade, map: \"message_channel_id_fkey\")\n  dmChannel   DirectChannel? @relation(\"DmChannelMessages\", fields: [channelId], references: [channelId], onDelete: Cascade, map: \"message_dm_channel_id_fkey\")\n  author      User           @relation(fields: [authorId], references: [userId])\n\n  @@index([channelId, messageId])\n  @@map(\"message\")\n}\n\nmodel Friendship {\n  userId    BigInt   @map(\"user_id\")\n  friendId  BigInt   @map(\"friend_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  user      User     @relation(\"FriendshipUser\", fields: [userId], references: [userId], onDelete: Cascade)\n  friend    User     @relation(\"FriendshipFriend\", fields: [friendId], references: [userId], onDelete: Cascade)\n\n  @@id([userId, friendId])\n  @@index([friendId])\n  @@map(\"friendship\")\n}\n\nmodel Invite {\n  inviteId    BigInt    @id @default(autoincrement()) @map(\"invite_id\")\n  guildId     BigInt    @map(\"guild_id\")\n  code        String    @unique\n  createdById BigInt    @map(\"created_by_id\")\n  createdAt   DateTime  @default(now()) @map(\"created_at\")\n  expiresAt   DateTime? @map(\"expires_at\")\n  guild       Guild     @relation(fields: [guildId], references: [guildId], onDelete: Cascade)\n  createdBy   User      @relation(fields: [createdById], references: [userId])\n\n  @@index([guildId])\n  @@map(\"invite\")\n}\n\n// DM channels are just channels with no guild; membership is explicit.\n// Shares the \"channel_channel_id_seq\" sequence with Channel (see above).\nmodel DirectChannel {\n  channelId BigInt                @id @default(autoincrement()) @map(\"channel_id\")\n  userA     BigInt                @map(\"user_a\")\n  userB     BigInt                @map(\"user_b\")\n  createdAt DateTime              @default(now()) @map(\"created_at\")\n  members   DirectChannelMember[]\n  messages  Message[]             @relation(\"DmChannelMessages\")\n\n  @@unique([userA, userB])\n  @@map(\"direct_channel\")\n}\n\nmodel DirectChannelMember {\n  channelId BigInt        @map(\"channel_id\")\n  userId    BigInt        @map(\"user_id\")\n  channel   DirectChannel @relation(fields: [channelId], references: [channelId], onDelete: Cascade)\n  user      User          @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@id([channelId, userId])\n  @@index([userId])\n  @@index([channelId])\n  @@map(\"direct_channel_member\")\n}\n",
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
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avatarUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"avatar_url\"},{\"name\":\"roleTitle\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"role_title\"},{\"name\":\"currentActivity\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"current_activity\"},{\"name\":\"lastPresence\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"last_presence\"},{\"name\":\"guilds\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildOwner\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToUser\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"MessageToUser\"},{\"name\":\"friendships\",\"kind\":\"object\",\"type\":\"Friendship\",\"relationName\":\"FriendshipUser\"},{\"name\":\"friendOf\",\"kind\":\"object\",\"type\":\"Friendship\",\"relationName\":\"FriendshipFriend\"},{\"name\":\"dmChannels\",\"kind\":\"object\",\"type\":\"DirectChannelMember\",\"relationName\":\"DirectChannelMemberToUser\"},{\"name\":\"invitesCreated\",\"kind\":\"object\",\"type\":\"Invite\",\"relationName\":\"InviteToUser\"}],\"dbName\":\"user\",\"schema\":null},\"Guild\":{\"fields\":[{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"iconUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"icon_url\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"owner_id\"},{\"name\":\"memberCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"member_count\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GuildOwner\"},{\"name\":\"channels\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"ChannelToGuild\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"GuildToMember\"},{\"name\":\"roles\",\"kind\":\"object\",\"type\":\"Role\",\"relationName\":\"GuildToRole\"},{\"name\":\"invites\",\"kind\":\"object\",\"type\":\"Invite\",\"relationName\":\"GuildToInvite\"}],\"dbName\":\"guild\",\"schema\":null},\"Channel\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"topic\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"capacity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"ChannelType\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"category_id\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"ChannelToGuild\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"Category\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"Category\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"ChannelMessages\"}],\"dbName\":\"channel\",\"schema\":null},\"Member\":{\"fields\":[{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"nickname\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roleIds\",\"kind\":\"scalar\",\"type\":\"Json\",\"dbName\":\"role_ids\"},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"joined_at\"},{\"name\":\"voiceChannelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"voice_channel_id\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MemberToUser\"}],\"dbName\":\"member\",\"schema\":null},\"Role\":{\"fields\":[{\"name\":\"roleId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"role_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToRole\"}],\"dbName\":\"role\",\"schema\":null},\"Message\":{\"fields\":[{\"name\":\"messageId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"message_id\"},{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"author_id\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"embeds\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"attachments\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"editedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"edited_at\"},{\"name\":\"channel\",\"kind\":\"object\",\"type\":\"Channel\",\"relationName\":\"ChannelMessages\"},{\"name\":\"dmChannel\",\"kind\":\"object\",\"type\":\"DirectChannel\",\"relationName\":\"DmChannelMessages\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MessageToUser\"}],\"dbName\":\"message\",\"schema\":null},\"Friendship\":{\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"friendId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"friend_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FriendshipUser\"},{\"name\":\"friend\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FriendshipFriend\"}],\"dbName\":\"friendship\",\"schema\":null},\"Invite\":{\"fields\":[{\"name\":\"inviteId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"invite_id\"},{\"name\":\"guildId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"guild_id\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"created_by_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"expires_at\"},{\"name\":\"guild\",\"kind\":\"object\",\"type\":\"Guild\",\"relationName\":\"GuildToInvite\"},{\"name\":\"createdBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"InviteToUser\"}],\"dbName\":\"invite\",\"schema\":null},\"DirectChannel\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"userA\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_a\"},{\"name\":\"userB\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_b\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"DirectChannelMember\",\"relationName\":\"DirectChannelToDirectChannelMember\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"Message\",\"relationName\":\"DmChannelMessages\"}],\"dbName\":\"direct_channel\",\"schema\":null},\"DirectChannelMember\":{\"fields\":[{\"name\":\"channelId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"channel_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"BigInt\",\"dbName\":\"user_id\"},{\"name\":\"channel\",\"kind\":\"object\",\"type\":\"DirectChannel\",\"relationName\":\"DirectChannelToDirectChannelMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DirectChannelMemberToUser\"}],\"dbName\":\"direct_channel_member\",\"schema\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"owner\",\"guild\",\"category\",\"children\",\"channel\",\"user\",\"members\",\"messages\",\"_count\",\"dmChannel\",\"author\",\"channels\",\"roles\",\"createdBy\",\"invites\",\"guilds\",\"friend\",\"friendships\",\"friendOf\",\"dmChannels\",\"invitesCreated\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Guild.findUnique\",\"Guild.findUniqueOrThrow\",\"Guild.findFirst\",\"Guild.findFirstOrThrow\",\"Guild.findMany\",\"Guild.createOne\",\"Guild.createMany\",\"Guild.createManyAndReturn\",\"Guild.updateOne\",\"Guild.updateMany\",\"Guild.updateManyAndReturn\",\"Guild.upsertOne\",\"Guild.deleteOne\",\"Guild.deleteMany\",\"Guild.groupBy\",\"Guild.aggregate\",\"Channel.findUnique\",\"Channel.findUniqueOrThrow\",\"Channel.findFirst\",\"Channel.findFirstOrThrow\",\"Channel.findMany\",\"Channel.createOne\",\"Channel.createMany\",\"Channel.createManyAndReturn\",\"Channel.updateOne\",\"Channel.updateMany\",\"Channel.updateManyAndReturn\",\"Channel.upsertOne\",\"Channel.deleteOne\",\"Channel.deleteMany\",\"Channel.groupBy\",\"Channel.aggregate\",\"Member.findUnique\",\"Member.findUniqueOrThrow\",\"Member.findFirst\",\"Member.findFirstOrThrow\",\"Member.findMany\",\"Member.createOne\",\"Member.createMany\",\"Member.createManyAndReturn\",\"Member.updateOne\",\"Member.updateMany\",\"Member.updateManyAndReturn\",\"Member.upsertOne\",\"Member.deleteOne\",\"Member.deleteMany\",\"Member.groupBy\",\"Member.aggregate\",\"Role.findUnique\",\"Role.findUniqueOrThrow\",\"Role.findFirst\",\"Role.findFirstOrThrow\",\"Role.findMany\",\"Role.createOne\",\"Role.createMany\",\"Role.createManyAndReturn\",\"Role.updateOne\",\"Role.updateMany\",\"Role.updateManyAndReturn\",\"Role.upsertOne\",\"Role.deleteOne\",\"Role.deleteMany\",\"Role.groupBy\",\"Role.aggregate\",\"Message.findUnique\",\"Message.findUniqueOrThrow\",\"Message.findFirst\",\"Message.findFirstOrThrow\",\"Message.findMany\",\"Message.createOne\",\"Message.createMany\",\"Message.createManyAndReturn\",\"Message.updateOne\",\"Message.updateMany\",\"Message.updateManyAndReturn\",\"Message.upsertOne\",\"Message.deleteOne\",\"Message.deleteMany\",\"Message.groupBy\",\"Message.aggregate\",\"Friendship.findUnique\",\"Friendship.findUniqueOrThrow\",\"Friendship.findFirst\",\"Friendship.findFirstOrThrow\",\"Friendship.findMany\",\"Friendship.createOne\",\"Friendship.createMany\",\"Friendship.createManyAndReturn\",\"Friendship.updateOne\",\"Friendship.updateMany\",\"Friendship.updateManyAndReturn\",\"Friendship.upsertOne\",\"Friendship.deleteOne\",\"Friendship.deleteMany\",\"Friendship.groupBy\",\"Friendship.aggregate\",\"Invite.findUnique\",\"Invite.findUniqueOrThrow\",\"Invite.findFirst\",\"Invite.findFirstOrThrow\",\"Invite.findMany\",\"Invite.createOne\",\"Invite.createMany\",\"Invite.createManyAndReturn\",\"Invite.updateOne\",\"Invite.updateMany\",\"Invite.updateManyAndReturn\",\"Invite.upsertOne\",\"Invite.deleteOne\",\"Invite.deleteMany\",\"Invite.groupBy\",\"Invite.aggregate\",\"DirectChannel.findUnique\",\"DirectChannel.findUniqueOrThrow\",\"DirectChannel.findFirst\",\"DirectChannel.findFirstOrThrow\",\"DirectChannel.findMany\",\"DirectChannel.createOne\",\"DirectChannel.createMany\",\"DirectChannel.createManyAndReturn\",\"DirectChannel.updateOne\",\"DirectChannel.updateMany\",\"DirectChannel.updateManyAndReturn\",\"DirectChannel.upsertOne\",\"DirectChannel.deleteOne\",\"DirectChannel.deleteMany\",\"DirectChannel.groupBy\",\"DirectChannel.aggregate\",\"DirectChannelMember.findUnique\",\"DirectChannelMember.findUniqueOrThrow\",\"DirectChannelMember.findFirst\",\"DirectChannelMember.findFirstOrThrow\",\"DirectChannelMember.findMany\",\"DirectChannelMember.createOne\",\"DirectChannelMember.createMany\",\"DirectChannelMember.createManyAndReturn\",\"DirectChannelMember.updateOne\",\"DirectChannelMember.updateMany\",\"DirectChannelMember.updateManyAndReturn\",\"DirectChannelMember.upsertOne\",\"DirectChannelMember.deleteOne\",\"DirectChannelMember.deleteMany\",\"DirectChannelMember.groupBy\",\"DirectChannelMember.aggregate\",\"AND\",\"OR\",\"NOT\",\"channelId\",\"userId\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"userA\",\"userB\",\"createdAt\",\"userA_userB\",\"every\",\"some\",\"none\",\"inviteId\",\"guildId\",\"code\",\"createdById\",\"expiresAt\",\"contains\",\"startsWith\",\"endsWith\",\"friendId\",\"messageId\",\"authorId\",\"content\",\"embeds\",\"attachments\",\"editedAt\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"roleId\",\"name\",\"permissions\",\"position\",\"nickname\",\"roleIds\",\"joinedAt\",\"voiceChannelId\",\"topic\",\"icon\",\"capacity\",\"ChannelType\",\"type\",\"categoryId\",\"iconUrl\",\"ownerId\",\"memberCount\",\"username\",\"avatarUrl\",\"roleTitle\",\"currentActivity\",\"lastPresence\",\"userId_friendId\",\"guildId_userId\",\"channelId_userId\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "6wVpoAEQCQAA1QIAIAoAALECACASAADUAgAgFAAA1gIAIBUAANYCACAWAACwAgAgFwAA1wIAIMABAADRAgAwwQEAAD4AEMIBAADRAgAwxAEEAAAAAfoBAQAAAAH7AQEA0wIAIfwBAQDTAgAh_QEBANMCACH-AQEA0wIAIQEAAAABACANAwAA2gIAIAkAANUCACAOAADtAgAgDwAA7wIAIBEAANcCACDAAQAA7gIAMMEBAAADABDCAQAA7gIAMNUBBACuAgAh6gEBANICACH3AQEA0wIAIfgBBACuAgAh-QECAN8CACEGAwAAjAUAIAkAAIkFACAOAACQBQAgDwAAkQUAIBEAAIsFACD3AQAApAMAIA0DAADaAgAgCQAA1QIAIA4AAO0CACAPAADvAgAgEQAA1wIAIMABAADuAgAwwQEAAAMAEMIBAADuAgAw1QEEAAAAAeoBAQDSAgAh9wEBANMCACH4AQQArgIAIfkBAgDfAgAhAwAAAAMAIAEAAAQAMAIAAAUAIBAEAADdAgAgBQAA6QIAIAYAAO0CACAKAACxAgAgwAEAAOsCADDBAQAABwAQwgEAAOsCADDDAQQArgIAIdUBBACuAgAh6gEBANICACHsAQIA3wIAIfEBAQDTAgAh8gEBANMCACHzAQIA3wIAIfUBAADsAvUBIvYBBADjAgAhBwQAAI0FACAFAACPBQAgBgAAkAUAIAoAAKMDACDxAQAApAMAIPIBAACkAwAg9gEAAKQDACAQBAAA3QIAIAUAAOkCACAGAADtAgAgCgAAsQIAIMABAADrAgAwwQEAAAcAEMIBAADrAgAwwwEEAAAAAdUBBACuAgAh6gEBANICACHsAQIA3wIAIfEBAQDTAgAh8gEBANMCACHzAQIA3wIAIfUBAADsAvUBIvYBBADjAgAhAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAAHACADAAAABwAgAQAACAAwAgAACQAgDgcAAOkCACAMAADqAgAgDQAA2gIAIMABAADnAgAwwQEAAA0AEMIBAADnAgAwwwEEAK4CACHPAUAArwIAId0BBACuAgAh3gEEAK4CACHfAQEA0gIAIeABAADoAgAg4QEAAOgCACDiAUAA3AIAIQYHAACPBQAgDAAAjgUAIA0AAIwFACDgAQAApAMAIOEBAACkAwAg4gEAAKQDACAOBwAA6QIAIAwAAOoCACANAADaAgAgwAEAAOcCADDBAQAADQAQwgEAAOcCADDDAQQArgIAIc8BQACvAgAh3QEEAAAAAd4BBACuAgAh3wEBANICACHgAQAA6AIAIOEBAADoAgAg4gFAANwCACEDAAAADQAgAQAADgAwAgAADwAgAQAAAAcAIAkJAACwAgAgCgAAsQIAIMABAACtAgAwwQEAABIAEMIBAACtAgAwwwEEAK4CACHNAQQArgIAIc4BBACuAgAhzwFAAK8CACEBAAAAEgAgBwcAAOYCACAIAADaAgAgwAEAAOUCADDBAQAAFAAQwgEAAOUCADDDAQQArgIAIcQBBACuAgAhAgcAAI4FACAIAACMBQAgCAcAAOYCACAIAADaAgAgwAEAAOUCADDBAQAAFAAQwgEAAOUCADDDAQQArgIAIcQBBACuAgAhgQIAAOQCACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAUACABAAAADQAgAQAAAAcAIAEAAAANACALBAAA3QIAIAgAANoCACDAAQAA4QIAMMEBAAAdABDCAQAA4QIAMMQBBACuAgAh1QEEAK4CACHtAQEA0wIAIe4BAADiAgAg7wFAAK8CACHwAQQA4wIAIQQEAACNBQAgCAAAjAUAIO0BAACkAwAg8AEAAKQDACAMBAAA3QIAIAgAANoCACDAAQAA4QIAMMEBAAAdABDCAQAA4QIAMMQBBACuAgAh1QEEAK4CACHtAQEA0wIAIe4BAADiAgAg7wFAAK8CACHwAQQA4wIAIYACAADgAgAgAwAAAB0AIAEAAB4AMAIAAB8AIAkEAADdAgAgwAEAAN4CADDBAQAAIQAQwgEAAN4CADDVAQQArgIAIekBBACuAgAh6gEBANICACHrAQQArgIAIewBAgDfAgAhAQQAAI0FACAJBAAA3QIAIMABAADeAgAwwQEAACEAEMIBAADeAgAw1QEEAK4CACHpAQQAAAAB6gEBANICACHrAQQArgIAIewBAgDfAgAhAwAAACEAIAEAACIAMAIAACMAIAsEAADdAgAgEAAA2gIAIMABAADbAgAwwQEAACUAEMIBAADbAgAwzwFAAK8CACHUAQQArgIAIdUBBACuAgAh1gEBANICACHXAQQArgIAIdgBQADcAgAhAwQAAI0FACAQAACMBQAg2AEAAKQDACALBAAA3QIAIBAAANoCACDAAQAA2wIAMMEBAAAlABDCAQAA2wIAMM8BQACvAgAh1AEEAAAAAdUBBACuAgAh1gEBAAAAAdcBBACuAgAh2AFAANwCACEDAAAAJQAgAQAAJgAwAgAAJwAgAQAAAAcAIAEAAAAdACABAAAAIQAgAQAAACUAIAMAAAAdACABAAAeADACAAAfACADAAAADQAgAQAADgAwAgAADwAgCAgAANoCACATAADaAgAgwAEAANkCADDBAQAALwAQwgEAANkCADDEAQQArgIAIc8BQACvAgAh3AEEAK4CACECCAAAjAUAIBMAAIwFACAJCAAA2gIAIBMAANoCACDAAQAA2QIAMMEBAAAvABDCAQAA2QIAMMQBBACuAgAhzwFAAK8CACHcAQQArgIAIf8BAADYAgAgAwAAAC8AIAEAADAAMAIAADEAIAMAAAAvACABAAAwADACAAAxACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAACUAIAEAACYAMAIAACcAIAEAAAADACABAAAAHQAgAQAAAA0AIAEAAAAvACABAAAALwAgAQAAABQAIAEAAAAlACABAAAAAQAgEAkAANUCACAKAACxAgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAsAIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACuAgAh-gEBANICACH7AQEA0wIAIfwBAQDTAgAh_QEBANMCACH-AQEA0wIAIQsJAACJBQAgCgAAowMAIBIAAIgFACAUAACKBQAgFQAAigUAIBYAAKIDACAXAACLBQAg-wEAAKQDACD8AQAApAMAIP0BAACkAwAg_gEAAKQDACADAAAAPgAgAQAAPwAwAgAAAQAgAwAAAD4AIAEAAD8AMAIAAAEAIAMAAAA-ACABAAA_ADACAAABACANCQAAggUAIAoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgFwAAhwUAIMQBBAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAQEdAABDACAGxAEEAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAABAR0AAEUAMAEdAABFADANCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIMQBBAD1AgAh-gEBAIwDACH7AQEAywMAIfwBAQDLAwAh_QEBAMsDACH-AQEAywMAIQIAAAABACAdAABIACAGxAEEAPUCACH6AQEAjAMAIfsBAQDLAwAh_AEBAMsDACH9AQEAywMAIf4BAQDLAwAhAgAAAD4AIB0AAEoAIAIAAAA-ACAdAABKACADAAAAAQAgJAAAQwAgJQAASAAgAQAAAAEAIAEAAAA-ACAJCwAAsAQAICoAALEEACArAAC0BAAgLAAAswQAIC0AALIEACD7AQAApAMAIPwBAACkAwAg_QEAAKQDACD-AQAApAMAIAnAAQAA0AIAMMEBAABRABDCAQAA0AIAMMQBBACjAgAh-gEBALMCACH7AQEAwgIAIfwBAQDCAgAh_QEBAMICACH-AQEAwgIAIQMAAAA-ACABAABQADApAABRACADAAAAPgAgAQAAPwAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAKAwAAqwQAIAkAAK0EACAOAACsBAAgDwAArgQAIBEAAK8EACDVAQQAAAAB6gEBAAAAAfcBAQAAAAH4AQQAAAAB-QECAAAAAQEdAABZACAF1QEEAAAAAeoBAQAAAAH3AQEAAAAB-AEEAAAAAfkBAgAAAAEBHQAAWwAwAR0AAFsAMAoDAAD5AwAgCQAA-wMAIA4AAPoDACAPAAD8AwAgEQAA_QMAINUBBAD1AgAh6gEBAIwDACH3AQEAywMAIfgBBAD1AgAh-QECAMMDACECAAAABQAgHQAAXgAgBdUBBAD1AgAh6gEBAIwDACH3AQEAywMAIfgBBAD1AgAh-QECAMMDACECAAAAAwAgHQAAYAAgAgAAAAMAIB0AAGAAIAMAAAAFACAkAABZACAlAABeACABAAAABQAgAQAAAAMAIAYLAAD0AwAgKgAA9QMAICsAAPgDACAsAAD3AwAgLQAA9gMAIPcBAACkAwAgCMABAADPAgAwwQEAAGcAEMIBAADPAgAw1QEEAKMCACHqAQEAswIAIfcBAQDCAgAh-AEEAKMCACH5AQIAvwIAIQMAAAADACABAABmADApAABnACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACANBAAA8AMAIAUAAPMDACAGAADxAwAgCgAA8gMAIMMBBAAAAAHVAQQAAAAB6gEBAAAAAewBAgAAAAHxAQEAAAAB8gEBAAAAAfMBAgAAAAH1AQAAAPUBAvYBBAAAAAEBHQAAbwAgCcMBBAAAAAHVAQQAAAAB6gEBAAAAAewBAgAAAAHxAQEAAAAB8gEBAAAAAfMBAgAAAAH1AQAAAPUBAvYBBAAAAAEBHQAAcQAwAR0AAHEAMAEAAAAHACANBAAA1wMAIAUAANgDACAGAADZAwAgCgAA2gMAIMMBBAD1AgAh1QEEAPUCACHqAQEAjAMAIewBAgDDAwAh8QEBAMsDACHyAQEAywMAIfMBAgDDAwAh9QEAANYD9QEi9gEEAMwDACECAAAACQAgHQAAdQAgCcMBBAD1AgAh1QEEAPUCACHqAQEAjAMAIewBAgDDAwAh8QEBAMsDACHyAQEAywMAIfMBAgDDAwAh9QEAANYD9QEi9gEEAMwDACECAAAABwAgHQAAdwAgAgAAAAcAIB0AAHcAIAEAAAAHACADAAAACQAgJAAAbwAgJQAAdQAgAQAAAAkAIAEAAAAHACAICwAA0QMAICoAANIDACArAADVAwAgLAAA1AMAIC0AANMDACDxAQAApAMAIPIBAACkAwAg9gEAAKQDACAMwAEAAMsCADDBAQAAfwAQwgEAAMsCADDDAQQAowIAIdUBBACjAgAh6gEBALMCACHsAQIAvwIAIfEBAQDCAgAh8gEBAMICACHzAQIAvwIAIfUBAADMAvUBIvYBBADEAgAhAwAAAAcAIAEAAH4AMCkAAH8AIAMAAAAHACABAAAIADACAAAJACABAAAAHwAgAQAAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAgEAADPAwAgCAAA0AMAIMQBBAAAAAHVAQQAAAAB7QEBAAAAAe4BgAAAAAHvAUAAAAAB8AEEAAAAAQEdAACHAQAgBsQBBAAAAAHVAQQAAAAB7QEBAAAAAe4BgAAAAAHvAUAAAAAB8AEEAAAAAQEdAACJAQAwAR0AAIkBADAIBAAAzQMAIAgAAM4DACDEAQQA9QIAIdUBBAD1AgAh7QEBAMsDACHuAYAAAAAB7wFAAP8CACHwAQQAzAMAIQIAAAAfACAdAACMAQAgBsQBBAD1AgAh1QEEAPUCACHtAQEAywMAIe4BgAAAAAHvAUAA_wIAIfABBADMAwAhAgAAAB0AIB0AAI4BACACAAAAHQAgHQAAjgEAIAMAAAAfACAkAACHAQAgJQAAjAEAIAEAAAAfACABAAAAHQAgBwsAAMYDACAqAADHAwAgKwAAygMAICwAAMkDACAtAADIAwAg7QEAAKQDACDwAQAApAMAIAnAAQAAwQIAMMEBAACVAQAQwgEAAMECADDEAQQAowIAIdUBBACjAgAh7QEBAMICACHuAQAAwwIAIO8BQACpAgAh8AEEAMQCACEDAAAAHQAgAQAAlAEAMCkAAJUBACADAAAAHQAgAQAAHgAwAgAAHwAgAQAAACMAIAEAAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACAGBAAAxQMAINUBBAAAAAHpAQQAAAAB6gEBAAAAAesBBAAAAAHsAQIAAAABAR0AAJ0BACAF1QEEAAAAAekBBAAAAAHqAQEAAAAB6wEEAAAAAewBAgAAAAEBHQAAnwEAMAEdAACfAQAwBgQAAMQDACDVAQQA9QIAIekBBAD1AgAh6gEBAIwDACHrAQQA9QIAIewBAgDDAwAhAgAAACMAIB0AAKIBACAF1QEEAPUCACHpAQQA9QIAIeoBAQCMAwAh6wEEAPUCACHsAQIAwwMAIQIAAAAhACAdAACkAQAgAgAAACEAIB0AAKQBACADAAAAIwAgJAAAnQEAICUAAKIBACABAAAAIwAgAQAAACEAIAULAAC-AwAgKgAAvwMAICsAAMIDACAsAADBAwAgLQAAwAMAIAjAAQAAvgIAMMEBAACrAQAQwgEAAL4CADDVAQQAowIAIekBBACjAgAh6gEBALMCACHrAQQAowIAIewBAgC_AgAhAwAAACEAIAEAAKoBADApAACrAQAgAwAAACEAIAEAACIAMAIAACMAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgCwcAAJIDACAMAAC9AwAgDQAAkwMAIMMBBAAAAAHPAUAAAAAB3QEEAAAAAd4BBAAAAAHfAQEAAAAB4AGAAAAAAeEBgAAAAAHiAUAAAAABAR0AALMBACAIwwEEAAAAAc8BQAAAAAHdAQQAAAAB3gEEAAAAAd8BAQAAAAHgAYAAAAAB4QGAAAAAAeIBQAAAAAEBHQAAtQEAMAEdAAC1AQAwAQAAAAcAIAEAAAASACALBwAAjwMAIAwAALwDACANAACQAwAgwwEEAPUCACHPAUAA_wIAId0BBAD1AgAh3gEEAPUCACHfAQEAjAMAIeABgAAAAAHhAYAAAAAB4gFAAI0DACECAAAADwAgHQAAugEAIAjDAQQA9QIAIc8BQAD_AgAh3QEEAPUCACHeAQQA9QIAId8BAQCMAwAh4AGAAAAAAeEBgAAAAAHiAUAAjQMAIQIAAAANACAdAAC8AQAgAgAAAA0AIB0AALwBACABAAAABwAgAQAAABIAIAMAAAAPACAkAACzAQAgJQAAugEAIAEAAAAPACABAAAADQAgCAsAALcDACAqAAC4AwAgKwAAuwMAICwAALoDACAtAAC5AwAg4AEAAKQDACDhAQAApAMAIOIBAACkAwAgC8ABAAC7AgAwwQEAAMUBABDCAQAAuwIAMMMBBACjAgAhzwFAAKkCACHdAQQAowIAId4BBACjAgAh3wEBALMCACHgAQAAvAIAIOEBAAC8AgAg4gFAALQCACEDAAAADQAgAQAAxAEAMCkAAMUBACADAAAADQAgAQAADgAwAgAADwAgAQAAADEAIAEAAAAxACADAAAALwAgAQAAMAAwAgAAMQAgAwAAAC8AIAEAADAAMAIAADEAIAMAAAAvACABAAAwADACAAAxACAFCAAAtQMAIBMAALYDACDEAQQAAAABzwFAAAAAAdwBBAAAAAEBHQAAzQEAIAPEAQQAAAABzwFAAAAAAdwBBAAAAAEBHQAAzwEAMAEdAADPAQAwBQgAALMDACATAAC0AwAgxAEEAPUCACHPAUAA_wIAIdwBBAD1AgAhAgAAADEAIB0AANIBACADxAEEAPUCACHPAUAA_wIAIdwBBAD1AgAhAgAAAC8AIB0AANQBACACAAAALwAgHQAA1AEAIAMAAAAxACAkAADNAQAgJQAA0gEAIAEAAAAxACABAAAALwAgBQsAAK4DACAqAACvAwAgKwAAsgMAICwAALEDACAtAACwAwAgBsABAAC6AgAwwQEAANsBABDCAQAAugIAMMQBBACjAgAhzwFAAKkCACHcAQQAowIAIQMAAAAvACABAADaAQAwKQAA2wEAIAMAAAAvACABAAAwADACAAAxACABAAAAJwAgAQAAACcAIAMAAAAlACABAAAmADACAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACUAIAEAACYAMAIAACcAIAgEAACsAwAgEAAArQMAIM8BQAAAAAHUAQQAAAAB1QEEAAAAAdYBAQAAAAHXAQQAAAAB2AFAAAAAAQEdAADjAQAgBs8BQAAAAAHUAQQAAAAB1QEEAAAAAdYBAQAAAAHXAQQAAAAB2AFAAAAAAQEdAADlAQAwAR0AAOUBADAIBAAAqgMAIBAAAKsDACDPAUAA_wIAIdQBBAD1AgAh1QEEAPUCACHWAQEAjAMAIdcBBAD1AgAh2AFAAI0DACECAAAAJwAgHQAA6AEAIAbPAUAA_wIAIdQBBAD1AgAh1QEEAPUCACHWAQEAjAMAIdcBBAD1AgAh2AFAAI0DACECAAAAJQAgHQAA6gEAIAIAAAAlACAdAADqAQAgAwAAACcAICQAAOMBACAlAADoAQAgAQAAACcAIAEAAAAlACAGCwAApQMAICoAAKYDACArAACpAwAgLAAAqAMAIC0AAKcDACDYAQAApAMAIAnAAQAAsgIAMMEBAADxAQAQwgEAALICADDPAUAAqQIAIdQBBACjAgAh1QEEAKMCACHWAQEAswIAIdcBBACjAgAh2AFAALQCACEDAAAAJQAgAQAA8AEAMCkAAPEBACADAAAAJQAgAQAAJgAwAgAAJwAgCgkAALACACAKAACxAgAgwAEAAK0CADDBAQAAEgAQwgEAAK0CADDDAQQAAAABzQEEAK4CACHOAQQArgIAIc8BQACvAgAh0AEAAKwCACABAAAA9AEAIAEAAAD0AQAgAgkAAKIDACAKAACjAwAgAwAAABIAIAEAAPcBADACAAD0AQAgAwAAABIAIAEAAPcBADACAAD0AQAgAwAAABIAIAEAAPcBADACAAD0AQAgBgkAAKADACAKAAChAwAgwwEEAAAAAc0BBAAAAAHOAQQAAAABzwFAAAAAAQEdAAD7AQAgBMMBBAAAAAHNAQQAAAABzgEEAAAAAc8BQAAAAAEBHQAA_QEAMAEdAAD9AQAwBgkAAIADACAKAACBAwAgwwEEAPUCACHNAQQA9QIAIc4BBAD1AgAhzwFAAP8CACECAAAA9AEAIB0AAIACACAEwwEEAPUCACHNAQQA9QIAIc4BBAD1AgAhzwFAAP8CACECAAAAEgAgHQAAggIAIAIAAAASACAdAACCAgAgAwAAAPQBACAkAAD7AQAgJQAAgAIAIAEAAAD0AQAgAQAAABIAIAULAAD6AgAgKgAA-wIAICsAAP4CACAsAAD9AgAgLQAA_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_ABDCAQAAywIAMMMBBACjAgAh1QEEAKMCACHqAQEAswIAIewBAgC_AgAh8QEBAMICACHyAQEAwgIAIfMBAgC_AgAh9QEAAMwC9QEi9gEEAMQCACEHCwAApQIAICwAAM4CACAtAADOAgAgxQEAAAD1AQLGAQAAAPUBCMcBAAAA9QEIzAEAAM0C9QEiBwsAAKUCACAsAADOAgAgLQAAzgIAIMUBAAAA9QECxgEAAAD1AQjHAQAAAPUBCMwBAADNAvUBIgTFAQAAAPUBAsYBAAAA9QEIxwEAAAD1AQjMAQAAzgL1ASIIwAEAAM8CADDBAQAAZwAQwgEAAM8CADDVAQQAowIAIeoBAQCzAgAh9wEBAMICACH4AQQAowIAIfkBAgC_AgAhCcABAADQAgAwwQEAAFEAEMIBAADQAgAwxAEEAKMCACH6AQEAswIAIfsBAQDCAgAh_AEBAMICACH9AQEAwgIAIf4BAQDCAgAhEAkAANUCACAKAACxAgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAsAIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACuAgAh-gEBANICACH7AQEA0wIAIfwBAQDTAgAh_QEBANMCACH-AQEA0wIAIQvFAQEAAAABxgEBAAAABMcBAQAAAATIAQEAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBALkCACHZAQEAAAAB2gEBAAAAAdsBAQAAAAELxQEBAAAAAcYBAQAAAAXHAQEAAAAFyAEBAAAAAckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQDKAgAh2QEBAAAAAdoBAQAAAAHbAQEAAAABA9EBAAADACDSAQAAAwAg0wEAAAMAIAPRAQAAHQAg0gEAAB0AINMBAAAdACAD0QEAAC8AINIBAAAvACDTAQAALwAgA9EBAAAlACDSAQAAJQAg0wEAACUAIALEAQQAAAAB3AEEAAAAAQgIAADaAgAgEwAA2gIAIMABAADZAgAwwQEAAC8AEMIBAADZAgAwxAEEAK4CACHPAUAArwIAIdwBBACuAgAhEgkAANUCACAKAACxAgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAsAIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACuAgAh-gEBANICACH7AQEA0wIAIfwBAQDTAgAh_QEBANMCACH-AQEA0wIAIYICAAA-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_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_UBIgsEAADXAwAgBgAA2QMAIAoAANoDACDDAQQA9QIAIdUBBAD1AgAh6gEBAIwDACHsAQIAwwMAIfEBAQDLAwAh8gEBAMsDACHzAQIAwwMAIfUBAADWA_UBIgsEAADwAwAgBgAA8QMAIAoAAPIDACDDAQQAAAAB1QEEAAAAAeoBAQAAAAHsAQIAAAAB8QEBAAAAAfIBAQAAAAHzAQIAAAAB9QEAAAD1AQIDJAAApAUAIIQCAAClBQAgigIAAAUAIAQkAADkAwAwhAIAAOUDADCGAgAA5wMAIIoCAADoAwAwBCQAANsDADCEAgAA3AMAMIYCAADeAwAgigIAAIYDADADJAAAogUAIIQCAACjBQAgigIAAAkAIAAAAAAABSQAAJkFACAlAACgBQAghAIAAJoFACCFAgAAnwUAIIoCAAABACALJAAAogQAMCUAAKYEADCEAgAAowQAMIUCAACkBAAwhgIAAKUEACCHAgAA6AMAMIgCAADoAwAwiQIAAOgDADCKAgAA6AMAMIsCAACnBAAwjAIAAOsDADALJAAAlgQAMCUAAJsEADCEAgAAlwQAMIUCAACYBAAwhgIAAJkEACCHAgAAmgQAMIgCAACaBAAwiQIAAJoEADCKAgAAmgQAMIsCAACcBAAwjAIAAJ0EADALJAAAigQAMCUAAI8EADCEAgAAiwQAMIUCAACMBAAwhgIAAI0EACCHAgAAjgQAMIgCAACOBAAwiQIAAI4EADCKAgAAjgQAMIsCAACQBAAwjAIAAJEEADALJAAA_gMAMCUAAIMEADCEAgAA_wMAMIUCAACABAAwhgIAAIEEACCHAgAAggQAMIgCAACCBAAwiQIAAIIEADCKAgAAggQAMIsCAACEBAAwjAIAAIUEADAGEAAArQMAIM8BQAAAAAHUAQQAAAAB1gEBAAAAAdcBBAAAAAHYAUAAAAABAgAAACcAICQAAIkEACADAAAAJwAgJAAAiQQAICUAAIgEACABHQAAngUAMAsEAADdAgAgEAAA2gIAIMABAADbAgAwwQEAACUAEMIBAADbAgAwzwFAAK8CACHUAQQAAAAB1QEEAK4CACHWAQEAAAAB1wEEAK4CACHYAUAA3AIAIQIAAAAnACAdAACIBAAgAgAAAIYEACAdAACHBAAgCcABAACFBAAwwQEAAIYEABDCAQAAhQQAMM8BQACvAgAh1AEEAK4CACHVAQQArgIAIdYBAQDSAgAh1wEEAK4CACHYAUAA3AIAIQnAAQAAhQQAMMEBAACGBAAQwgEAAIUEADDPAUAArwIAIdQBBACuAgAh1QEEAK4CACHWAQEA0gIAIdcBBACuAgAh2AFAANwCACEFzwFAAP8CACHUAQQA9QIAIdYBAQCMAwAh1wEEAPUCACHYAUAAjQMAIQYQAACrAwAgzwFAAP8CACHUAQQA9QIAIdYBAQCMAwAh1wEEAPUCACHYAUAAjQMAIQYQAACtAwAgzwFAAAAAAdQBBAAAAAHWAQEAAAAB1wEEAAAAAdgBQAAAAAEE6QEEAAAAAeoBAQAAAAHrAQQAAAAB7AECAAAAAQIAAAAjACAkAACVBAAgAwAAACMAICQAAJUEACAlAACUBAAgAR0AAJ0FADAJBAAA3QIAIMABAADeAgAwwQEAACEAEMIBAADeAgAw1QEEAK4CACHpAQQAAAAB6gEBANICACHrAQQArgIAIewBAgDfAgAhAgAAACMAIB0AAJQEACACAAAAkgQAIB0AAJMEACAIwAEAAJEEADDBAQAAkgQAEMIBAACRBAAw1QEEAK4CACHpAQQArgIAIeoBAQDSAgAh6wEEAK4CACHsAQIA3wIAIQjAAQAAkQQAMMEBAACSBAAQwgEAAJEEADDVAQQArgIAIekBBACuAgAh6gEBANICACHrAQQArgIAIewBAgDfAgAhBOkBBAD1AgAh6gEBAIwDACHrAQQA9QIAIewBAgDDAwAhBOkBBAD1AgAh6gEBAIwDACHrAQQA9QIAIewBAgDDAwAhBOkBBAAAAAHqAQEAAAAB6wEEAAAAAewBAgAAAAEGCAAA0AMAIMQBBAAAAAHtAQEAAAAB7gGAAAAAAe8BQAAAAAHwAQQAAAABAgAAAB8AICQAAKEEACADAAAAHwAgJAAAoQQAICUAAKAEACABHQAAnAUAMAwEAADdAgAgCAAA2gIAIMABAADhAgAwwQEAAB0AEMIBAADhAgAwxAEEAK4CACHVAQQArgIAIe0BAQDTAgAh7gEAAOICACDvAUAArwIAIfABBADjAgAhgAIAAOACACACAAAAHwAgHQAAoAQAIAIAAACeBAAgHQAAnwQAIAnAAQAAnQQAMMEBAACeBAAQwgEAAJ0EADDEAQQArgIAIdUBBACuAgAh7QEBANMCACHuAQAA4gIAIO8BQACvAgAh8AEEAOMCACEJwAEAAJ0EADDBAQAAngQAEMIBAACdBAAwxAEEAK4CACHVAQQArgIAIe0BAQDTAgAh7gEAAOICACDvAUAArwIAIfABBADjAgAhBcQBBAD1AgAh7QEBAMsDACHuAYAAAAAB7wFAAP8CACHwAQQAzAMAIQYIAADOAwAgxAEEAPUCACHtAQEAywMAIe4BgAAAAAHvAUAA_wIAIfABBADMAwAhBggAANADACDEAQQAAAAB7QEBAAAAAe4BgAAAAAHvAUAAAAAB8AEEAAAAAQsFAADzAwAgBgAA8QMAIAoAAPIDACDDAQQAAAAB6gEBAAAAAewBAgAAAAHxAQEAAAAB8gEBAAAAAfMBAgAAAAH1AQAAAPUBAvYBBAAAAAECAAAACQAgJAAAqgQAIAMAAAAJACAkAACqBAAgJQAAqQQAIAEdAACbBQAwAgAAAAkAIB0AAKkEACACAAAA7AMAIB0AAKgEACAIwwEEAPUCACHqAQEAjAMAIewBAgDDAwAh8QEBAMsDACHyAQEAywMAIfMBAgDDAwAh9QEAANYD9QEi9gEEAMwDACELBQAA2AMAIAYAANkDACAKAADaAwAgwwEEAPUCACHqAQEAjAMAIewBAgDDAwAh8QEBAMsDACHyAQEAywMAIfMBAgDDAwAh9QEAANYD9QEi9gEEAMwDACELBQAA8wMAIAYAAPEDACAKAADyAwAgwwEEAAAAAeoBAQAAAAHsAQIAAAAB8QEBAAAAAfIBAQAAAAHzAQIAAAAB9QEAAAD1AQL2AQQAAAABAyQAAJkFACCEAgAAmgUAIIoCAAABACAEJAAAogQAMIQCAACjBAAwhgIAAKUEACCKAgAA6AMAMAQkAACWBAAwhAIAAJcEADCGAgAAmQQAIIoCAACaBAAwBCQAAIoEADCEAgAAiwQAMIYCAACNBAAgigIAAI4EADAEJAAA_gMAMIQCAAD_AwAwhgIAAIEEACCKAgAAggQAMAAAAAAACyQAAPUEADAlAAD6BAAwhAIAAPYEADCFAgAA9wQAMIYCAAD4BAAghwIAAPkEADCIAgAA-QQAMIkCAAD5BAAwigIAAPkEADCLAgAA-wQAMIwCAAD8BAAwCyQAAOwEADAlAADwBAAwhAIAAO0EADCFAgAA7gQAMIYCAADvBAAghwIAAJoEADCIAgAAmgQAMIkCAACaBAAwigIAAJoEADCLAgAA8QQAMIwCAACdBAAwCyQAAOMEADAlAADnBAAwhAIAAOQEADCFAgAA5QQAMIYCAADmBAAghwIAAIYDADCIAgAAhgMAMIkCAACGAwAwigIAAIYDADCLAgAA6AQAMIwCAACJAwAwCyQAANoEADAlAADeBAAwhAIAANsEADCFAgAA3AQAMIYCAADdBAAghwIAANIEADCIAgAA0gQAMIkCAADSBAAwigIAANIEADCLAgAA3wQAMIwCAADVBAAwCyQAAM4EADAlAADTBAAwhAIAAM8EADCFAgAA0AQAMIYCAADRBAAghwIAANIEADCIAgAA0gQAMIkCAADSBAAwigIAANIEADCLAgAA1AQAMIwCAADVBAAwCyQAAMUEADAlAADJBAAwhAIAAMYEADCFAgAAxwQAMIYCAADIBAAghwIAAJgDADCIAgAAmAMAMIkCAACYAwAwigIAAJgDADCLAgAAygQAMIwCAACbAwAwCyQAALwEADAlAADABAAwhAIAAL0EADCFAgAAvgQAMIYCAAC_BAAghwIAAIIEADCIAgAAggQAMIkCAACCBAAwigIAAIIEADCLAgAAwQQAMIwCAACFBAAwBgQAAKwDACDPAUAAAAAB1AEEAAAAAdUBBAAAAAHWAQEAAAAB2AFAAAAAAQIAAAAnACAkAADEBAAgAwAAACcAICQAAMQEACAlAADDBAAgAR0AAJgFADACAAAAJwAgHQAAwwQAIAIAAACGBAAgHQAAwgQAIAXPAUAA_wIAIdQBBAD1AgAh1QEEAPUCACHWAQEAjAMAIdgBQACNAwAhBgQAAKoDACDPAUAA_wIAIdQBBAD1AgAh1QEEAPUCACHWAQEAjAMAIdgBQACNAwAhBgQAAKwDACDPAUAAAAAB1AEEAAAAAdUBBAAAAAHWAQEAAAAB2AFAAAAAAQIHAAD4AgAgwwEEAAAAAQIAAAAWACAkAADNBAAgAwAAABYAICQAAM0EACAlAADMBAAgAR0AAJcFADACAAAAFgAgHQAAzAQAIAIAAACcAwAgHQAAywQAIAHDAQQA9QIAIQIHAAD2AgAgwwEEAPUCACECBwAA-AIAIMMBBAAAAAEDCAAAtQMAIMQBBAAAAAHPAUAAAAABAgAAADEAICQAANkEACADAAAAMQAgJAAA2QQAICUAANgEACABHQAAlgUAMAkIAADaAgAgEwAA2gIAIMABAADZAgAwwQEAAC8AEMIBAADZAgAwxAEEAK4CACHPAUAArwIAIdwBBACuAgAh_wEAANgCACACAAAAMQAgHQAA2AQAIAIAAADWBAAgHQAA1wQAIAbAAQAA1QQAMMEBAADWBAAQwgEAANUEADDEAQQArgIAIc8BQACvAgAh3AEEAK4CACEGwAEAANUEADDBAQAA1gQAEMIBAADVBAAwxAEEAK4CACHPAUAArwIAIdwBBACuAgAhAsQBBAD1AgAhzwFAAP8CACEDCAAAswMAIMQBBAD1AgAhzwFAAP8CACEDCAAAtQMAIMQBBAAAAAHPAUAAAAABAxMAALYDACDPAUAAAAAB3AEEAAAAAQIAAAAxACAkAADiBAAgAwAAADEAICQAAOIEACAlAADhBAAgAR0AAJUFADACAAAAMQAgHQAA4QQAIAIAAADWBAAgHQAA4AQAIALPAUAA_wIAIdwBBAD1AgAhAxMAALQDACDPAUAA_wIAIdwBBAD1AgAhAxMAALYDACDPAUAAAAAB3AEEAAAAAQkHAACSAwAgDAAAvQMAIMMBBAAAAAHPAUAAAAAB3QEEAAAAAd8BAQAAAAHgAYAAAAAB4QGAAAAAAeIBQAAAAAECAAAADwAgJAAA6wQAIAMAAAAPACAkAADrBAAgJQAA6gQAIAEdAACUBQAwAgAAAA8AIB0AAOoEACACAAAAigMAIB0AAOkEACAHwwEEAPUCACHPAUAA_wIAId0BBAD1AgAh3wEBAIwDACHgAYAAAAAB4QGAAAAAAeIBQACNAwAhCQcAAI8DACAMAAC8AwAgwwEEAPUCACHPAUAA_wIAId0BBAD1AgAh3wEBAIwDACHgAYAAAAAB4QGAAAAAAeIBQACNAwAhCQcAAJIDACAMAAC9AwAgwwEEAAAAAc8BQAAAAAHdAQQAAAAB3wEBAAAAAeABgAAAAAHhAYAAAAAB4gFAAAAAAQYEAADPAwAg1QEEAAAAAe0BAQAAAAHuAYAAAAAB7wFAAAAAAfABBAAAAAECAAAAHwAgJAAA9AQAIAMAAAAfACAkAAD0BAAgJQAA8wQAIAEdAACTBQAwAgAAAB8AIB0AAPMEACACAAAAngQAIB0AAPIEACAF1QEEAPUCACHtAQEAywMAIe4BgAAAAAHvAUAA_wIAIfABBADMAwAhBgQAAM0DACDVAQQA9QIAIe0BAQDLAwAh7gGAAAAAAe8BQAD_AgAh8AEEAMwDACEGBAAAzwMAINUBBAAAAAHtAQEAAAAB7gGAAAAAAe8BQAAAAAHwAQQAAAABCAkAAK0EACAOAACsBAAgDwAArgQAIBEAAK8EACDVAQQAAAAB6gEBAAAAAfcBAQAAAAH5AQIAAAABAgAAAAUAICQAAIAFACADAAAABQAgJAAAgAUAICUAAP8EACABHQAAkgUAMA0DAADaAgAgCQAA1QIAIA4AAO0CACAPAADvAgAgEQAA1wIAIMABAADuAgAwwQEAAAMAEMIBAADuAgAw1QEEAAAAAeoBAQDSAgAh9wEBANMCACH4AQQArgIAIfkBAgDfAgAhAgAAAAUAIB0AAP8EACACAAAA_QQAIB0AAP4EACAIwAEAAPwEADDBAQAA_QQAEMIBAAD8BAAw1QEEAK4CACHqAQEA0gIAIfcBAQDTAgAh-AEEAK4CACH5AQIA3wIAIQjAAQAA_AQAMMEBAAD9BAAQwgEAAPwEADDVAQQArgIAIeoBAQDSAgAh9wEBANMCACH4AQQArgIAIfkBAgDfAgAhBNUBBAD1AgAh6gEBAIwDACH3AQEAywMAIfkBAgDDAwAhCAkAAPsDACAOAAD6AwAgDwAA_AMAIBEAAP0DACDVAQQA9QIAIeoBAQCMAwAh9wEBAMsDACH5AQIAwwMAIQgJAACtBAAgDgAArAQAIA8AAK4EACARAACvBAAg1QEEAAAAAeoBAQAAAAH3AQEAAAAB-QECAAAAAQQkAAD1BAAwhAIAAPYEADCGAgAA-AQAIIoCAAD5BAAwBCQAAOwEADCEAgAA7QQAMIYCAADvBAAgigIAAJoEADAEJAAA4wQAMIQCAADkBAAwhgIAAOYEACCKAgAAhgMAMAQkAADaBAAwhAIAANsEADCGAgAA3QQAIIoCAADSBAAwBCQAAM4EADCEAgAAzwQAMIYCAADRBAAgigIAANIEADAEJAAAxQQAMIQCAADGBAAwhgIAAMgEACCKAgAAmAMAMAQkAAC8BAAwhAIAAL0EADCGAgAAvwQAIIoCAACCBAAwAAAAAAsJAACJBQAgCgAAowMAIBIAAIgFACAUAACKBQAgFQAAigUAIBYAAKIDACAXAACLBQAg-wEAAKQDACD8AQAApAMAIP0BAACkAwAg_gEAAKQDACAGAwAAjAUAIAkAAIkFACAOAACQBQAgDwAAkQUAIBEAAIsFACD3AQAApAMAIAIJAACiAwAgCgAAowMAIAcEAACNBQAgBQAAjwUAIAYAAJAFACAKAACjAwAg8QEAAKQDACDyAQAApAMAIPYBAACkAwAgAAAE1QEEAAAAAeoBAQAAAAH3AQEAAAAB-QECAAAAAQXVAQQAAAAB7QEBAAAAAe4BgAAAAAHvAUAAAAAB8AEEAAAAAQfDAQQAAAABzwFAAAAAAd0BBAAAAAHfAQEAAAAB4AGAAAAAAeEBgAAAAAHiAUAAAAABAs8BQAAAAAHcAQQAAAABAsQBBAAAAAHPAUAAAAABAcMBBAAAAAEFzwFAAAAAAdQBBAAAAAHVAQQAAAAB1gEBAAAAAdgBQAAAAAEMCQAAggUAIAoAAIMFACAUAACEBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAAEAICQAAJkFACAIwwEEAAAAAeoBAQAAAAHsAQIAAAAB8QEBAAAAAfIBAQAAAAHzAQIAAAAB9QEAAAD1AQL2AQQAAAABBcQBBAAAAAHtAQEAAAAB7gGAAAAAAe8BQAAAAAHwAQQAAAABBOkBBAAAAAHqAQEAAAAB6wEEAAAAAewBAgAAAAEFzwFAAAAAAdQBBAAAAAHWAQEAAAAB1wEEAAAAAdgBQAAAAAEDAAAAPgAgJAAAmQUAICUAAKEFACAOAAAAPgAgCQAAtgQAIAoAALcEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgHQAAoQUAIMQBBAD1AgAh-gEBAIwDACH7AQEAywMAIfwBAQDLAwAh_QEBAMsDACH-AQEAywMAIQwJAAC2BAAgCgAAtwQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACDEAQQA9QIAIfoBAQCMAwAh-wEBAMsDACH8AQEAywMAIf0BAQDLAwAh_gEBAMsDACEMBAAA8AMAIAUAAPMDACAKAADyAwAgwwEEAAAAAdUBBAAAAAHqAQEAAAAB7AECAAAAAfEBAQAAAAHyAQEAAAAB8wECAAAAAfUBAAAA9QEC9gEEAAAAAQIAAAAJACAkAACiBQAgCQMAAKsEACAJAACtBAAgDwAArgQAIBEAAK8EACDVAQQAAAAB6gEBAAAAAfcBAQAAAAH4AQQAAAAB-QECAAAAAQIAAAAFACAkAACkBQAgCMMBBAAAAAHVAQQAAAAB6gEBAAAAAewBAgAAAAHxAQEAAAAB8gEBAAAAAfMBAgAAAAH1AQAAAPUBAgfPAUAAAAAB3QEEAAAAAd4BBAAAAAHfAQEAAAAB4AGAAAAAAeEBgAAAAAHiAUAAAAABAwAAAAcAICQAAKIFACAlAACqBQAgDgAAAAcAIAQAANcDACAFAADYAwAgCgAA2gMAIB0AAKoFACDDAQQA9QIAIdUBBAD1AgAh6gEBAIwDACHsAQIAwwMAIfEBAQDLAwAh8gEBAMsDACHzAQIAwwMAIfUBAADWA_UBIvYBBADMAwAhDAQAANcDACAFAADYAwAgCgAA2gMAIMMBBAD1AgAh1QEEAPUCACHqAQEAjAMAIewBAgDDAwAh8QEBAMsDACHyAQEAywMAIfMBAgDDAwAh9QEAANYD9QEi9gEEAMwDACEDAAAAAwAgJAAApAUAICUAAK0FACALAAAAAwAgAwAA-QMAIAkAAPsDACAPAAD8AwAgEQAA_QMAIB0AAK0FACDVAQQA9QIAIeoBAQCMAwAh9wEBAMsDACH4AQQA9QIAIfkBAgDDAwAhCQMAAPkDACAJAAD7AwAgDwAA_AMAIBEAAP0DACDVAQQA9QIAIeoBAQCMAwAh9wEBAMsDACH4AQQA9QIAIfkBAgDDAwAhDAoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgFwAAhwUAIMQBBAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAQIAAAABACAkAACuBQAgCQMAAKsEACAOAACsBAAgDwAArgQAIBEAAK8EACDVAQQAAAAB6gEBAAAAAfcBAQAAAAH4AQQAAAAB-QECAAAAAQIAAAAFACAkAACwBQAgAwAAAD4AICQAAK4FACAlAAC0BQAgDgAAAD4AIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIB0AALQFACDEAQQA9QIAIfoBAQCMAwAh-wEBAMsDACH8AQEAywMAIf0BAQDLAwAh_gEBAMsDACEMCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPUCACH6AQEAjAMAIfsBAQDLAwAh_AEBAMsDACH9AQEAywMAIf4BAQDLAwAhAwAAAAMAICQAALAFACAlAAC3BQAgCwAAAAMAIAMAAPkDACAOAAD6AwAgDwAA_AMAIBEAAP0DACAdAAC3BQAg1QEEAPUCACHqAQEAjAMAIfcBAQDLAwAh-AEEAPUCACH5AQIAwwMAIQkDAAD5AwAgDgAA-gMAIA8AAPwDACARAAD9AwAg1QEEAPUCACHqAQEAjAMAIfcBAQDLAwAh-AEEAPUCACH5AQIAwwMAIQkDAACrBAAgCQAArQQAIA4AAKwEACARAACvBAAg1QEEAAAAAeoBAQAAAAH3AQEAAAAB-AEEAAAAAfkBAgAAAAECAAAABQAgJAAAuAUAIAMAAAADACAkAAC4BQAgJQAAvAUAIAsAAAADACADAAD5AwAgCQAA-wMAIA4AAPoDACARAAD9AwAgHQAAvAUAINUBBAD1AgAh6gEBAIwDACH3AQEAywMAIfgBBAD1AgAh-QECAMMDACEJAwAA-QMAIAkAAPsDACAOAAD6AwAgEQAA_QMAINUBBAD1AgAh6gEBAIwDACH3AQEAywMAIfgBBAD1AgAh-QECAMMDACEFCQAAoAMAIMMBBAAAAAHNAQQAAAABzgEEAAAAAc8BQAAAAAECAAAA9AEAICQAAL0FACADAAAAEgAgJAAAvQUAICUAAMEFACAHAAAAEgAgCQAAgAMAIB0AAMEFACDDAQQA9QIAIc0BBAD1AgAhzgEEAPUCACHPAUAA_wIAIQUJAACAAwAgwwEEAPUCACHNAQQA9QIAIc4BBAD1AgAhzwFAAP8CACEMCQAAggUAIAoAAIMFACASAACBBQAgFAAAhAUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAAEAICQAAMIFACAMCQAAggUAIAoAAIMFACASAACBBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAAEAICQAAMQFACADAAAAPgAgJAAAwgUAICUAAMgFACAOAAAAPgAgCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBYAALoEACAXAAC7BAAgHQAAyAUAIMQBBAD1AgAh-gEBAIwDACH7AQEAywMAIfwBAQDLAwAh_QEBAMsDACH-AQEAywMAIQwJAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFgAAugQAIBcAALsEACDEAQQA9QIAIfoBAQCMAwAh-wEBAMsDACH8AQEAywMAIf0BAQDLAwAh_gEBAMsDACEDAAAAPgAgJAAAxAUAICUAAMsFACAOAAAAPgAgCQAAtgQAIAoAALcEACASAAC1BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgHQAAywUAIMQBBAD1AgAh-gEBAIwDACH7AQEAywMAIfwBAQDLAwAh_QEBAMsDACH-AQEAywMAIQwJAAC2BAAgCgAAtwQAIBIAALUEACAVAAC5BAAgFgAAugQAIBcAALsEACDEAQQA9QIAIfoBAQCMAwAh-wEBAMsDACH8AQEAywMAIf0BAQDLAwAh_gEBAMsDACEMCQAAggUAIAoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgxAEEAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAAEAICQAAMwFACAJAwAAqwQAIAkAAK0EACAOAACsBAAgDwAArgQAINUBBAAAAAHqAQEAAAAB9wEBAAAAAfgBBAAAAAH5AQIAAAABAgAAAAUAICQAAM4FACADAAAAPgAgJAAAzAUAICUAANIFACAOAAAAPgAgCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgHQAA0gUAIMQBBAD1AgAh-gEBAIwDACH7AQEAywMAIfwBAQDLAwAh_QEBAMsDACH-AQEAywMAIQwJAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACDEAQQA9QIAIfoBAQCMAwAh-wEBAMsDACH8AQEAywMAIf0BAQDLAwAh_gEBAMsDACEDAAAAAwAgJAAAzgUAICUAANUFACALAAAAAwAgAwAA-QMAIAkAAPsDACAOAAD6AwAgDwAA_AMAIB0AANUFACDVAQQA9QIAIeoBAQCMAwAh9wEBAMsDACH4AQQA9QIAIfkBAgDDAwAhCQMAAPkDACAJAAD7AwAgDgAA-gMAIA8AAPwDACDVAQQA9QIAIeoBAQCMAwAh9wEBAMsDACH4AQQA9QIAIfkBAgDDAwAhAcQBBAAAAAEMCQAAggUAIBIAAIEFACAUAACEBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAAEAICQAANcFACAMBAAA8AMAIAUAAPMDACAGAADxAwAgwwEEAAAAAdUBBAAAAAHqAQEAAAAB7AECAAAAAfEBAQAAAAHyAQEAAAAB8wECAAAAAfUBAAAA9QEC9gEEAAAAAQIAAAAJACAkAADZBQAgAwAAAD4AICQAANcFACAlAADdBQAgDgAAAD4AIAkAALYEACASAAC1BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIB0AAN0FACDEAQQA9QIAIfoBAQCMAwAh-wEBAMsDACH8AQEAywMAIf0BAQDLAwAh_gEBAMsDACEMCQAAtgQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPUCACH6AQEAjAMAIfsBAQDLAwAh_AEBAMsDACH9AQEAywMAIf4BAQDLAwAhAwAAAAcAICQAANkFACAlAADgBQAgDgAAAAcAIAQAANcDACAFAADYAwAgBgAA2QMAIB0AAOAFACDDAQQA9QIAIdUBBAD1AgAh6gEBAIwDACHsAQIAwwMAIfEBAQDLAwAh8gEBAMsDACHzAQIAwwMAIfUBAADWA_UBIvYBBADMAwAhDAQAANcDACAFAADYAwAgBgAA2QMAIMMBBAD1AgAh1QEEAPUCACHqAQEAjAMAIewBAgDDAwAh8QEBAMsDACHyAQEAywMAIfMBAgDDAwAh9QEAANYD9QEi9gEEAMwDACEHzwFAAAAAAd0BBAAAAAHeAQQAAAAB3wEBAAAAAeABgAAAAAHhAYAAAAAB4gFAAAAAAQwJAACCBQAgCgAAgwUAIBIAAIEFACAUAACEBQAgFQAAhQUAIBcAAIcFACDEAQQAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAECAAAAAQAgJAAA4gUAIAUKAAChAwAgwwEEAAAAAc0BBAAAAAHOAQQAAAABzwFAAAAAAQIAAAD0AQAgJAAA5AUAIAMAAAA-ACAkAADiBQAgJQAA6AUAIA4AAAA-ACAJAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBcAALsEACAdAADoBQAgxAEEAPUCACH6AQEAjAMAIfsBAQDLAwAh_AEBAMsDACH9AQEAywMAIf4BAQDLAwAhDAkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFwAAuwQAIMQBBAD1AgAh-gEBAIwDACH7AQEAywMAIfwBAQDLAwAh_QEBAMsDACH-AQEAywMAIQMAAAASACAkAADkBQAgJQAA6wUAIAcAAAASACAKAACBAwAgHQAA6wUAIMMBBAD1AgAhzQEEAPUCACHOAQQA9QIAIc8BQAD_AgAhBQoAAIEDACDDAQQA9QIAIc0BBAD1AgAhzgEEAPUCACHPAUAA_wIAIQgJLQkKLgQLAA4SBgIUMg0VMw0WNAYXNQsGAwABCSAJCwAMDgoDDyQKESgLBQQAAgULAwYMAwoQBAsACAMHEQMMEwUNAAEDCRcGChgECwAHAgcABQgAAQIJGQAKGgACBhsAChwAAgQAAggAAQEEAAICBAACEAABBAkqAA4pAA8rABEsAAIIAAETAAEHCTcACjgAEjYAFDkAFToAFjsAFzwAAAAABQsAEyoAFCsAFSwAFi0AFwAAAAAABQsAEyoAFCsAFSwAFi0AFwEDAAEBAwABBQsAHCoAHSsAHiwAHy0AIAAAAAAABQsAHCoAHSsAHiwAHy0AIAIEAAIFdAMCBAACBXoDBQsAJSoAJisAJywAKC0AKQAAAAAABQsAJSoAJisAJywAKC0AKQIEAAIIAAECBAACCAABBQsALioALysAMCwAMS0AMgAAAAAABQsALioALysAMCwAMS0AMgEEAAIBBAACBQsANyoAOCsAOSwAOi0AOwAAAAAABQsANyoAOCsAOSwAOi0AOwMHuAEDDLkBBQ0AAQMHvwEDDMABBQ0AAQULAEAqAEErAEIsAEMtAEQAAAAAAAULAEAqAEErAEIsAEMtAEQCCAABEwABAggAARMAAQULAEkqAEorAEssAEwtAE0AAAAAAAULAEkqAEorAEssAEwtAE0CBAACEAABAgQAAhAAAQULAFIqAFMrAFQsAFUtAFYAAAAAAAULAFIqAFMrAFQsAFUtAFYAAAULAFsqAFwrAF0sAF4tAF8AAAAAAAULAFsqAFwrAF0sAF4tAF8CBwAFCAABAgcABQgAAQULAGQqAGUrAGYsAGctAGgAAAAAAAULAGQqAGUrAGYsAGctAGgYAgEZPQEaQAEbQQEcQgEeRAEfRg8gRxAhSQEiSw8jTBEmTQEnTgEoTw8uUhIvUxgwVAIxVQIyVgIzVwI0WAI1WgI2XA83XRk4XwI5YQ86Yho7YwI8ZAI9ZQ8-aBs_aSFAagNBawNCbANDbQNEbgNFcANGcg9HcyJIdgNJeA9KeSNLewNMfANNfQ9OgAEkT4EBKlCCAQlRgwEJUoQBCVOFAQlUhgEJVYgBCVaKAQ9XiwErWI0BCVmPAQ9akAEsW5EBCVySAQldkwEPXpYBLV-XATNgmAEKYZkBCmKaAQpjmwEKZJwBCmWeAQpmoAEPZ6EBNGijAQpppQEPaqYBNWunAQpsqAEKbakBD26sATZvrQE8cK4BBHGvAQRysAEEc7EBBHSyAQR1tAEEdrYBD3e3AT14uwEEeb0BD3q-AT57wQEEfMIBBH3DAQ9-xgE_f8cBRYAByAENgQHJAQ2CAcoBDYMBywENhAHMAQ2FAc4BDYYB0AEPhwHRAUaIAdMBDYkB1QEPigHWAUeLAdcBDYwB2AENjQHZAQ-OAdwBSI8B3QFOkAHeAQuRAd8BC5IB4AELkwHhAQuUAeIBC5UB5AELlgHmAQ-XAecBT5gB6QELmQHrAQ-aAewBUJsB7QELnAHuAQudAe8BD54B8gFRnwHzAVegAfUBBaEB9gEFogH4AQWjAfkBBaQB-gEFpQH8AQWmAf4BD6cB_wFYqAGBAgWpAYMCD6oBhAJZqwGFAgWsAYYCBa0BhwIPrgGKAlqvAYsCYLABjAIGsQGNAgayAY4CBrMBjwIGtAGQAga1AZICBrYBlAIPtwGVAmG4AZcCBrkBmQIPugGaAmK7AZsCBrwBnAIGvQGdAg--AaACY78BoQJp"
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
    userId: 'userId'
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
    await app.listen(process.env.GATEWAY_PORT ?? process.env.PORT ?? 3001);
}
bootstrap();

})();

module.exports = __webpack_exports__;
})()
;
//# sourceMappingURL=main.js.map