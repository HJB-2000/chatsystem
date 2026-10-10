(() => {
"use strict";
var __webpack_modules__ = ({
6(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppController: () => (AppController)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__(5);
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _chat_service__rspack_import_1 = __webpack_require__(7);
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


class AppController {
    // ---- gateway discovery ----
    gatewayUrl() {
        return this.chat.gatewayUrl();
    }
    // ---- users ----
    users() {
        return this.chat.getUsers();
    }
    user(id) {
        return this.chat.getUser(id);
    }
    updateUser(id, body) {
        return this.chat.updateUser(id, body);
    }
    // ---- guilds / collectives ----
    collectives(userId) {
        return this.chat.getCollectives(userId);
    }
    createCollective(body) {
        return this.chat.createCollective(body.userId, body.name);
    }
    rooms(id, userId) {
        return this.chat.getCollectiveRooms(id, userId);
    }
    createRoom(id, body) {
        return this.chat.createCollectiveRoom(id, body.userId, body);
    }
    invite(id, body) {
        return this.chat.createInvite(id, body.userId);
    }
    joinInvite(token, body) {
        return this.chat.joinByInvite(token, body.userId);
    }
    // ---- channels / rooms ----
    joinRoom(id, body) {
        return this.chat.joinRoom(id, body.userId);
    }
    members(id, userId) {
        return this.chat.getRoomMembers(id, userId);
    }
    messages(id, userId, limit, before) {
        return this.chat.getRoomMessages(id, userId, Number(limit) || 50, before);
    }
    sendMessage(id, body) {
        return this.chat.createRoomMessage(id, body.senderId ?? body.userId, body.message ?? body.content ?? '');
    }
    editMessage(roomId, messageId, body) {
        return this.chat.editMessage(roomId, messageId, body.userId, body.message);
    }
    deleteMessage(roomId, messageId, userId) {
        return this.chat.deleteMessage(roomId, messageId, userId);
    }
    // ---- voice ----
    joinVoice(id, body) {
        return this.chat.joinVoice(id, body.userId);
    }
    leaveVoice(id, body) {
        return this.chat.leaveVoice(id, body.userId);
    }
    // ---- presence ----
    presence(id, body) {
        return this.chat.setPresence(id, body.status);
    }
    // ---- DMs ----
    dms(userId) {
        return this.chat.getDirectMessages(userId);
    }
    dmHistory(userId, partnerId) {
        return this.chat.getDirectMessageHistory(userId, partnerId);
    }
    sendDm(userId, partnerId, body) {
        return this.chat.sendDirectMessage(userId, partnerId, body.message);
    }
    readDm(_userId, _partnerId) {
        return {
            ok: true
        };
    }
    addFriend(userId, partnerId) {
        return this.chat.addFriend(userId, partnerId);
    }
    constructor(chat){
        _define_property(this, "chat", void 0);
        this.chat = chat;
    }
}
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('gateway/url'),
    (0,_nestjs_common__rspack_import_0.Get)('gateway/url'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "gatewayUrl", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "users", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('users/:id'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "user", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('users/:id'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "updateUser", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('collectives'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Query)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "collectives", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('collectives'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "createCollective", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('collectives/:id/rooms'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Query)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "rooms", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('collectives/:id/rooms'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "createRoom", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('collectives/:id/invites'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "invite", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('invites/:token/join'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('token')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "joinInvite", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('rooms/:id/join'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "joinRoom", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('rooms/:id/members'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Query)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "members", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('channels/:id/messages'),
    (0,_nestjs_common__rspack_import_0.Get)('rooms/:id/messages'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Query)('userId')),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Query)('limit')),
    _ts_param(3, (0,_nestjs_common__rspack_import_0.Query)('before')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "messages", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('channels/:id/messages'),
    (0,_nestjs_common__rspack_import_0.Post)('rooms/:id/messages'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "sendMessage", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('rooms/:roomId/messages/:messageId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('roomId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('messageId')),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "editMessage", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Delete)('rooms/:roomId/messages/:messageId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('roomId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('messageId')),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Query)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "deleteMessage", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('channels/:id/join-voice'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "joinVoice", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('channels/:id/leave-voice'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "leaveVoice", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('users/:id/presence'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "presence", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('dms/:userId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "dms", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('dms/:userId/:partnerId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('userId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('partnerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "dmHistory", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('dms/:userId/:partnerId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('userId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('partnerId')),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "sendDm", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('dms/:userId/:partnerId/read'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('userId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('partnerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "readDm", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('friends/:userId/:partnerId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('userId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('partnerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "addFriend", null);
AppController = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Controller)('api'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _chat_service__rspack_import_1.ChatService === "undefined" ? Object : _chat_service__rspack_import_1.ChatService
    ])
], AppController);


},
4(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppModule: () => (AppModule)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__(5);
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _app_controller__rspack_import_1 = __webpack_require__(6);
/* import */ var _chat_service__rspack_import_2 = __webpack_require__(7);
/* import */ var _kafka_service__rspack_import_3 = __webpack_require__(16);
/* import */ var _prisma_service__rspack_import_4 = __webpack_require__(9);
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





class AppModule {
}
AppModule = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Module)({
        imports: [],
        controllers: [
            _app_controller__rspack_import_1.AppController
        ],
        providers: [
            _chat_service__rspack_import_2.ChatService,
            _kafka_service__rspack_import_3.KafkaService,
            _prisma_service__rspack_import_4.PrismaService
        ]
    })
], AppModule);


},
7(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ChatService: () => (ChatService)
});
/* import */ var crypto__rspack_import_0 = __webpack_require__(8);
/* import */ var crypto__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(crypto__rspack_import_0);
/* import */ var _nestjs_common__rspack_import_1 = __webpack_require__(5);
/* import */ var _nestjs_common__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_1);
/* import */ var _prisma_service__rspack_import_2 = __webpack_require__(9);
/* import */ var _kafka_service__rspack_import_3 = __webpack_require__(16);
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




const randomCode = ()=>(0,crypto__rspack_import_0.randomBytes)(6).toString('base64url');
function shortAgo(d) {
    const mins = Math.floor((Date.now() - d.getTime()) / 60_000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
}
const TOPICS = {
    messages: 'messages',
    presence: 'presence',
    voice: 'voice_state'
};
const s = (v)=>v == null ? undefined : String(v);
/** BigInt-safe shaping of a Message row for the wire. */ const shapeMessage = (m)=>({
        id: s(m.messageId),
        channelId: s(m.channelId),
        senderId: s(m.authorId),
        senderName: m.author?.username ?? 'Unknown',
        avatarUrl: m.author?.avatarUrl ?? null,
        message: m.content,
        createdAt: m.createdAt.toISOString(),
        editedAt: m.editedAt ? m.editedAt.toISOString() : null
    });
class ChatService {
    // ---------- users ----------
    async getUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                userId: true,
                username: true
            }
        });
        return users.map((u)=>({
                id: s(u.userId),
                name: u.username,
                username: u.username
            }));
    }
    async getUser(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                userId: BigInt(id)
            }
        });
        if (!user) throw new _nestjs_common__rspack_import_1.NotFoundException('User not found');
        return {
            id: s(user.userId),
            name: user.username,
            username: user.username,
            avatarUrl: user.avatarUrl,
            roleTitle: user.roleTitle,
            currentActivity: user.currentActivity,
            subject: user.currentActivity
        };
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.update({
            where: {
                userId: BigInt(id)
            },
            data: {
                username: data.name || undefined,
                roleTitle: data.roleTitle || undefined,
                currentActivity: data.currentActivity || undefined,
                avatarUrl: data.avatarUrl || undefined
            }
        });
        return this.getUser(s(user.userId));
    }
    // ---------- guilds ("collectives") ----------
    /** every channel in a guild that isn't a category, with last message info */ guildChannels(guildId) {
        return this.prisma.channel.findMany({
            where: {
                guildId,
                type: {
                    not: 'CATEGORY'
                }
            },
            orderBy: {
                position: 'asc'
            },
            include: {
                _count: {
                    select: {
                        messages: true
                    }
                },
                messages: {
                    orderBy: {
                        messageId: 'desc'
                    },
                    take: 1
                }
            }
        });
    }
    shapeRoom(c, memberCount, isMember) {
        const last = c.messages?.[0];
        return {
            id: s(c.channelId),
            channelId: s(c.channelId),
            collectiveId: s(c.guildId),
            name: c.name,
            topic: c.topic ?? '',
            icon: c.icon ?? 'tag',
            type: c.type,
            capacity: c.capacity,
            memberCount,
            messageCount: c._count?.messages ?? 0,
            isMember,
            lastMessage: last ? `${last.author?.username ?? 'Unknown'}: ${last.content}` : null,
            lastActiveAt: last ? last.createdAt.toISOString() : null
        };
    }
    async getCollectives(userId) {
        const uid = BigInt(userId);
        const memberships = await this.prisma.member.findMany({
            where: {
                userId: uid
            },
            select: {
                guildId: true
            }
        });
        const guildIds = memberships.map((m)=>m.guildId);
        if (!guildIds.length) return [];
        const guilds = await this.prisma.guild.findMany({
            where: {
                guildId: {
                    in: guildIds
                }
            },
            include: {
                owner: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                guildId: 'asc'
            }
        });
        const out = [];
        for (const g of guilds){
            const channels = await this.guildChannels(g.guildId);
            out.push({
                id: s(g.guildId),
                collectiveId: s(g.guildId),
                name: g.name,
                iconUrl: g.iconUrl,
                ownerId: s(g.ownerId),
                ownerName: g.owner.username,
                memberCount: g.memberCount,
                roomCount: channels.filter((c)=>c.type === 'TEXT').length
            });
        }
        return out;
    }
    async createCollective(userId, name) {
        if (!name?.trim()) throw new _nestjs_common__rspack_import_1.BadRequestException('name required');
        const uid = BigInt(userId);
        const guild = await this.prisma.guild.create({
            data: {
                name: name.trim(),
                ownerId: uid,
                memberCount: 1,
                members: {
                    create: [
                        {
                            userId: uid
                        }
                    ]
                },
                channels: {
                    create: [
                        {
                            name: 'general',
                            topic: 'General discussion'
                        }
                    ]
                }
            }
        });
        return {
            id: s(guild.guildId),
            name: guild.name
        };
    }
    async getCollectiveRooms(collectiveId, userId) {
        const gid = BigInt(collectiveId);
        const uid = BigInt(userId);
        const guild = await this.prisma.guild.findUnique({
            where: {
                guildId: gid
            }
        });
        if (!guild) throw new _nestjs_common__rspack_import_1.NotFoundException('Collective not found');
        const isMember = !!await this.prisma.member.findUnique({
            where: {
                guildId_userId: {
                    guildId: gid,
                    userId: uid
                }
            }
        });
        const channels = await this.guildChannels(gid);
        return channels.map((c)=>this.shapeRoom(c, guild.memberCount, isMember));
    }
    async createCollectiveRoom(collectiveId, userId, data) {
        const gid = BigInt(collectiveId);
        await this.assertMember(gid, BigInt(userId));
        if (!data.name?.trim()) throw new _nestjs_common__rspack_import_1.BadRequestException('name required');
        const count = await this.prisma.channel.count({
            where: {
                guildId: gid
            }
        });
        const channel = await this.prisma.channel.create({
            data: {
                guildId: gid,
                name: data.name.trim().toLowerCase().replace(/\s+/g, '-'),
                topic: data.topic?.trim() || null,
                icon: data.icon || 'tag',
                type: data.type === 'VOICE' ? 'VOICE' : 'TEXT',
                capacity: Math.min(Math.max(Number(data.capacity) || 100, 2), 100_000),
                position: count
            }
        });
        return {
            id: s(channel.channelId),
            name: channel.name
        };
    }
    // ---------- membership / invites ----------
    async assertMember(guildId, userId) {
        const ok = await this.prisma.member.findUnique({
            where: {
                guildId_userId: {
                    guildId,
                    userId
                }
            }
        });
        if (!ok) throw new _nestjs_common__rspack_import_1.ForbiddenException('Not a member of this collective');
    }
    async joinRoom(roomId, userId) {
        const cid = BigInt(roomId);
        const uid = BigInt(userId);
        const channel = await this.prisma.channel.findUnique({
            where: {
                channelId: cid
            }
        });
        if (!channel) throw new _nestjs_common__rspack_import_1.NotFoundException('Room not found');
        const member = await this.prisma.member.findUnique({
            where: {
                guildId_userId: {
                    guildId: channel.guildId,
                    userId: uid
                }
            }
        });
        if (!member) {
            await this.prisma.$transaction([
                this.prisma.member.create({
                    data: {
                        guildId: channel.guildId,
                        userId: uid
                    }
                }),
                this.prisma.guild.update({
                    where: {
                        guildId: channel.guildId
                    },
                    data: {
                        memberCount: {
                            increment: 1
                        }
                    }
                })
            ]);
        }
        return {
            ok: true,
            collectiveId: s(channel.guildId)
        };
    }
    async createInvite(collectiveId, userId) {
        const gid = BigInt(collectiveId);
        await this.assertMember(gid, BigInt(userId));
        const invite = await this.prisma.invite.create({
            data: {
                guildId: gid,
                code: randomCode(),
                createdById: BigInt(userId)
            }
        });
        return {
            token: invite.code,
            collectiveId: s(invite.guildId)
        };
    }
    async joinByInvite(token, userId) {
        const uid = BigInt(userId);
        const invite = await this.prisma.invite.findUnique({
            where: {
                code: token
            }
        });
        if (!invite) throw new _nestjs_common__rspack_import_1.NotFoundException('Invalid invite');
        const existing = await this.prisma.member.findUnique({
            where: {
                guildId_userId: {
                    guildId: invite.guildId,
                    userId: uid
                }
            }
        });
        if (!existing) {
            await this.prisma.$transaction([
                this.prisma.member.create({
                    data: {
                        guildId: invite.guildId,
                        userId: uid
                    }
                }),
                this.prisma.guild.update({
                    where: {
                        guildId: invite.guildId
                    },
                    data: {
                        memberCount: {
                            increment: 1
                        }
                    }
                })
            ]);
        }
        const guild = await this.prisma.guild.findUnique({
            where: {
                guildId: invite.guildId
            }
        });
        return {
            id: s(invite.guildId),
            name: guild?.name
        };
    }
    // ---------- messages ----------
    /**
   * Resolve a room id against BOTH channel tables. Guild channels and DM
   * channels now share one id sequence, but an id can only live in one of them.
   */ async resolveChannel(cid) {
        const guildChannel = await this.prisma.channel.findUnique({
            where: {
                channelId: cid
            }
        });
        if (guildChannel) return {
            kind: 'guild',
            channel: guildChannel
        };
        const dmChannel = await this.prisma.directChannel.findUnique({
            where: {
                channelId: cid
            }
        });
        if (dmChannel) return {
            kind: 'dm',
            channel: dmChannel
        };
        throw new _nestjs_common__rspack_import_1.NotFoundException('Room not found');
    }
    /** Membership check that works for guild channels and DM channels alike. */ async assertCanReadChannel(channelId, userId) {
        const resolved = await this.resolveChannel(channelId);
        if (resolved.kind === 'guild') {
            await this.assertMember(resolved.channel.guildId, userId);
        } else {
            const isMember = await this.prisma.directChannelMember.findFirst({
                where: {
                    channelId,
                    userId
                },
                select: {
                    channelId: true
                }
            });
            if (!isMember) throw new _nestjs_common__rspack_import_1.ForbiddenException('Not a member of this conversation');
        }
        return resolved;
    }
    async getRoomMessages(roomId, userId, limit = 50, before) {
        const cid = BigInt(roomId);
        await this.assertCanReadChannel(cid, BigInt(userId));
        const take = Math.min(Math.max(Number(limit) || 50, 1), 100);
        const messages = await this.prisma.message.findMany({
            where: {
                channelId: cid,
                ...before ? {
                    messageId: {
                        lt: BigInt(before)
                    }
                } : {}
            },
            orderBy: {
                messageId: 'desc'
            },
            take: take + 1,
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });
        const hasMore = messages.length > take;
        return {
            items: messages.slice(0, take).reverse().map(shapeMessage),
            hasMore
        };
    }
    /** Guild channels only (used by the roster endpoint). */ async assertGuildChannel(channelId, userId) {
        const resolved = await this.resolveChannel(channelId);
        if (resolved.kind !== 'guild') throw new _nestjs_common__rspack_import_1.NotFoundException('Room not found');
        await this.assertMember(resolved.channel.guildId, userId);
        return resolved.channel;
    }
    /** Spec flow: validate -> persist -> publish to Kafka (key = channel_id) */ async createRoomMessage(roomId, senderId, content) {
        const cid = BigInt(roomId);
        const uid = BigInt(senderId);
        const text = String(content ?? '').trim();
        if (!text) throw new _nestjs_common__rspack_import_1.BadRequestException('Empty message');
        if (text.length > 4000) throw new _nestjs_common__rspack_import_1.BadRequestException('Message too long');
        // Works for guild channels AND DM channels (the old code rejected every DM).
        const resolved = await this.assertCanReadChannel(cid, uid);
        const message = await this.prisma.message.create({
            data: {
                channelId: cid,
                authorId: uid,
                content: text
            },
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });
        const payload = {
            channel_id: String(cid),
            ...resolved.kind === 'guild' ? {
                guild_id: String(resolved.channel.guildId)
            } : {},
            message_id: String(message.messageId),
            author_id: String(message.authorId),
            author: {
                id: String(message.authorId),
                username: message.author.username
            },
            content: message.content,
            timestamp: message.createdAt.toISOString()
        };
        // fire-and-forget; ordering guaranteed by partition key = channel_id
        void this.kafka.publish(TOPICS.messages, `channel:${cid}`, payload);
        return shapeMessage(message);
    }
    async editMessage(roomId, messageId, userId, content) {
        const mid = BigInt(messageId);
        const message = await this.prisma.message.findUnique({
            where: {
                messageId: mid
            }
        });
        if (!message || String(message.channelId) !== roomId) throw new _nestjs_common__rspack_import_1.NotFoundException('Message not found');
        if (message.authorId !== BigInt(userId)) throw new _nestjs_common__rspack_import_1.ForbiddenException('Cannot edit');
        const updated = await this.prisma.message.update({
            where: {
                messageId: mid
            },
            data: {
                content: String(content).trim(),
                editedAt: new Date()
            },
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });
        void this.kafka.publish(TOPICS.messages, `channel:${message.channelId}`, {
            channel_id: String(message.channelId),
            message_id: String(mid),
            type: 'MESSAGE_EDIT',
            content: updated.content,
            timestamp: new Date().toISOString()
        });
        return shapeMessage(updated);
    }
    async deleteMessage(roomId, messageId, userId) {
        const mid = BigInt(messageId);
        const message = await this.prisma.message.findUnique({
            where: {
                messageId: mid
            }
        });
        if (!message || String(message.channelId) !== roomId) throw new _nestjs_common__rspack_import_1.NotFoundException('Message not found');
        if (message.authorId !== BigInt(userId)) throw new _nestjs_common__rspack_import_1.ForbiddenException('Cannot delete');
        await this.prisma.message.delete({
            where: {
                messageId: mid
            }
        });
        void this.kafka.publish(TOPICS.messages, `channel:${message.channelId}`, {
            channel_id: String(message.channelId),
            message_id: String(mid),
            type: 'MESSAGE_DELETE',
            timestamp: new Date().toISOString()
        });
        return {
            ok: true,
            id: String(mid)
        };
    }
    // ---------- roster / presence ----------
    async getRoomMembers(roomId, userId) {
        const cid = BigInt(roomId);
        const channel = await this.assertGuildChannel(cid, BigInt(userId));
        const members = await this.prisma.member.findMany({
            where: {
                guildId: channel.guildId
            },
            include: {
                user: true
            },
            orderBy: {
                joinedAt: 'asc'
            }
        });
        return members.map((m)=>({
                id: s(m.userId),
                userId: s(m.userId),
                username: m.user.username,
                name: m.user.username,
                nickname: m.nickname,
                avatarUrl: m.user.avatarUrl,
                roleTitle: m.user.roleTitle,
                currentActivity: m.user.currentActivity,
                status: m.user.lastPresence ?? 'offline',
                inVoice: m.voiceChannelId != null,
                voiceChannelId: s(m.voiceChannelId)
            }));
    }
    async setPresence(userId, status) {
        const uid = BigInt(userId);
        if (![
            'online',
            'idle',
            'dnd'
        ].includes(status)) throw new _nestjs_common__rspack_import_1.BadRequestException('bad status');
        await this.prisma.user.update({
            where: {
                userId: uid
            },
            data: {
                lastPresence: status
            }
        });
        void this.kafka.publish(TOPICS.presence, `user:${uid}`, {
            user_id: String(uid),
            status,
            timestamp: new Date().toISOString()
        });
        return {
            ok: true
        };
    }
    // ---------- DMs (friend graph, direct channels) ----------
    async getDirectMessages(userId) {
        const uid = BigInt(userId);
        const friendships = await this.prisma.friendship.findMany({
            where: {
                userId: uid
            },
            include: {
                friend: true
            }
        });
        const out = [];
        for (const f of friendships){
            const dm = await this.getOrCreateDm(uid, f.friendId);
            const last = await this.prisma.message.findFirst({
                where: {
                    channelId: dm.channelId
                },
                orderBy: {
                    messageId: 'desc'
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            const unread = await this.prisma.message.count({
                where: {
                    channelId: dm.channelId,
                    authorId: {
                        not: uid
                    }
                }
            });
            out.push({
                partnerId: s(f.friendId),
                id: s(f.friendId),
                name: f.friend.username,
                username: f.friend.username,
                avatarUrl: f.friend.avatarUrl,
                roleTitle: f.friend.roleTitle,
                status: f.friend.lastPresence ?? 'offline',
                channelId: s(dm.channelId),
                lastMessage: last ? `${last.authorId === uid ? 'You' : last.author.username}: ${last.content}` : null,
                lastActiveLabel: last ? shortAgo(last.createdAt) : '',
                unreadCount: unread
            });
        }
        return out;
    }
    async getDirectMessageHistory(userId, partnerId) {
        const dm = await this.getOrCreateDm(BigInt(userId), BigInt(partnerId));
        const messages = await this.prisma.message.findMany({
            where: {
                channelId: dm.channelId
            },
            orderBy: {
                messageId: 'asc'
            },
            take: 200,
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return messages.map(shapeMessage);
    }
    async sendDirectMessage(userId, partnerId, content) {
        const dm = await this.getOrCreateDm(BigInt(userId), BigInt(partnerId));
        return this.createRoomMessage(String(dm.channelId), userId, content);
    }
    async getOrCreateDm(a, b) {
        if (a === b) throw new _nestjs_common__rspack_import_1.BadRequestException('Cannot DM self');
        const lo = a < b ? a : b;
        const hi = a < b ? b : a;
        let dm = await this.prisma.directChannel.findUnique({
            where: {
                userA_userB: {
                    userA: lo,
                    userB: hi
                }
            }
        });
        if (!dm) {
            dm = await this.prisma.directChannel.create({
                data: {
                    userA: lo,
                    userB: hi
                }
            });
            await this.prisma.directChannelMember.createMany({
                data: [
                    {
                        channelId: dm.channelId,
                        userId: lo
                    },
                    {
                        channelId: dm.channelId,
                        userId: hi
                    }
                ]
            });
        }
        return dm;
    }
    /** add friend both ways -> creates DM channel */ async addFriend(userId, partnerId) {
        const a = BigInt(userId);
        const b = BigInt(partnerId);
        await this.prisma.$transaction([
            this.prisma.friendship.upsert({
                where: {
                    userId_friendId: {
                        userId: a,
                        friendId: b
                    }
                },
                update: {},
                create: {
                    userId: a,
                    friendId: b
                }
            }),
            this.prisma.friendship.upsert({
                where: {
                    userId_friendId: {
                        userId: b,
                        friendId: a
                    }
                },
                update: {},
                create: {
                    userId: b,
                    friendId: a
                }
            })
        ]);
        await this.getOrCreateDm(a, b);
        return {
            ok: true
        };
    }
    // ---------- voice signaling passthrough events ----------
    async joinVoice(channelId, userId) {
        const cid = BigInt(channelId);
        const uid = BigInt(userId);
        const channel = await this.prisma.channel.findUnique({
            where: {
                channelId: cid
            }
        });
        if (!channel || channel.type !== 'VOICE') throw new _nestjs_common__rspack_import_1.BadRequestException('Not a voice channel');
        await this.assertMember(channel.guildId, uid);
        await this.prisma.member.update({
            where: {
                guildId_userId: {
                    guildId: channel.guildId,
                    userId: uid
                }
            },
            data: {
                voiceChannelId: cid
            }
        });
        void this.kafka.publish(TOPICS.voice, `guild:${channel.guildId}`, {
            user_id: String(uid),
            channel_id: String(cid),
            guild_id: String(channel.guildId),
            action: 'join',
            self_mute: false,
            self_deaf: false
        });
        return {
            ok: true,
            sfu: process.env.SFU_URL ?? 'wss://sfu.local.example/stream'
        };
    }
    async leaveVoice(channelId, userId) {
        const cid = BigInt(channelId);
        const uid = BigInt(userId);
        const channel = await this.prisma.channel.findUnique({
            where: {
                channelId: cid
            }
        });
        if (!channel) throw new _nestjs_common__rspack_import_1.NotFoundException('Channel not found');
        await this.prisma.member.updateMany({
            where: {
                guildId: channel.guildId,
                userId: uid,
                voiceChannelId: cid
            },
            data: {
                voiceChannelId: null
            }
        });
        void this.kafka.publish(TOPICS.voice, `guild:${channel.guildId}`, {
            user_id: String(uid),
            channel_id: String(cid),
            guild_id: String(channel.guildId),
            action: 'leave',
            self_mute: false,
            self_deaf: false
        });
        return {
            ok: true
        };
    }
    gatewayUrl() {
        return {
            url: process.env.GATEWAY_PUBLIC_URL ?? 'ws://localhost:3001/gateway'
        };
    }
    constructor(prisma, kafka){
        _define_property(this, "prisma", void 0);
        _define_property(this, "kafka", void 0);
        this.prisma = prisma;
        this.kafka = kafka;
    }
}
ChatService = _ts_decorate([
    (0,_nestjs_common__rspack_import_1.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prisma_service__rspack_import_2.PrismaService === "undefined" ? Object : _prisma_service__rspack_import_2.PrismaService,
        typeof _kafka_service__rspack_import_3.KafkaService === "undefined" ? Object : _kafka_service__rspack_import_3.KafkaService
    ])
], ChatService);


},
16(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KafkaService: () => (KafkaService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__(5);
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var kafkajs__rspack_import_1 = __webpack_require__(17);
/* import */ var kafkajs__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(kafkajs__rspack_import_1);
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
    async onModuleInit() {
        try {
            await this.producer.connect();
            this.connected = true;
            this.log.log('producer connected');
        } catch (e) {
            this.log.warn(`Kafka unavailable: ${e.message}`);
        }
    }
    async publish(topic, key, value) {
        if (!this.connected) return false;
        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key,
                        value: JSON.stringify(value)
                    }
                ]
            });
            return true;
        } catch (e) {
            this.log.warn(`publish ${topic} failed: ${e.message}`);
            return false;
        }
    }
    async onModuleDestroy() {
        if (this.connected) await this.producer.disconnect().catch(()=>undefined);
    }
    constructor(){
        _define_property(this, "log", new _nestjs_common__rspack_import_0.Logger(KafkaService.name));
        _define_property(this, "kafka", new kafkajs__rspack_import_1.Kafka({
            clientId: 'chatsystem-api',
            brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
            logLevel: kafkajs__rspack_import_1.logLevel.WARN
        }));
        _define_property(this, "producer", this.kafka.producer({
            createPartitioner: kafkajs__rspack_import_1.Partitioners.DefaultPartitioner
        }));
        _define_property(this, "connected", false);
    }
}
KafkaService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)()
], KafkaService);


},
9(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  PrismaService: () => (PrismaService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__(5);
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _prisma_adapter_pg__rspack_import_1 = __webpack_require__(10);
/* import */ var _prisma_adapter_pg__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_prisma_adapter_pg__rspack_import_1);
/* import */ var _generated_prisma_client__rspack_import_2 = __webpack_require__(11);
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


// apps/chatsystem/src -> repo root = 4 levels up

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
11(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  $Enums: () => (/* reexport module object */ _enums__rspack_import_2),
  ChannelType: () => (/* reexport safe */ _enums__rspack_import_2.ChannelType),
  Prisma: () => (/* reexport module object */ _internal_prismaNamespace__rspack_import_1),
  PrismaClient: () => (PrismaClient)
});
/* import */ var _internal_class__rspack_import_0 = __webpack_require__(12);
/* import */ var _internal_prismaNamespace__rspack_import_1 = __webpack_require__(14);
/* import */ var _enums__rspack_import_2 = __webpack_require__(15);
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
15(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
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
12(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getPrismaClientClass: () => (getPrismaClientClass)
});
/* import */ var _prisma_client_runtime_client__rspack_import_0 = __webpack_require__(13);
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
    const { Buffer } = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 18, 23));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async ()=>await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 19, 23)),
    getQueryCompilerWasmModule: async ()=>{
        const { wasm } = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 20, 23));
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return _prisma_client_runtime_client__rspack_import_0.getPrismaClient(config);
}


},
14(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
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
/* import */ var _prisma_client_runtime_client__rspack_import_0 = __webpack_require__(13);
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
5(module) {
module.exports = require("@nestjs/common");

},
3(module) {
module.exports = require("@nestjs/core");

},
10(module) {
module.exports = require("@prisma/adapter-pg");

},
13(module) {
module.exports = require("@prisma/client/runtime/client");

},
19(module) {
module.exports = require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js");

},
20(module) {
module.exports = require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");

},
1(module) {
module.exports = require("dotenv/config");

},
17(module) {
module.exports = require("kafkajs");

},
8(module) {
module.exports = require("crypto");

},
18(module) {
module.exports = require("node:buffer");

},
2(module) {
module.exports = require("node:path");

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
/* import */ var dotenv_config__rspack_import_0 = __webpack_require__(1);
/* import */ var dotenv_config__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(dotenv_config__rspack_import_0);
/* import */ var node_path__rspack_import_1 = __webpack_require__(2);
/* import */ var node_path__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(node_path__rspack_import_1);
/* import */ var _nestjs_core__rspack_import_2 = __webpack_require__(3);
/* import */ var _nestjs_core__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(_nestjs_core__rspack_import_2);
/* import */ var _app_module__rspack_import_3 = __webpack_require__(4);




async function bootstrap() {
    const app = await _nestjs_core__rspack_import_2.NestFactory.create(_app_module__rspack_import_3.AppModule);
    app.useStaticAssets((0,node_path__rspack_import_1.join)(process.cwd(), 'client'));
    app.enableCors({
        origin: true
    });
    await app.listen(process.env.CHAT_PORT ?? process.env.PORT ?? 3000);
}
void bootstrap();

})();

module.exports = __webpack_exports__;
})()
;
//# sourceMappingURL=main.js.map