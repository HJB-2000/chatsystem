import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';

/**
 * Stateless REST API (spec: "REST API Servers (Stateless)").
 * Routes mirror client/Api.js so the front-end needs no changes.
 */
@Controller('api')
export class AppController {
  constructor(private readonly chat: ChatService) {}

  // ---- gateway discovery ----
  @Post('gateway/url')
  @Get('gateway/url')
  gatewayUrl() {
    return this.chat.gatewayUrl();
  }

  // ---- users ----
  @Get('users')
  users() {
    return this.chat.getUsers();
  }

  @Get('users/:id')
  user(@Param('id') id: string) {
    return this.chat.getUser(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.chat.updateUser(id, body);
  }

  // ---- guilds / collectives ----
  @Get('collectives')
  collectives(@Query('userId') userId: string) {
    return this.chat.getCollectives(userId);
  }

  @Post('collectives')
  createCollective(@Body() body: { userId: string; name: string }) {
    return this.chat.createCollective(body.userId, body.name);
  }

  @Get('collectives/:id/rooms')
  rooms(@Param('id') id: string, @Query('userId') userId: string) {
    return this.chat.getCollectiveRooms(id, userId);
  }

  @Post('collectives/:id/rooms')
  createRoom(@Param('id') id: string, @Body() body: any) {
    return this.chat.createCollectiveRoom(id, body.userId, body);
  }

  @Post('collectives/:id/invites')
  invite(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.chat.createInvite(id, body.userId);
  }

  @Post('invites/:token/join')
  joinInvite(@Param('token') token: string, @Body() body: { userId: string }) {
    return this.chat.joinByInvite(token, body.userId);
  }

  // ---- channels / rooms ----
  @Post('rooms/:id/join')
  joinRoom(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.chat.joinRoom(id, body.userId);
  }

  @Get('rooms/:id/members')
  members(@Param('id') id: string, @Query('userId') userId: string) {
    return this.chat.getRoomMembers(id, userId);
  }

  @Get('rooms/:id/messages')
  messages(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chat.getRoomMessages(id, userId, Number(limit) || 50, before);
  }

  @Get('channels/:id/messages')
  channelMessages(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chat.getRoomMessages(id, userId, Number(limit) || 50, before);
  }

  @Post('rooms/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @Body() body: { senderId: string; userId?: string; message?: string; content?: string },
  ) {
    return this.chat.createRoomMessage(
      id,
      body.senderId ?? body.userId!,
      body.message ?? body.content ?? '',
    );
  }

  @Post('channels/:id/messages')
  channelSendMessage(
    @Param('id') id: string,
    @Body() body: { senderId: string; userId?: string; message?: string; content?: string },
  ) {
    return this.chat.createRoomMessage(
      id,
      body.senderId ?? body.userId!,
      body.message ?? body.content ?? '',
    );
  }

  @Patch('rooms/:roomId/messages/:messageId')
  editMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
    @Body() body: { userId: string; message: string },
  ) {
    return this.chat.editMessage(roomId, messageId, body.userId, body.message);
  }

  @Delete('rooms/:roomId/messages/:messageId')
  deleteMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
    @Query('userId') userId: string,
  ) {
    return this.chat.deleteMessage(roomId, messageId, userId);
  }

  // ---- voice ----
  @Post('channels/:id/join-voice')
  joinVoice(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.chat.joinVoice(id, body.userId);
  }

  @Post('channels/:id/leave-voice')
  leaveVoice(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.chat.leaveVoice(id, body.userId);
  }

  // ---- presence ----
  @Patch('users/:id/presence')
  presence(@Param('id') id: string, @Body() body: { status: string }) {
    return this.chat.setPresence(id, body.status);
  }

  // ---- DMs ----
  @Get('dms/:userId')
  dms(@Param('userId') userId: string) {
    return this.chat.getDirectMessages(userId);
  }

  @Get('dms/:userId/:partnerId')
  dmHistory(@Param('userId') userId: string, @Param('partnerId') partnerId: string) {
    return this.chat.getDirectMessageHistory(userId, partnerId);
  }

  @Post('dms/:userId/:partnerId')
  sendDm(
    @Param('userId') userId: string,
    @Param('partnerId') partnerId: string,
    @Body() body: { message: string },
  ) {
    return this.chat.sendDirectMessage(userId, partnerId, body.message);
  }

  @Patch('dms/:userId/:partnerId/read')
  readDm(@Param('userId') _userId: string, @Param('partnerId') _partnerId: string) {
    return { ok: true };
  }

  @Post('friends/:userId/:partnerId')
  addFriend(@Param('userId') userId: string, @Param('partnerId') partnerId: string) {
    return this.chat.addFriend(userId, partnerId);
  }
}
