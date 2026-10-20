(() => {
"use strict";
var __webpack_modules__ = ({
"./apps/chatsystem/src/app.controller.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppController: () => (AppController)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _chat_service__rspack_import_1 = __webpack_require__("./apps/chatsystem/src/chat.service.ts");
/* import */ var _user_tag_decorator__rspack_import_2 = __webpack_require__("./apps/chatsystem/src/user-tag.decorator.ts");
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
    gatewayUrl() {
        return this.chat.gatewayUrl();
    }
    // ---- users ----
    users(tag) {
        return this.chat.getUsers(tag);
    }
    user(id, tag) {
        return this.chat.getUser(id, tag);
    }
    updateUser(id, tag, body) {
        return this.chat.updateUser(id, tag, body);
    }
    // ---- presence ----
    presence(tag, body) {
        return this.chat.setPresence(tag, body.status);
    }
    // ---- guilds / collectives ----
    collectives(tag) {
        return this.chat.getCollectives(tag);
    }
    createCollective(tag, body) {
        return this.chat.createCollective(tag, body.name);
    }
    rooms(id, tag) {
        return this.chat.getCollectiveRooms(id, tag);
    }
    createRoom(id, tag, body) {
        return this.chat.createCollectiveRoom(id, tag, body);
    }
    invite(id, tag) {
        return this.chat.createInvite(id, tag);
    }
    joinInvite(token, tag) {
        return this.chat.joinByInvite(token, tag);
    }
    // ---- channels / rooms ----
    // @Post('rooms/:id/join')
    // joinRoom(@Param('id') id: string, @UserTag() tag: string) {
    //   return this.chat.joinRoom(id, tag);
    // }
    members(id, tag) {
        return this.chat.getRoomMembers(id, tag);
    }
    messages(id, tag, limit, before) {
        return this.chat.getRoomMessages(id, tag, Number(limit) || 50, before);
    }
    channelMessages(id, tag, limit, before) {
        return this.chat.getRoomMessages(id, tag, Number(limit) || 50, before);
    }
    sendMessage(id, tag, body) {
        return this.chat.createRoomMessage(id, tag, body.message ?? body.content ?? '');
    }
    channelSendMessage(id, tag, body) {
        return this.chat.createRoomMessage(id, tag, body.message ?? body.content ?? '');
    }
    editMessage(roomId, messageId, tag, body) {
        return this.chat.editMessage(roomId, messageId, tag, body.message);
    }
    deleteMessage(roomId, messageId, tag) {
        return this.chat.deleteMessage(roomId, messageId, tag);
    }
    // ---- voice ----
    joinVoice(id, tag) {
        return this.chat.joinVoice(id, tag);
    }
    leaveVoice(id, tag) {
        return this.chat.leaveVoice(id, tag);
    }
    // ---- DMs (caller = header, :partnerId = public numeric id) ----
    dms(tag) {
        return this.chat.getDirectMessages(tag);
    }
    dmHistory(tag, partnerId) {
        return this.chat.getDirectMessageHistory(tag, partnerId);
    }
    sendDm(tag, partnerId, body) {
        return this.chat.sendDirectMessage(tag, partnerId, body.message);
    }
    readDm(tag, partnerId) {
        return this.chat.markDmRead(tag, partnerId);
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
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "users", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('users/:id'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "user", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('users/:id'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "updateUser", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('users/me/presence'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "presence", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('collectives'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "collectives", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('collectives'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "createCollective", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('collectives/:id/rooms'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
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
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "createRoom", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('collectives/:id/invites'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "invite", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('invites/:token/join'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('token')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "joinInvite", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('rooms/:id/members'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "members", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('rooms/:id/messages'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
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
    (0,_nestjs_common__rspack_import_0.Get)('channels/:id/messages'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
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
], AppController.prototype, "channelMessages", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('rooms/:id/messages'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "sendMessage", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('channels/:id/messages'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(2, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "channelSendMessage", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Patch)('rooms/:roomId/messages/:messageId'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('roomId')),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('messageId')),
    _ts_param(2, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(3, (0,_nestjs_common__rspack_import_0.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
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
    _ts_param(2, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
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
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "joinVoice", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('channels/:id/leave-voice'),
    _ts_param(0, (0,_nestjs_common__rspack_import_0.Param)('id')),
    _ts_param(1, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "leaveVoice", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('dms'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "dms", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Get)('dms/:partnerId'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('partnerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "dmHistory", null);
_ts_decorate([
    (0,_nestjs_common__rspack_import_0.Post)('dms/:partnerId'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
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
    (0,_nestjs_common__rspack_import_0.Patch)('dms/:partnerId/read'),
    _ts_param(0, (0,_user_tag_decorator__rspack_import_2.UserTag)()),
    _ts_param(1, (0,_nestjs_common__rspack_import_0.Param)('partnerId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AppController.prototype, "readDm", null);
AppController = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Controller)('api'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _chat_service__rspack_import_1.ChatService === "undefined" ? Object : _chat_service__rspack_import_1.ChatService
    ])
], AppController);


},
"./apps/chatsystem/src/app.module.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AppModule: () => (AppModule)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _app_controller__rspack_import_1 = __webpack_require__("./apps/chatsystem/src/app.controller.ts");
/* import */ var _chat_service__rspack_import_2 = __webpack_require__("./apps/chatsystem/src/chat.service.ts");
/* import */ var _kafka_service__rspack_import_3 = __webpack_require__("./apps/chatsystem/src/kafka.service.ts");
/* import */ var _prisma_service__rspack_import_4 = __webpack_require__("./apps/chatsystem/src/prisma.service.ts");
/* import */ var _auth_check_service__rspack_import_5 = __webpack_require__("./apps/chatsystem/src/auth-check.service.ts");
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
            _prisma_service__rspack_import_4.PrismaService,
            _auth_check_service__rspack_import_5.UserCheckService
        ]
    })
], AppModule);


},
"./apps/chatsystem/src/auth-check.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  UserCheckService: () => (UserCheckService),
  parseId: () => (parseId)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var _prisma_service__rspack_import_1 = __webpack_require__("./apps/chatsystem/src/prisma.service.ts");
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


function parseId(value, name = 'id') {
    if (!/^\d+$/.test(value ?? '')) throw new _nestjs_common__rspack_import_0.BadRequestException(`Invalid ${name}`);
    {
        return BigInt(value);
    }
}
class UserCheckService {
    async requireUser(userTagId) {
        if (typeof userTagId !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(userTagId)) throw new _nestjs_common__rspack_import_0.UnauthorizedException();
        const user = await this.prisma.user.findUnique({
            where: {
                userTagId
            },
            select: {
                userId: true,
                username: true
            }
        });
        if (!user) throw new _nestjs_common__rspack_import_0.UnauthorizedException();
        return user;
    }
    constructor(prisma){
        _define_property(this, "prisma", void 0);
        this.prisma = prisma;
    }
}
UserCheckService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prisma_service__rspack_import_1.PrismaService === "undefined" ? Object : _prisma_service__rspack_import_1.PrismaService
    ])
], UserCheckService);


},
"./apps/chatsystem/src/chat.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ChatService: () => (ChatService)
});
/* import */ var crypto__rspack_import_0 = __webpack_require__("crypto");
/* import */ var crypto__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(crypto__rspack_import_0);
/* import */ var _nestjs_common__rspack_import_1 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_1);
/* import */ var _prisma_service__rspack_import_2 = __webpack_require__("./apps/chatsystem/src/prisma.service.ts");
/* import */ var _kafka_service__rspack_import_3 = __webpack_require__("./apps/chatsystem/src/kafka.service.ts");
/* import */ var _auth_check_service__rspack_import_4 = __webpack_require__("./apps/chatsystem/src/auth-check.service.ts");
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
/** BigInt-safe shaping of a Message row for the wire. Never include userTagId. */ const shapeMessage = (m)=>({
        id: s(m.messageId),
        channelId: s(m.channelId ?? m.dmChannelId),
        senderId: s(m.authorId),
        senderName: m.author?.username ?? 'Unknown',
        avatarUrl: m.author?.avatarUrl ?? null,
        message: m.content,
        createdAt: m.createdAt.toISOString(),
        editedAt: m.editedAt ? m.editedAt.toISOString() : null
    });
class ChatService {
    // ---------- identity helpers ----------
    /**
   * Caller identity. Input = userTagId (secret hash from client).
   * Output = internal numeric User.userId. 401 on fail.
   */ async uid(userTagId) {
        return (await this.userCheck.requireUser(userTagId)).userId;
    }
    /** Target user (public numeric id, not the caller): 400 / 404. */ async targetUser(id, name = 'id') {
        const uid = (0,_auth_check_service__rspack_import_4.parseId)(id, name);
        const u = await this.prisma.user.findUnique({
            where: {
                userId: uid
            },
            select: {
                userId: true
            }
        });
        if (!u) throw new _nestjs_common__rspack_import_1.NotFoundException('User not found');
        return uid;
    }
    // ---------- users ----------
    async getUsers(userTagId) {
        const uid = await this.uid(userTagId);
        const users = await this.prisma.user.findMany({
            where: {
                userId: uid
            },
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
    async getUser(id, userTagId) {
        const uid = (0,_auth_check_service__rspack_import_4.parseId)(id, 'id');
        const callerId = await this.uid(userTagId);
        if (uid !== callerId) throw new _nestjs_common__rspack_import_1.ForbiddenException('Cannot read another user');
        const user = await this.prisma.user.findUnique({
            where: {
                userId: uid
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
            subject: user.currentActivity,
            status: user.lastPresence ?? 'offline'
        };
    }
    /** Caller must be the user being edited. */ async updateUser(id, userTagId, data) {
        const callerId = await this.uid(userTagId);
        const targetId = (0,_auth_check_service__rspack_import_4.parseId)(id, 'id');
        if (callerId !== targetId) throw new _nestjs_common__rspack_import_1.ForbiddenException('Cannot edit another user');
        await this.prisma.user.update({
            where: {
                userId: targetId
            },
            data: {
                username: data.name || undefined,
                roleTitle: data.roleTitle || undefined,
                currentActivity: data.currentActivity || undefined,
                avatarUrl: data.avatarUrl || undefined
            }
        });
        return this.getUser(String(targetId), userTagId);
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
                    take: 1,
                    include: {
                        author: {
                            select: {
                                username: true
                            }
                        }
                    }
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
    async getCollectives(userTagId) {
        const uid = await this.uid(userTagId);
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
    async createCollective(userTagId, name) {
        const uid = await this.uid(userTagId);
        if (!name?.trim()) throw new _nestjs_common__rspack_import_1.BadRequestException('name required');
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
    async getCollectiveRooms(collectiveId, userTagId) {
        const uid = await this.uid(userTagId);
        const gid = (0,_auth_check_service__rspack_import_4.parseId)(collectiveId, 'collectiveId');
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
        if (!isMember) throw new _nestjs_common__rspack_import_1.ForbiddenException('Not a member of this collective');
        const channels = await this.guildChannels(gid);
        return channels.map((c)=>this.shapeRoom(c, guild.memberCount, isMember));
    }
    async createCollectiveRoom(collectiveId, userTagId, data) {
        const uid = await this.uid(userTagId);
        const gid = (0,_auth_check_service__rspack_import_4.parseId)(collectiveId, 'collectiveId');
        await this.assertMember(gid, uid);
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
    // async joinRoom(roomId: string, userTagId: string) {
    //   const uid = await this.uid(userTagId);
    //   const cid = parseId(roomId, 'roomId');
    //   const channel = await this.prisma.channel.findUnique({ where: { channelId: cid } });
    //   if (!channel) throw new NotFoundException('Room not found');
    //   const member = await this.prisma.member.findUnique({
    //     where: { guildId_userId: { guildId: channel.guildId, userId: uid } },
    //   });
    //   if (!member) {
    //     await this.prisma.$transaction([
    //       this.prisma.member.create({ data: { guildId: channel.guildId, userId: uid } }),
    //       this.prisma.guild.update({
    //         where: { guildId: channel.guildId },
    //         data: { memberCount: { increment: 1 } },
    //       }),
    //     ]);
    //   }
    //   return { ok: true, collectiveId: s(channel.guildId) };
    // }
    async createInvite(collectiveId, userTagId) {
        const uid = await this.uid(userTagId);
        const gid = (0,_auth_check_service__rspack_import_4.parseId)(collectiveId, 'collectiveId');
        await this.assertMember(gid, uid);
        const invite = await this.prisma.invite.create({
            data: {
                guildId: gid,
                code: randomCode(),
                createdById: uid
            }
        });
        return {
            token: invite.code,
            collectiveId: s(invite.guildId)
        };
    }
    async joinByInvite(token, userTagId) {
        const uid = await this.uid(userTagId);
        const invite = await this.prisma.invite.findUnique({
            where: {
                code: String(token ?? '')
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
   * Resolve a room id against BOTH channel tables. Missing room -> 403
   * (same as no access) so ids can't be probed.
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
        throw new _nestjs_common__rspack_import_1.ForbiddenException('No access');
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
    async getRoomMessages(roomId, userTagId, limit = 50, before) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(roomId, 'roomId');
        const beforeId = before ? (0,_auth_check_service__rspack_import_4.parseId)(before, 'before') : undefined;
        const resolved = await this.assertCanReadChannel(cid, uid);
        const take = Math.min(Math.max(Number(limit) || 50, 1), 100);
        const messages = await this.prisma.message.findMany({
            where: {
                ...resolved.kind === 'guild' ? {
                    channelId: cid
                } : {
                    dmChannelId: cid
                },
                ...beforeId !== undefined ? {
                    messageId: {
                        lt: beforeId
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
        if (resolved.kind !== 'guild') throw new _nestjs_common__rspack_import_1.ForbiddenException('No access');
        await this.assertMember(resolved.channel.guildId, userId);
        return resolved.channel;
    }
    /** Public entry: caller identified by userTagId. */ async createRoomMessage(roomId, userTagId, content) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(roomId, 'roomId');
        return this.postMessage(uid, cid, content);
    }
    /** Internal: identity already verified. validate -> persist -> publish to Kafka. */ async postMessage(uid, cid, content) {
        const text = String(content ?? '').trim();
        if (!text) throw new _nestjs_common__rspack_import_1.BadRequestException('Empty message');
        if (text.length > 4000) throw new _nestjs_common__rspack_import_1.BadRequestException('Message too long');
        const resolved = await this.assertCanReadChannel(cid, uid);
        const message = await this.prisma.message.create({
            data: {
                ...resolved.kind === 'guild' ? {
                    channelId: cid
                } : {
                    dmChannelId: cid
                },
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
    async editMessage(roomId, messageId, userTagId, content) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(roomId, 'roomId');
        const mid = (0,_auth_check_service__rspack_import_4.parseId)(messageId, 'messageId');
        const text = String(content ?? '').trim();
        if (!text) throw new _nestjs_common__rspack_import_1.BadRequestException('Empty message');
        if (text.length > 4000) throw new _nestjs_common__rspack_import_1.BadRequestException('Message too long');
        const message = await this.prisma.message.findUnique({
            where: {
                messageId: mid
            }
        });
        if (!message || (message.channelId ?? message.dmChannelId) !== cid) throw new _nestjs_common__rspack_import_1.NotFoundException('Message not found');
        if (message.authorId !== uid) throw new _nestjs_common__rspack_import_1.ForbiddenException('Cannot edit');
        const updated = await this.prisma.message.update({
            where: {
                messageId: mid
            },
            data: {
                content: text,
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
        const messageChannelId = message.channelId ?? message.dmChannelId;
        void this.kafka.publish(TOPICS.messages, `channel:${messageChannelId}`, {
            channel_id: String(messageChannelId),
            message_id: String(mid),
            type: 'MESSAGE_EDIT',
            content: updated.content,
            timestamp: new Date().toISOString()
        });
        return shapeMessage(updated);
    }
    async deleteMessage(roomId, messageId, userTagId) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(roomId, 'roomId');
        const mid = (0,_auth_check_service__rspack_import_4.parseId)(messageId, 'messageId');
        const message = await this.prisma.message.findUnique({
            where: {
                messageId: mid
            }
        });
        if (!message || (message.channelId ?? message.dmChannelId) !== cid) throw new _nestjs_common__rspack_import_1.NotFoundException('Message not found');
        if (message.authorId !== uid) throw new _nestjs_common__rspack_import_1.ForbiddenException('Cannot delete');
        await this.prisma.message.delete({
            where: {
                messageId: mid
            }
        });
        const messageChannelId = message.channelId ?? message.dmChannelId;
        void this.kafka.publish(TOPICS.messages, `channel:${messageChannelId}`, {
            channel_id: String(messageChannelId),
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
    async getRoomMembers(roomId, userTagId) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(roomId, 'roomId');
        const channel = await this.assertGuildChannel(cid, uid);
        const members = await this.prisma.member.findMany({
            where: {
                guildId: channel.guildId
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatarUrl: true,
                        roleTitle: true,
                        currentActivity: true,
                        lastPresence: true
                    }
                }
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
    async setPresence(userTagId, status) {
        const uid = await this.uid(userTagId);
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
    async getDirectMessages(userTagId) {
        const uid = await this.uid(userTagId);
        const friendships = await this.prisma.friendship.findMany({
            where: {
                userId: uid
            },
            include: {
                friend: {
                    select: {
                        username: true,
                        avatarUrl: true,
                        roleTitle: true,
                        lastPresence: true
                    }
                }
            }
        });
        const out = [];
        for (const f of friendships){
            const lo = uid < f.friendId ? uid : f.friendId;
            const hi = uid < f.friendId ? f.friendId : uid;
            const dm = await this.prisma.directChannel.findUnique({
                where: {
                    userA_userB: {
                        userA: lo,
                        userB: hi
                    }
                }
            });
            if (!dm) {
                out.push({
                    partnerId: s(f.friendId),
                    id: s(f.friendId),
                    name: f.friend.username,
                    username: f.friend.username,
                    avatarUrl: f.friend.avatarUrl,
                    roleTitle: f.friend.roleTitle,
                    status: f.friend.lastPresence ?? 'offline',
                    channelId: null,
                    lastMessage: null,
                    lastActiveLabel: '',
                    unreadCount: 0
                });
                continue;
            }
            const readState = await this.prisma.directChannelMember.findUnique({
                where: {
                    channelId_userId: {
                        channelId: dm.channelId,
                        userId: uid
                    }
                },
                select: {
                    lastReadMessageId: true
                }
            });
            const last = await this.prisma.message.findFirst({
                where: {
                    dmChannelId: dm.channelId
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
                    dmChannelId: dm.channelId,
                    authorId: {
                        not: uid
                    },
                    messageId: {
                        gt: readState?.lastReadMessageId ?? 0n
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
    async getDirectMessageHistory(userTagId, partnerId) {
        const uid = await this.uid(userTagId);
        const pid = await this.targetUser(partnerId, 'partnerId');
        await this.assertFriends(uid, pid);
        const dm = await this.getOrCreateDm(uid, pid);
        const messages = await this.prisma.message.findMany({
            where: {
                dmChannelId: dm.channelId
            },
            orderBy: {
                messageId: 'asc'
            },
            take: 200,
            include: {
                author: {
                    select: {
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });
        const last = messages.at(-1);
        if (last) await this.markDmRead(uid, dm.channelId, last.messageId);
        return messages.map(shapeMessage);
    }
    async markDmRead(userTagId, partnerId) {
        const uid = await this.uid(userTagId);
        const pid = await this.targetUser(partnerId, 'partnerId');
        await this.assertFriends(uid, pid);
        const lo = uid < pid ? uid : pid;
        const hi = uid < pid ? pid : uid;
        const dm = await this.prisma.directChannel.findUnique({
            where: {
                userA_userB: {
                    userA: lo,
                    userB: hi
                }
            }
        });
        if (!dm) return {
            ok: true
        };
        const last = await this.prisma.message.findFirst({
            where: {
                dmChannelId: dm.channelId
            },
            orderBy: {
                messageId: 'desc'
            },
            select: {
                messageId: true
            }
        });
        if (last) await this.prisma.directChannelMember.update({
            where: {
                channelId_userId: {
                    channelId: dm.channelId,
                    userId: uid
                }
            },
            data: {
                lastReadMessageId: last.messageId
            }
        });
        return {
            ok: true
        };
    }
    async sendDirectMessage(userTagId, partnerId, content) {
        const uid = await this.uid(userTagId);
        const pid = await this.targetUser(partnerId, 'partnerId');
        await this.assertFriends(uid, pid);
        const dm = await this.getOrCreateDm(uid, pid);
        return this.postMessage(uid, dm.channelId, content);
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
            try {
                dm = await this.prisma.$transaction(async (tx)=>{
                    const created = await tx.directChannel.create({
                        data: {
                            userA: lo,
                            userB: hi
                        }
                    });
                    await tx.directChannelMember.createMany({
                        data: [
                            {
                                channelId: created.channelId,
                                userId: lo
                            },
                            {
                                channelId: created.channelId,
                                userId: hi
                            }
                        ]
                    });
                    return created;
                });
            } catch  {
                dm = await this.prisma.directChannel.findUniqueOrThrow({
                    where: {
                        userA_userB: {
                            userA: lo,
                            userB: hi
                        }
                    }
                });
            }
        }
        return dm;
    }
    async assertFriends(a, b) {
        const friendship = await this.prisma.friendship.findUnique({
            where: {
                userId_friendId: {
                    userId: a,
                    friendId: b
                }
            }
        });
        if (!friendship) throw new _nestjs_common__rspack_import_1.ForbiddenException('You must be friends to use direct messages');
    }
    /** add friend both ways -> creates DM channel */ async addFriend(userTagId, partnerId) {
        const a = await this.uid(userTagId);
        const b = await this.targetUser(partnerId, 'partnerId');
        if (a === b) throw new _nestjs_common__rspack_import_1.BadRequestException('Cannot friend self');
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
    async joinVoice(channelId, userTagId) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(channelId, 'channelId');
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
    async leaveVoice(channelId, userTagId) {
        const uid = await this.uid(userTagId);
        const cid = (0,_auth_check_service__rspack_import_4.parseId)(channelId, 'channelId');
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
    constructor(prisma, kafka, userCheck){
        _define_property(this, "prisma", void 0);
        _define_property(this, "kafka", void 0);
        _define_property(this, "userCheck", void 0);
        this.prisma = prisma;
        this.kafka = kafka;
        this.userCheck = userCheck;
    }
}
ChatService = _ts_decorate([
    (0,_nestjs_common__rspack_import_1.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prisma_service__rspack_import_2.PrismaService === "undefined" ? Object : _prisma_service__rspack_import_2.PrismaService,
        typeof _kafka_service__rspack_import_3.KafkaService === "undefined" ? Object : _kafka_service__rspack_import_3.KafkaService,
        typeof _auth_check_service__rspack_import_4.UserCheckService === "undefined" ? Object : _auth_check_service__rspack_import_4.UserCheckService
    ])
], ChatService);


},
"./apps/chatsystem/src/kafka.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KafkaService: () => (KafkaService)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);
/* import */ var kafkajs__rspack_import_1 = __webpack_require__("kafkajs");
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
            await this.ensureConnected();
            this.log.log('producer connected');
        } catch (e) {
            this.log.warn(`Kafka unavailable: ${e.message}`);
        }
    }
    async publish(topic, key, value) {
        try {
            await this.ensureConnected();
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
    async ensureConnected() {
        if (this.connected) return;
        if (!this.connecting) {
            this.connecting = this.producer.connect().then(()=>{
                this.connected = true;
            }).finally(()=>{
                this.connecting = undefined;
            });
        }
        await this.connecting;
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
        _define_property(this, "connecting", void 0);
    }
}
KafkaService = _ts_decorate([
    (0,_nestjs_common__rspack_import_0.Injectable)()
], KafkaService);


},
"./apps/chatsystem/src/prisma.service.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
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
"./apps/chatsystem/src/user-tag.decorator.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  UserTag: () => (UserTag)
});
/* import */ var _nestjs_common__rspack_import_0 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_0);

const UserTag = (0,_nestjs_common__rspack_import_0.createParamDecorator)((_data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    const raw = request.headers['x-user-tag'];
    return Array.isArray(raw) ? raw[0] : raw ?? '';
});


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
    graph: "6wVpoAERCQAA1QIAIAoAALYCACASAADUAgAgFAAA1gIAIBUAANYCACAWAAC1AgAgFwAA1wIAIMABAADRAgAwwQEAAD4AEMIBAADRAgAwxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBANICACH_AQEA0gIAIYACAQDSAgAhgQIBANICACEBAAAAAQAgDQMAANoCACAJAADVAgAgDgAA7QIAIA8AAO8CACARAADXAgAgwAEAAO4CADDBAQAAAwAQwgEAAO4CADDWAQQAswIAIewBAQDTAgAh-QEBANICACH6AQQAswIAIfsBAgDfAgAhBgMAAIwFACAJAACJBQAgDgAAkAUAIA8AAJEFACARAACLBQAg-QEAAPACACANAwAA2gIAIAkAANUCACAOAADtAgAgDwAA7wIAIBEAANcCACDAAQAA7gIAMMEBAAADABDCAQAA7gIAMNYBBAAAAAHsAQEA0wIAIfkBAQDSAgAh-gEEALMCACH7AQIA3wIAIQMAAAADACABAAAEADACAAAFACAQBAAA3QIAIAUAAOkCACAGAADtAgAgCgAAtgIAIMABAADrAgAwwQEAAAcAEMIBAADrAgAwwwEEALMCACHWAQQAswIAIewBAQDTAgAh7gECAN8CACHzAQEA0gIAIfQBAQDSAgAh9QECAN8CACH3AQAA7AL3ASL4AQQA4wIAIQcEAACNBQAgBQAAjwUAIAYAAJAFACAKAAClAwAg8wEAAPACACD0AQAA8AIAIPgBAADwAgAgEAQAAN0CACAFAADpAgAgBgAA7QIAIAoAALYCACDAAQAA6wIAMMEBAAAHABDCAQAA6wIAMMMBBAAAAAHWAQQAswIAIewBAQDTAgAh7gECAN8CACHzAQEA0gIAIfQBAQDSAgAh9QECAN8CACH3AQAA7AL3ASL4AQQA4wIAIQMAAAAHACABAAAIADACAAAJACABAAAABwAgAwAAAAcAIAEAAAgAMAIAAAkAIA8HAADpAgAgDAAA6gIAIA0AANoCACDAAQAA5wIAMMEBAAANABDCAQAA5wIAMMMBBADjAgAh0AFAALQCACHeAQQAswIAId8BBADjAgAh4AEEALMCACHhAQEA0wIAIeIBAADoAgAg4wEAAOgCACDkAUAA3AIAIQgHAACPBQAgDAAAjgUAIA0AAIwFACDDAQAA8AIAIN8BAADwAgAg4gEAAPACACDjAQAA8AIAIOQBAADwAgAgDwcAAOkCACAMAADqAgAgDQAA2gIAIMABAADnAgAwwQEAAA0AEMIBAADnAgAwwwEEAOMCACHQAUAAtAIAId4BBAAAAAHfAQQA4wIAIeABBACzAgAh4QEBANMCACHiAQAA6AIAIOMBAADoAgAg5AFAANwCACEDAAAADQAgAQAADgAwAgAADwAgAQAAAAcAIAkJAAC1AgAgCgAAtgIAIMABAACyAgAwwQEAABIAEMIBAACyAgAwwwEEALMCACHOAQQAswIAIc8BBACzAgAh0AFAALQCACEBAAAAEgAgCAcAAOYCACAIAADaAgAgwAEAAOUCADDBAQAAFAAQwgEAAOUCADDDAQQAswIAIcQBBACzAgAhxQEEAOMCACEDBwAAjgUAIAgAAIwFACDFAQAA8AIAIAkHAADmAgAgCAAA2gIAIMABAADlAgAwwQEAABQAEMIBAADlAgAwwwEEALMCACHEAQQAswIAIcUBBADjAgAhhAIAAOQCACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAUACABAAAADQAgAQAAAAcAIAEAAAANACALBAAA3QIAIAgAANoCACDAAQAA4QIAMMEBAAAdABDCAQAA4QIAMMQBBACzAgAh1gEEALMCACHvAQEA0gIAIfABAADiAgAg8QFAALQCACHyAQQA4wIAIQQEAACNBQAgCAAAjAUAIO8BAADwAgAg8gEAAPACACAMBAAA3QIAIAgAANoCACDAAQAA4QIAMMEBAAAdABDCAQAA4QIAMMQBBACzAgAh1gEEALMCACHvAQEA0gIAIfABAADiAgAg8QFAALQCACHyAQQA4wIAIYMCAADgAgAgAwAAAB0AIAEAAB4AMAIAAB8AIAkEAADdAgAgwAEAAN4CADDBAQAAIQAQwgEAAN4CADDWAQQAswIAIesBBACzAgAh7AEBANMCACHtAQQAswIAIe4BAgDfAgAhAQQAAI0FACAJBAAA3QIAIMABAADeAgAwwQEAACEAEMIBAADeAgAw1gEEALMCACHrAQQAAAAB7AEBANMCACHtAQQAswIAIe4BAgDfAgAhAwAAACEAIAEAACIAMAIAACMAIAsEAADdAgAgEAAA2gIAIMABAADbAgAwwQEAACUAEMIBAADbAgAw0AFAALQCACHVAQQAswIAIdYBBACzAgAh1wEBANMCACHYAQQAswIAIdkBQADcAgAhAwQAAI0FACAQAACMBQAg2QEAAPACACALBAAA3QIAIBAAANoCACDAAQAA2wIAMMEBAAAlABDCAQAA2wIAMNABQAC0AgAh1QEEAAAAAdYBBACzAgAh1wEBAAAAAdgBBACzAgAh2QFAANwCACEDAAAAJQAgAQAAJgAwAgAAJwAgAQAAAAcAIAEAAAAdACABAAAAIQAgAQAAACUAIAMAAAAdACABAAAeADACAAAfACADAAAADQAgAQAADgAwAgAADwAgCAgAANoCACATAADaAgAgwAEAANkCADDBAQAALwAQwgEAANkCADDEAQQAswIAIdABQAC0AgAh3QEEALMCACECCAAAjAUAIBMAAIwFACAJCAAA2gIAIBMAANoCACDAAQAA2QIAMMEBAAAvABDCAQAA2QIAMMQBBACzAgAh0AFAALQCACHdAQQAswIAIYICAADYAgAgAwAAAC8AIAEAADAAMAIAADEAIAMAAAAvACABAAAwADACAAAxACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAACUAIAEAACYAMAIAACcAIAEAAAADACABAAAAHQAgAQAAAA0AIAEAAAAvACABAAAALwAgAQAAABQAIAEAAAAlACABAAAAAQAgEQkAANUCACAKAAC2AgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAtQIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACzAgAh_AEBANICACH9AQEA0wIAIf4BAQDSAgAh_wEBANICACGAAgEA0gIAIYECAQDSAgAhDAkAAIkFACAKAAClAwAgEgAAiAUAIBQAAIoFACAVAACKBQAgFgAApAMAIBcAAIsFACD8AQAA8AIAIP4BAADwAgAg_wEAAPACACCAAgAA8AIAIIECAADwAgAgAwAAAD4AIAEAAD8AMAIAAAEAIAMAAAA-ACABAAA_ADACAAABACADAAAAPgAgAQAAPwAwAgAAAQAgDgkAAIIFACAKAACDBQAgEgAAgQUAIBQAAIQFACAVAACFBQAgFgAAhgUAIBcAAIcFACDEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAR0AAEMAIAfEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAR0AAEUAMAEdAABFADAOCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIMQBBAD3AgAh_AEBAMwDACH9AQEAjgMAIf4BAQDMAwAh_wEBAMwDACGAAgEAzAMAIYECAQDMAwAhAgAAAAEAIB0AAEgAIAfEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQIAAAA-ACAdAABKACACAAAAPgAgHQAASgAgAwAAAAEAICQAAEMAICUAAEgAIAEAAAABACABAAAAPgAgCgsAALAEACAqAACxBAAgKwAAtAQAICwAALMEACAtAACyBAAg_AEAAPACACD-AQAA8AIAIP8BAADwAgAggAIAAPACACCBAgAA8AIAIArAAQAA0AIAMMEBAABRABDCAQAA0AIAMMQBBACjAgAh_AEBAMYCACH9AQEAuAIAIf4BAQDGAgAh_wEBAMYCACGAAgEAxgIAIYECAQDGAgAhAwAAAD4AIAEAAFAAMCkAAFEAIAMAAAA-ACABAAA_ADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAoDAACrBAAgCQAArQQAIA4AAKwEACAPAACuBAAgEQAArwQAINYBBAAAAAHsAQEAAAAB-QEBAAAAAfoBBAAAAAH7AQIAAAABAR0AAFkAIAXWAQQAAAAB7AEBAAAAAfkBAQAAAAH6AQQAAAAB-wECAAAAAQEdAABbADABHQAAWwAwCgMAAPkDACAJAAD7AwAgDgAA-gMAIA8AAPwDACARAAD9AwAg1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQIAAAAFACAdAABeACAF1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQIAAAADACAdAABgACACAAAAAwAgHQAAYAAgAwAAAAUAICQAAFkAICUAAF4AIAEAAAAFACABAAAAAwAgBgsAAPQDACAqAAD1AwAgKwAA-AMAICwAAPcDACAtAAD2AwAg-QEAAPACACAIwAEAAM8CADDBAQAAZwAQwgEAAM8CADDWAQQAowIAIewBAQC4AgAh-QEBAMYCACH6AQQAowIAIfsBAgDDAgAhAwAAAAMAIAEAAGYAMCkAAGcAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA0EAADwAwAgBQAA8wMAIAYAAPEDACAKAADyAwAgwwEEAAAAAdYBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQEdAABvACAJwwEEAAAAAdYBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQEdAABxADABHQAAcQAwAQAAAAcAIA0EAADXAwAgBQAA2AMAIAYAANkDACAKAADaAwAgwwEEAPcCACHWAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQIAAAAJACAdAAB1ACAJwwEEAPcCACHWAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQIAAAAHACAdAAB3ACACAAAABwAgHQAAdwAgAQAAAAcAIAMAAAAJACAkAABvACAlAAB1ACABAAAACQAgAQAAAAcAIAgLAADRAwAgKgAA0gMAICsAANUDACAsAADUAwAgLQAA0wMAIPMBAADwAgAg9AEAAPACACD4AQAA8AIAIAzAAQAAywIAMMEBAAB_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_AgAwwQEAAMUBABDCAQAAvwIAMMMBBACkAgAh0AFAAK4CACHeAQQAowIAId8BBACkAgAh4AEEAKMCACHhAQEAuAIAIeIBAADAAgAg4wEAAMACACDkAUAAuQIAIQMAAAANACABAADEAQAwKQAAxQEAIAMAAAANACABAAAOADACAAAPACABAAAAMQAgAQAAADEAIAMAAAAvACABAAAwADACAAAxACADAAAALwAgAQAAMAAwAgAAMQAgAwAAAC8AIAEAADAAMAIAADEAIAUIAAC2AwAgEwAAtwMAIMQBBAAAAAHQAUAAAAAB3QEEAAAAAQEdAADNAQAgA8QBBAAAAAHQAUAAAAAB3QEEAAAAAQEdAADPAQAwAR0AAM8BADAFCAAAtAMAIBMAALUDACDEAQQA9wIAIdABQACBAwAh3QEEAPcCACECAAAAMQAgHQAA0gEAIAPEAQQA9wIAIdABQACBAwAh3QEEAPcCACECAAAALwAgHQAA1AEAIAIAAAAvACAdAADUAQAgAwAAADEAICQAAM0BACAlAADSAQAgAQAAADEAIAEAAAAvACAFCwAArwMAICoAALADACArAACzAwAgLAAAsgMAIC0AALEDACAGwAEAAL4CADDBAQAA2wEAEMIBAAC-AgAwxAEEAKMCACHQAUAArgIAId0BBACjAgAhAwAAAC8AIAEAANoBADApAADbAQAgAwAAAC8AIAEAADAAMAIAADEAIAEAAAAnACABAAAAJwAgAwAAACUAIAEAACYAMAIAACcAIAMAAAAlACABAAAmADACAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgCAQAAK0DACAQAACuAwAg0AFAAAAAAdUBBAAAAAHWAQQAAAAB1wEBAAAAAdgBBAAAAAHZAUAAAAABAR0AAOMBACAG0AFAAAAAAdUBBAAAAAHWAQQAAAAB1wEBAAAAAdgBBAAAAAHZAUAAAAABAR0AAOUBADABHQAA5QEAMAgEAACrAwAgEAAArAMAINABQACBAwAh1QEEAPcCACHWAQQA9wIAIdcBAQCOAwAh2AEEAPcCACHZAUAAjwMAIQIAAAAnACAdAADoAQAgBtABQACBAwAh1QEEAPcCACHWAQQA9wIAIdcBAQCOAwAh2AEEAPcCACHZAUAAjwMAIQIAAAAlACAdAADqAQAgAgAAACUAIB0AAOoBACADAAAAJwAgJAAA4wEAICUAAOgBACABAAAAJwAgAQAAACUAIAYLAACmAwAgKgAApwMAICsAAKoDACAsAACpAwAgLQAAqAMAINkBAADwAgAgCcABAAC3AgAwwQEAAPEBABDCAQAAtwIAMNABQACuAgAh1QEEAKMCACHWAQQAowIAIdcBAQC4AgAh2AEEAKMCACHZAUAAuQIAIQMAAAAlACABAADwAQAwKQAA8QEAIAMAAAAlACABAAAmADACAAAnACAKCQAAtQIAIAoAALYCACDAAQAAsgIAMMEBAAASABDCAQAAsgIAMMMBBAAAAAHOAQQAswIAIc8BBACzAgAh0AFAALQCACHRAQAAsQIAIAEAAAD0AQAgAQAAAPQBACACCQAApAMAIAoAAKUDACADAAAAEgAgAQAA9wEAMAIAAPQBACADAAAAEgAgAQAA9wEAMAIAAPQBACADAAAAEgAgAQAA9wEAMAIAAPQBACAGCQAAogMAIAoAAKMDACDDAQQAAAABzgEEAAAAAc8BBAAAAAHQAUAAAAABAR0AAPsBACAEwwEEAAAAAc4BBAAAAAHPAQQAAAAB0AFAAAAAAQEdAAD9AQAwAR0AAP0BADAGCQAAggMAIAoAAIMDACDDAQQA9wIAIc4BBAD3AgAhzwEEAPcCACHQAUAAgQMAIQIAAAD0AQAgHQAAgAIAIATDAQQA9wIAIc4BBAD3AgAhzwEEAPcCACHQAUAAgQMAIQIAAAASACAdAACCAgAgAgAAABIAIB0AAIICACADAAAA9AEAICQAAPsBACAlAACAAgAgAQAAAPQBACABAAAAEgAgBQsAAPwCACAqAAD9AgAgKwAAgAMAICwAAP8CACAtAAD-AgAgB8ABAACtAgAwwQEAAIkCABDCAQAArQIAMMMBBACjAgAhzgEEAKMCACHPAQQAowIAIdABQACuAgAhAwAAABIAIAEAAIgCADApAACJAgAgAwAAABIAIAEAAPcBADACAAD0AQAgAQAAABYAIAEAAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACAFBwAA-gIAIAgAAPsCACDDAQQAAAABxAEEAAAAAcUBBAAAAAEBHQAAkQIAIAPDAQQAAAABxAEEAAAAAcUBBAAAAAEBHQAAkwIAMAEdAACTAgAwBQcAAPgCACAIAAD5AgAgwwEEAPcCACHEAQQA9wIAIcUBBAD2AgAhAgAAABYAIB0AAJYCACADwwEEAPcCACHEAQQA9wIAIcUBBAD2AgAhAgAAABQAIB0AAJgCACACAAAAFAAgHQAAmAIAIAMAAAAWACAkAACRAgAgJQAAlgIAIAEAAAAWACABAAAAFAAgBgsAAPECACAqAADyAgAgKwAA9QIAICwAAPQCACAtAADzAgAgxQEAAPACACAGwAEAAKICADDBAQAAnwIAEMIBAACiAgAwwwEEAKMCACHEAQQAowIAIcUBBACkAgAhAwAAABQAIAEAAJ4CADApAACfAgAgAwAAABQAIAEAABUAMAIAABYAIAbAAQAAogIAMMEBAACfAgAQwgEAAKICADDDAQQAowIAIcQBBACjAgAhxQEEAKQCACENCwAAqgIAICoAAKsCACArAACsAgAgLAAArAIAIC0AAKwCACDGAQQAAAABxwEEAAAABMgBBAAAAATJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKkCACENCwAApgIAICoAAKcCACArAACoAgAgLAAAqAIAIC0AAKgCACDGAQQAAAABxwEEAAAABcgBBAAAAAXJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKUCACENCwAApgIAICoAAKcCACArAACoAgAgLAAAqAIAIC0AAKgCACDGAQQAAAABxwEEAAAABcgBBAAAAAXJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKUCACEIxgECAAAAAccBAgAAAAXIAQIAAAAFyQECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgCmAgAhCMYBCAAAAAHHAQgAAAAFyAEIAAAABckBCAAAAAHKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgApwIAIQjGAQQAAAABxwEEAAAABcgBBAAAAAXJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKgCACENCwAAqgIAICoAAKsCACArAACsAgAgLAAArAIAIC0AAKwCACDGAQQAAAABxwEEAAAABMgBBAAAAATJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKkCACEIxgECAAAAAccBAgAAAATIAQIAAAAEyQECAAAAAcoBAgAAAAHLAQIAAAABzAECAAAAAc0BAgCqAgAhCMYBCAAAAAHHAQgAAAAEyAEIAAAABMkBCAAAAAHKAQgAAAABywEIAAAAAcwBCAAAAAHNAQgAqwIAIQjGAQQAAAABxwEEAAAABMgBBAAAAATJAQQAAAABygEEAAAAAcsBBAAAAAHMAQQAAAABzQEEAKwCACEHwAEAAK0CADDBAQAAiQIAEMIBAACtAgAwwwEEAKMCACHOAQQAowIAIc8BBACjAgAh0AFAAK4CACELCwAAqgIAICwAALACACAtAACwAgAgxgFAAAAAAccBQAAAAATIAUAAAAAEyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQACvAgAhCwsAAKoCACAsAACwAgAgLQAAsAIAIMYBQAAAAAHHAUAAAAAEyAFAAAAABMkBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAArwIAIQjGAUAAAAABxwFAAAAABMgBQAAAAATJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAALACACECzgEEAAAAAc8BBAAAAAEJCQAAtQIAIAoAALYCACDAAQAAsgIAMMEBAAASABDCAQAAsgIAMMMBBACzAgAhzgEEALMCACHPAQQAswIAIdABQAC0AgAhCMYBBAAAAAHHAQQAAAAEyAEEAAAABMkBBAAAAAHKAQQAAAABywEEAAAAAcwBBAAAAAHNAQQArAIAIQjGAUAAAAABxwFAAAAABMgBQAAAAATJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAALACACED0gEAABQAINMBAAAUACDUAQAAFAAgA9IBAAANACDTAQAADQAg1AEAAA0AIAnAAQAAtwIAMMEBAADxAQAQwgEAALcCADDQAUAArgIAIdUBBACjAgAh1gEEAKMCACHXAQEAuAIAIdgBBACjAgAh2QFAALkCACEOCwAAqgIAICwAAL0CACAtAAC9AgAgxgEBAAAAAccBAQAAAATIAQEAAAAEyQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQC8AgAh2gEBAAAAAdsBAQAAAAHcAQEAAAABCwsAAKYCACAsAAC7AgAgLQAAuwIAIMYBQAAAAAHHAUAAAAAFyAFAAAAABckBQAAAAAHKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAugIAIQsLAACmAgAgLAAAuwIAIC0AALsCACDGAUAAAAABxwFAAAAABcgBQAAAAAXJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAALoCACEIxgFAAAAAAccBQAAAAAXIAUAAAAAFyQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQAC7AgAhDgsAAKoCACAsAAC9AgAgLQAAvQIAIMYBAQAAAAHHAQEAAAAEyAEBAAAABMkBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAvAIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQvGAQEAAAABxwEBAAAABMgBAQAAAATJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAL0CACHaAQEAAAAB2wEBAAAAAdwBAQAAAAEGwAEAAL4CADDBAQAA2wEAEMIBAAC-AgAwxAEEAKMCACHQAUAArgIAId0BBACjAgAhDMABAAC_AgAwwQEAAMUBABDCAQAAvwIAMMMBBACkAgAh0AFAAK4CACHeAQQAowIAId8BBACkAgAh4AEEAKMCACHhAQEAuAIAIeIBAADAAgAg4wEAAMACACDkAUAAuQIAIQ8LAACmAgAgLAAAwQIAIC0AAMECACDGAYAAAAAByQGAAAAAAcoBgAAAAAHLAYAAAAABzAGAAAAAAc0BgAAAAAHlAQEAAAAB5gEBAAAAAecBAQAAAAHoAYAAAAAB6QGAAAAAAeoBgAAAAAEMxgGAAAAAAckBgAAAAAHKAYAAAAABywGAAAAAAcwBgAAAAAHNAYAAAAAB5QEBAAAAAeYBAQAAAAHnAQEAAAAB6AGAAAAAAekBgAAAAAHqAYAAAAABCMABAADCAgAwwQEAAKsBABDCAQAAwgIAMNYBBACjAgAh6wEEAKMCACHsAQEAuAIAIe0BBACjAgAh7gECAMMCACENCwAAqgIAICoAAKsCACArAACqAgAgLAAAqgIAIC0AAKoCACDGAQIAAAABxwECAAAABMgBAgAAAATJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAMQCACENCwAAqgIAICoAAKsCACArAACqAgAgLAAAqgIAIC0AAKoCACDGAQIAAAABxwECAAAABMgBAgAAAATJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAAAABzQECAMQCACEJwAEAAMUCADDBAQAAlQEAEMIBAADFAgAwxAEEAKMCACHWAQQAowIAIe8BAQDGAgAh8AEAAMcCACDxAUAArgIAIfIBBACkAgAhDgsAAKYCACAsAADKAgAgLQAAygIAIMYBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAyQIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQ8LAACqAgAgLAAAyAIAIC0AAMgCACDGAYAAAAAByQGAAAAAAcoBgAAAAAHLAYAAAAABzAGAAAAAAc0BgAAAAAHlAQEAAAAB5gEBAAAAAecBAQAAAAHoAYAAAAAB6QGAAAAAAeoBgAAAAAEMxgGAAAAAAckBgAAAAAHKAYAAAAABywGAAAAAAcwBgAAAAAHNAYAAAAAB5QEBAAAAAeYBAQAAAAHnAQEAAAAB6AGAAAAAAekBgAAAAAHqAYAAAAABDgsAAKYCACAsAADKAgAgLQAAygIAIMYBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAyQIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQvGAQEAAAABxwEBAAAABcgBAQAAAAXJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAMoCACHaAQEAAAAB2wEBAAAAAdwBAQAAAAEMwAEAAMsCADDBAQAAfwAQwgEAAMsCADDDAQQAowIAIdYBBACjAgAh7AEBALgCACHuAQIAwwIAIfMBAQDGAgAh9AEBAMYCACH1AQIAwwIAIfcBAADMAvcBIvgBBACkAgAhBwsAAKoCACAsAADOAgAgLQAAzgIAIMYBAAAA9wECxwEAAAD3AQjIAQAAAPcBCM0BAADNAvcBIgcLAACqAgAgLAAAzgIAIC0AAM4CACDGAQAAAPcBAscBAAAA9wEIyAEAAAD3AQjNAQAAzQL3ASIExgEAAAD3AQLHAQAAAPcBCMgBAAAA9wEIzQEAAM4C9wEiCMABAADPAgAwwQEAAGcAEMIBAADPAgAw1gEEAKMCACHsAQEAuAIAIfkBAQDGAgAh-gEEAKMCACH7AQIAwwIAIQrAAQAA0AIAMMEBAABRABDCAQAA0AIAMMQBBACjAgAh_AEBAMYCACH9AQEAuAIAIf4BAQDGAgAh_wEBAMYCACGAAgEAxgIAIYECAQDGAgAhEQkAANUCACAKAAC2AgAgEgAA1AIAIBQAANYCACAVAADWAgAgFgAAtQIAIBcAANcCACDAAQAA0QIAMMEBAAA-ABDCAQAA0QIAMMQBBACzAgAh_AEBANICACH9AQEA0wIAIf4BAQDSAgAh_wEBANICACGAAgEA0gIAIYECAQDSAgAhC8YBAQAAAAHHAQEAAAAFyAEBAAAABckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAygIAIdoBAQAAAAHbAQEAAAAB3AEBAAAAAQvGAQEAAAABxwEBAAAABMgBAQAAAATJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAL0CACHaAQEAAAAB2wEBAAAAAdwBAQAAAAED0gEAAAMAINMBAAADACDUAQAAAwAgA9IBAAAdACDTAQAAHQAg1AEAAB0AIAPSAQAALwAg0wEAAC8AINQBAAAvACAD0gEAACUAINMBAAAlACDUAQAAJQAgAsQBBAAAAAHdAQQAAAABCAgAANoCACATAADaAgAgwAEAANkCADDBAQAALwAQwgEAANkCADDEAQQAswIAIdABQAC0AgAh3QEEALMCACETCQAA1QIAIAoAALYCACASAADUAgAgFAAA1gIAIBUAANYCACAWAAC1AgAgFwAA1wIAIMABAADRAgAwwQEAAD4AEMIBAADRAgAwxAEEALMCACH8AQEA0gIAIf0BAQDTAgAh_gEBANICACH_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_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-AwAwJQAAgwQAMIcCAAD_AwAwiAIAAIAEADCJAgAAgQQAIIoCAACCBAAwiwIAAIIEADCMAgAAggQAMI0CAACCBAAwjgIAAIQEADCPAgAAhQQAMAYQAACuAwAg0AFAAAAAAdUBBAAAAAHXAQEAAAAB2AEEAAAAAdkBQAAAAAECAAAAJwAgJAAAiQQAIAMAAAAnACAkAACJBAAgJQAAiAQAIAEdAACeBQAwCwQAAN0CACAQAADaAgAgwAEAANsCADDBAQAAJQAQwgEAANsCADDQAUAAtAIAIdUBBAAAAAHWAQQAswIAIdcBAQAAAAHYAQQAswIAIdkBQADcAgAhAgAAACcAIB0AAIgEACACAAAAhgQAIB0AAIcEACAJwAEAAIUEADDBAQAAhgQAEMIBAACFBAAw0AFAALQCACHVAQQAswIAIdYBBACzAgAh1wEBANMCACHYAQQAswIAIdkBQADcAgAhCcABAACFBAAwwQEAAIYEABDCAQAAhQQAMNABQAC0AgAh1QEEALMCACHWAQQAswIAIdcBAQDTAgAh2AEEALMCACHZAUAA3AIAIQXQAUAAgQMAIdUBBAD3AgAh1wEBAI4DACHYAQQA9wIAIdkBQACPAwAhBhAAAKwDACDQAUAAgQMAIdUBBAD3AgAh1wEBAI4DACHYAQQA9wIAIdkBQACPAwAhBhAAAK4DACDQAUAAAAAB1QEEAAAAAdcBAQAAAAHYAQQAAAAB2QFAAAAAAQTrAQQAAAAB7AEBAAAAAe0BBAAAAAHuAQIAAAABAgAAACMAICQAAJUEACADAAAAIwAgJAAAlQQAICUAAJQEACABHQAAnQUAMAkEAADdAgAgwAEAAN4CADDBAQAAIQAQwgEAAN4CADDWAQQAswIAIesBBAAAAAHsAQEA0wIAIe0BBACzAgAh7gECAN8CACECAAAAIwAgHQAAlAQAIAIAAACSBAAgHQAAkwQAIAjAAQAAkQQAMMEBAACSBAAQwgEAAJEEADDWAQQAswIAIesBBACzAgAh7AEBANMCACHtAQQAswIAIe4BAgDfAgAhCMABAACRBAAwwQEAAJIEABDCAQAAkQQAMNYBBACzAgAh6wEEALMCACHsAQEA0wIAIe0BBACzAgAh7gECAN8CACEE6wEEAPcCACHsAQEAjgMAIe0BBAD3AgAh7gECAMQDACEE6wEEAPcCACHsAQEAjgMAIe0BBAD3AgAh7gECAMQDACEE6wEEAAAAAewBAQAAAAHtAQQAAAAB7gECAAAAAQYIAADQAwAgxAEEAAAAAe8BAQAAAAHwAYAAAAAB8QFAAAAAAfIBBAAAAAECAAAAHwAgJAAAoQQAIAMAAAAfACAkAAChBAAgJQAAoAQAIAEdAACcBQAwDAQAAN0CACAIAADaAgAgwAEAAOECADDBAQAAHQAQwgEAAOECADDEAQQAswIAIdYBBACzAgAh7wEBANICACHwAQAA4gIAIPEBQAC0AgAh8gEEAOMCACGDAgAA4AIAIAIAAAAfACAdAACgBAAgAgAAAJ4EACAdAACfBAAgCcABAACdBAAwwQEAAJ4EABDCAQAAnQQAMMQBBACzAgAh1gEEALMCACHvAQEA0gIAIfABAADiAgAg8QFAALQCACHyAQQA4wIAIQnAAQAAnQQAMMEBAACeBAAQwgEAAJ0EADDEAQQAswIAIdYBBACzAgAh7wEBANICACHwAQAA4gIAIPEBQAC0AgAh8gEEAOMCACEFxAEEAPcCACHvAQEAzAMAIfABgAAAAAHxAUAAgQMAIfIBBAD2AgAhBggAAM4DACDEAQQA9wIAIe8BAQDMAwAh8AGAAAAAAfEBQACBAwAh8gEEAPYCACEGCAAA0AMAIMQBBAAAAAHvAQEAAAAB8AGAAAAAAfEBQAAAAAHyAQQAAAABCwUAAPMDACAGAADxAwAgCgAA8gMAIMMBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQIAAAAJACAkAACqBAAgAwAAAAkAICQAAKoEACAlAACpBAAgAR0AAJsFADACAAAACQAgHQAAqQQAIAIAAADsAwAgHQAAqAQAIAjDAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQsFAADYAwAgBgAA2QMAIAoAANoDACDDAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQsFAADzAwAgBgAA8QMAIAoAAPIDACDDAQQAAAAB7AEBAAAAAe4BAgAAAAHzAQEAAAAB9AEBAAAAAfUBAgAAAAH3AQAAAPcBAvgBBAAAAAEDJAAAmQUAIIcCAACaBQAgjQIAAAEAIAQkAACiBAAwhwIAAKMEADCJAgAApQQAII0CAADoAwAwBCQAAJYEADCHAgAAlwQAMIkCAACZBAAgjQIAAJoEADAEJAAAigQAMIcCAACLBAAwiQIAAI0EACCNAgAAjgQAMAQkAAD-AwAwhwIAAP8DADCJAgAAgQQAII0CAACCBAAwAAAAAAALJAAA9QQAMCUAAPoEADCHAgAA9gQAMIgCAAD3BAAwiQIAAPgEACCKAgAA-QQAMIsCAAD5BAAwjAIAAPkEADCNAgAA-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_wQAIAEdAACSBQAwDQMAANoCACAJAADVAgAgDgAA7QIAIA8AAO8CACARAADXAgAgwAEAAO4CADDBAQAAAwAQwgEAAO4CADDWAQQAAAAB7AEBANMCACH5AQEA0gIAIfoBBACzAgAh-wECAN8CACECAAAABQAgHQAA_wQAIAIAAAD9BAAgHQAA_gQAIAjAAQAA_AQAMMEBAAD9BAAQwgEAAPwEADDWAQQAswIAIewBAQDTAgAh-QEBANICACH6AQQAswIAIfsBAgDfAgAhCMABAAD8BAAwwQEAAP0EABDCAQAA_AQAMNYBBACzAgAh7AEBANMCACH5AQEA0gIAIfoBBACzAgAh-wECAN8CACEE1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-wECAMQDACEICQAA-wMAIA4AAPoDACAPAAD8AwAgEQAA_QMAINYBBAD3AgAh7AEBAI4DACH5AQEAzAMAIfsBAgDEAwAhCAkAAK0EACAOAACsBAAgDwAArgQAIBEAAK8EACDWAQQAAAAB7AEBAAAAAfkBAQAAAAH7AQIAAAABBCQAAPUEADCHAgAA9gQAMIkCAAD4BAAgjQIAAPkEADAEJAAA7AQAMIcCAADtBAAwiQIAAO8EACCNAgAAmgQAMAQkAADjBAAwhwIAAOQEADCJAgAA5gQAII0CAACIAwAwBCQAANoEADCHAgAA2wQAMIkCAADdBAAgjQIAANIEADAEJAAAzgQAMIcCAADPBAAwiQIAANEEACCNAgAA0gQAMAQkAADFBAAwhwIAAMYEADCJAgAAyAQAII0CAACaAwAwBCQAALwEADCHAgAAvQQAMIkCAAC_BAAgjQIAAIIEADAAAAAADAkAAIkFACAKAAClAwAgEgAAiAUAIBQAAIoFACAVAACKBQAgFgAApAMAIBcAAIsFACD8AQAA8AIAIP4BAADwAgAg_wEAAPACACCAAgAA8AIAIIECAADwAgAgBgMAAIwFACAJAACJBQAgDgAAkAUAIA8AAJEFACARAACLBQAg-QEAAPACACACCQAApAMAIAoAAKUDACAHBAAAjQUAIAUAAI8FACAGAACQBQAgCgAApQMAIPMBAADwAgAg9AEAAPACACD4AQAA8AIAIAAABNYBBAAAAAHsAQEAAAAB-QEBAAAAAfsBAgAAAAEF1gEEAAAAAe8BAQAAAAHwAYAAAAAB8QFAAAAAAfIBBAAAAAEIwwEEAAAAAdABQAAAAAHeAQQAAAAB3wEEAAAAAeEBAQAAAAHiAYAAAAAB4wGAAAAAAeQBQAAAAAEC0AFAAAAAAd0BBAAAAAECxAEEAAAAAdABQAAAAAECwwEEAAAAAcUBBAAAAAEF0AFAAAAAAdUBBAAAAAHWAQQAAAAB1wEBAAAAAdkBQAAAAAENCQAAggUAIAoAAIMFACAUAACEBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAACZBQAgCMMBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wEC-AEEAAAAAQXEAQQAAAAB7wEBAAAAAfABgAAAAAHxAUAAAAAB8gEEAAAAAQTrAQQAAAAB7AEBAAAAAe0BBAAAAAHuAQIAAAABBdABQAAAAAHVAQQAAAAB1wEBAAAAAdgBBAAAAAHZAUAAAAABAwAAAD4AICQAAJkFACAlAAChBQAgDwAAAD4AIAkAALYEACAKAAC3BAAgFAAAuAQAIBUAALkEACAWAAC6BAAgFwAAuwQAIB0AAKEFACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQ0JAAC2BAAgCgAAtwQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQwEAADwAwAgBQAA8wMAIAoAAPIDACDDAQQAAAAB1gEEAAAAAewBAQAAAAHuAQIAAAAB8wEBAAAAAfQBAQAAAAH1AQIAAAAB9wEAAAD3AQL4AQQAAAABAgAAAAkAICQAAKIFACAJAwAAqwQAIAkAAK0EACAPAACuBAAgEQAArwQAINYBBAAAAAHsAQEAAAAB-QEBAAAAAfoBBAAAAAH7AQIAAAABAgAAAAUAICQAAKQFACAIwwEEAAAAAdYBBAAAAAHsAQEAAAAB7gECAAAAAfMBAQAAAAH0AQEAAAAB9QECAAAAAfcBAAAA9wECCNABQAAAAAHeAQQAAAAB3wEEAAAAAeABBAAAAAHhAQEAAAAB4gGAAAAAAeMBgAAAAAHkAUAAAAABAwAAAAcAICQAAKIFACAlAACqBQAgDgAAAAcAIAQAANcDACAFAADYAwAgCgAA2gMAIB0AAKoFACDDAQQA9wIAIdYBBAD3AgAh7AEBAI4DACHuAQIAxAMAIfMBAQDMAwAh9AEBAMwDACH1AQIAxAMAIfcBAADWA_cBIvgBBAD2AgAhDAQAANcDACAFAADYAwAgCgAA2gMAIMMBBAD3AgAh1gEEAPcCACHsAQEAjgMAIe4BAgDEAwAh8wEBAMwDACH0AQEAzAMAIfUBAgDEAwAh9wEAANYD9wEi-AEEAPYCACEDAAAAAwAgJAAApAUAICUAAK0FACALAAAAAwAgAwAA-QMAIAkAAPsDACAPAAD8AwAgEQAA_QMAIB0AAK0FACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhCQMAAPkDACAJAAD7AwAgDwAA_AMAIBEAAP0DACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhDQoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgFwAAhwUAIMQBBAAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAECAAAAAQAgJAAArgUAIAkDAACrBAAgDgAArAQAIA8AAK4EACARAACvBAAg1gEEAAAAAewBAQAAAAH5AQEAAAAB-gEEAAAAAfsBAgAAAAECAAAABQAgJAAAsAUAIAMAAAA-ACAkAACuBQAgJQAAtAUAIA8AAAA-ACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACAdAAC0BQAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACEDAAAAAwAgJAAAsAUAICUAALcFACALAAAAAwAgAwAA-QMAIA4AAPoDACAPAAD8AwAgEQAA_QMAIB0AALcFACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhCQMAAPkDACAOAAD6AwAgDwAA_AMAIBEAAP0DACDWAQQA9wIAIewBAQCOAwAh-QEBAMwDACH6AQQA9wIAIfsBAgDEAwAhCQMAAKsEACAJAACtBAAgDgAArAQAIBEAAK8EACDWAQQAAAAB7AEBAAAAAfkBAQAAAAH6AQQAAAAB-wECAAAAAQIAAAAFACAkAAC4BQAgAwAAAAMAICQAALgFACAlAAC8BQAgCwAAAAMAIAMAAPkDACAJAAD7AwAgDgAA-gMAIBEAAP0DACAdAAC8BQAg1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQkDAAD5AwAgCQAA-wMAIA4AAPoDACARAAD9AwAg1gEEAPcCACHsAQEAjgMAIfkBAQDMAwAh-gEEAPcCACH7AQIAxAMAIQUJAACiAwAgwwEEAAAAAc4BBAAAAAHPAQQAAAAB0AFAAAAAAQIAAAD0AQAgJAAAvQUAIAMAAAASACAkAAC9BQAgJQAAwQUAIAcAAAASACAJAACCAwAgHQAAwQUAIMMBBAD3AgAhzgEEAPcCACHPAQQA9wIAIdABQACBAwAhBQkAAIIDACDDAQQA9wIAIc4BBAD3AgAhzwEEAPcCACHQAUAAgQMAIQ0JAACCBQAgCgAAgwUAIBIAAIEFACAUAACEBQAgFgAAhgUAIBcAAIcFACDEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAgAAAAEAICQAAMIFACANCQAAggUAIAoAAIMFACASAACBBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAADEBQAgAwAAAD4AICQAAMIFACAlAADIBQAgDwAAAD4AIAkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAWAAC6BAAgFwAAuwQAIB0AAMgFACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQ0JAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFgAAugQAIBcAALsEACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQMAAAA-ACAkAADEBQAgJQAAywUAIA8AAAA-ACAJAAC2BAAgCgAAtwQAIBIAALUEACAVAAC5BAAgFgAAugQAIBcAALsEACAdAADLBQAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCQAAtgQAIAoAALcEACASAAC1BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCQAAggUAIAoAAIMFACASAACBBQAgFAAAhAUAIBUAAIUFACAWAACGBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAADMBQAgCQMAAKsEACAJAACtBAAgDgAArAQAIA8AAK4EACDWAQQAAAAB7AEBAAAAAfkBAQAAAAH6AQQAAAAB-wECAAAAAQIAAAAFACAkAADOBQAgAwAAAD4AICQAAMwFACAlAADSBQAgDwAAAD4AIAkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFgAAugQAIB0AANIFACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQ0JAAC2BAAgCgAAtwQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACDEAQQA9wIAIfwBAQDMAwAh_QEBAI4DACH-AQEAzAMAIf8BAQDMAwAhgAIBAMwDACGBAgEAzAMAIQMAAAADACAkAADOBQAgJQAA1QUAIAsAAAADACADAAD5AwAgCQAA-wMAIA4AAPoDACAPAAD8AwAgHQAA1QUAINYBBAD3AgAh7AEBAI4DACH5AQEAzAMAIfoBBAD3AgAh-wECAMQDACEJAwAA-QMAIAkAAPsDACAOAAD6AwAgDwAA_AMAINYBBAD3AgAh7AEBAI4DACH5AQEAzAMAIfoBBAD3AgAh-wECAMQDACECxAEEAAAAAcUBBAAAAAENCQAAggUAIBIAAIEFACAUAACEBQAgFQAAhQUAIBYAAIYFACAXAACHBQAgxAEEAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAQIAAAABACAkAADXBQAgDAQAAPADACAFAADzAwAgBgAA8QMAIMMBBAAAAAHWAQQAAAAB7AEBAAAAAe4BAgAAAAHzAQEAAAAB9AEBAAAAAfUBAgAAAAH3AQAAAPcBAvgBBAAAAAECAAAACQAgJAAA2QUAIAMAAAA-ACAkAADXBQAgJQAA3QUAIA8AAAA-ACAJAAC2BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFgAAugQAIBcAALsEACAdAADdBQAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACENCQAAtgQAIBIAALUEACAUAAC4BAAgFQAAuQQAIBYAALoEACAXAAC7BAAgxAEEAPcCACH8AQEAzAMAIf0BAQCOAwAh_gEBAMwDACH_AQEAzAMAIYACAQDMAwAhgQIBAMwDACEDAAAABwAgJAAA2QUAICUAAOAFACAOAAAABwAgBAAA1wMAIAUAANgDACAGAADZAwAgHQAA4AUAIMMBBAD3AgAh1gEEAPcCACHsAQEAjgMAIe4BAgDEAwAh8wEBAMwDACH0AQEAzAMAIfUBAgDEAwAh9wEAANYD9wEi-AEEAPYCACEMBAAA1wMAIAUAANgDACAGAADZAwAgwwEEAPcCACHWAQQA9wIAIewBAQCOAwAh7gECAMQDACHzAQEAzAMAIfQBAQDMAwAh9QECAMQDACH3AQAA1gP3ASL4AQQA9gIAIQjDAQQAAAAB0AFAAAAAAd4BBAAAAAHgAQQAAAAB4QEBAAAAAeIBgAAAAAHjAYAAAAAB5AFAAAAAAQ0JAACCBQAgCgAAgwUAIBIAAIEFACAUAACEBQAgFQAAhQUAIBcAAIcFACDEAQQAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABAgAAAAEAICQAAOIFACAFCgAAowMAIMMBBAAAAAHOAQQAAAABzwEEAAAAAdABQAAAAAECAAAA9AEAICQAAOQFACADAAAAPgAgJAAA4gUAICUAAOgFACAPAAAAPgAgCQAAtgQAIAoAALcEACASAAC1BAAgFAAAuAQAIBUAALkEACAXAAC7BAAgHQAA6AUAIMQBBAD3AgAh_AEBAMwDACH9AQEAjgMAIf4BAQDMAwAh_wEBAMwDACGAAgEAzAMAIYECAQDMAwAhDQkAALYEACAKAAC3BAAgEgAAtQQAIBQAALgEACAVAAC5BAAgFwAAuwQAIMQBBAD3AgAh_AEBAMwDACH9AQEAjgMAIf4BAQDMAwAh_wEBAMwDACGAAgEAzAMAIYECAQDMAwAhAwAAABIAICQAAOQFACAlAADrBQAgBwAAABIAIAoAAIMDACAdAADrBQAgwwEEAPcCACHOAQQA9wIAIc8BBAD3AgAh0AFAAIEDACEFCgAAgwMAIMMBBAD3AgAhzgEEAPcCACHPAQQA9wIAIdABQACBAwAhCAktCQouBAsADhIGAhQyDRUzDRY0Bhc1CwYDAAEJIAkLAAwOCgMPJAoRKAsFBAACBQsDBgwDChAECwAIAwcRAwwTBQ0AAQMJFwYKGAQLAAcCBwAFCAABAgkZAAoaAAIGGwAKHAACBAACCAABAQQAAgIEAAIQAAEECSoADikADysAESwAAggAARMAAQcJNwAKOAASNgAUOQAVOgAWOwAXPAAAAAAFCwATKgAUKwAVLAAWLQAXAAAAAAAFCwATKgAUKwAVLAAWLQAXAQMAAQEDAAEFCwAcKgAdKwAeLAAfLQAgAAAAAAAFCwAcKgAdKwAeLAAfLQAgAgQAAgV0AwIEAAIFegMFCwAlKgAmKwAnLAAoLQApAAAAAAAFCwAlKgAmKwAnLAAoLQApAgQAAggAAQIEAAIIAAEFCwAuKgAvKwAwLAAxLQAyAAAAAAAFCwAuKgAvKwAwLAAxLQAyAQQAAgEEAAIFCwA3KgA4KwA5LAA6LQA7AAAAAAAFCwA3KgA4KwA5LAA6LQA7Awe4AQMMuQEFDQABAwe_AQMMwAEFDQABBQsAQCoAQSsAQiwAQy0ARAAAAAAABQsAQCoAQSsAQiwAQy0ARAIIAAETAAECCAABEwABBQsASSoASisASywATC0ATQAAAAAABQsASSoASisASywATC0ATQIEAAIQAAECBAACEAABBQsAUioAUysAVCwAVS0AVgAAAAAABQsAUioAUysAVCwAVS0AVgAABQsAWyoAXCsAXSwAXi0AXwAAAAAABQsAWyoAXCsAXSwAXi0AXwIHAAUIAAECBwAFCAABBQsAZCoAZSsAZiwAZy0AaAAAAAAABQsAZCoAZSsAZiwAZy0AaBgCARk9ARpAARtBARxCAR5EAR9GDyBHECFJASJLDyNMESZNASdOAShPDy5SEi9TGDBUAjFVAjJWAjNXAjRYAjVaAjZcDzddGThfAjlhDzpiGjtjAjxkAj1lDz5oGz9pIUBqA0FrA0JsA0NtA0RuA0VwA0ZyD0dzIkh2A0l4D0p5I0t7A0x8A019D06AASRPgQEqUIIBCVGDAQlShAEJU4UBCVSGAQlViAEJVooBD1eLAStYjQEJWY8BD1qQASxbkQEJXJIBCV2TAQ9elgEtX5cBM2CYAQphmQEKYpoBCmObAQpknAEKZZ4BCmagAQ9noQE0aKMBCmmlAQ9qpgE1a6cBCmyoAQptqQEPbqwBNm-tATxwrgEEca8BBHKwAQRzsQEEdLIBBHW0AQR2tgEPd7cBPXi7AQR5vQEPer4BPnvBAQR8wgEEfcMBD37GAT9_xwFFgAHIAQ2BAckBDYIBygENgwHLAQ2EAcwBDYUBzgENhgHQAQ-HAdEBRogB0wENiQHVAQ-KAdYBR4sB1wENjAHYAQ2NAdkBD44B3AFIjwHdAU6QAd4BC5EB3wELkgHgAQuTAeEBC5QB4gELlQHkAQuWAeYBD5cB5wFPmAHpAQuZAesBD5oB7AFQmwHtAQucAe4BC50B7wEPngHyAVGfAfMBV6AB9QEFoQH2AQWiAfgBBaMB-QEFpAH6AQWlAfwBBaYB_gEPpwH_AVioAYECBakBgwIPqgGEAlmrAYUCBawBhgIFrQGHAg-uAYoCWq8BiwJgsAGMAgaxAY0CBrIBjgIGswGPAga0AZACBrUBkgIGtgGUAg-3AZUCYbgBlwIGuQGZAg-6AZoCYrsBmwIGvAGcAga9AZ0CD74BoAJjvwGhAmk"
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
"kafkajs"(module) {
module.exports = require("kafkajs");

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
/* import */ var _nestjs_common__rspack_import_2 = __webpack_require__("@nestjs/common");
/* import */ var _nestjs_common__rspack_import_2_default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__rspack_import_2);
/* import */ var _app_module__rspack_import_3 = __webpack_require__("./apps/chatsystem/src/app.module.ts");




async function bootstrap() {
    const app = await _nestjs_core__rspack_import_1.NestFactory.create(_app_module__rspack_import_3.AppModule);
    app.useGlobalPipes(new _nestjs_common__rspack_import_2.ValidationPipe({
        whitelist: true,
        transform: true
    }));
    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
    });
    await app.listen(process.env.CHAT_PORT ?? process.env.PORT ?? 3000);
}
void bootstrap();

})();

module.exports = __webpack_exports__;
})()
;
//# sourceMappingURL=main.js.map