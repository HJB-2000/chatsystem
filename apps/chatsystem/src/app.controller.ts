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
import { UserTag } from './user-tag.decorator';

@Controller('api')
export class AppController {
  constructor(private readonly chat: ChatService) {}

  @Get('gateway/url')
  gatewayUrlGet() {
    return this.chat.gatewayUrl();
  }

  @Post('gateway/url')
  gatewayUrlPost() {
    return this.chat.gatewayUrl();
  }
  // ---- users ----
  @Get('users')
  users(@UserTag() tag: string) {
    return this.chat.getUsers(tag);
  }

  @Get('users/:id')
  user(@Param('id') id: string, @UserTag() tag: string) {
    return this.chat.getUser(id, tag);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @UserTag() tag: string, @Body() body: any) {
    return this.chat.updateUser(id, tag, body);
  }

  // ---- presence ----
  @Patch('users/me/presence')
  presence(@UserTag() tag: string, @Body() body: { status: string }) {
    return this.chat.setPresence(tag, body.status);
  }

  // ---- guilds / collectives ----
  @Get('collectives')
  collectives(@UserTag() tag: string) {
    return this.chat.getCollectives(tag);
  }

  @Post('collectives')
  createCollective(@UserTag() tag: string, @Body() body: { name: string }) {
    return this.chat.createCollective(tag, body.name);
  }

  @Get('collectives/:id/rooms')
  rooms(@Param('id') id: string, @UserTag() tag: string) {
    return this.chat.getCollectiveRooms(id, tag);
  }

  @Post('collectives/:id/rooms')
  createRoom(@Param('id') id: string, @UserTag() tag: string, @Body() body: any) {
    return this.chat.createCollectiveRoom(id, tag, body);
  }

  @Post('collectives/:id/invites')
  invite(@Param('id') id: string, @UserTag() tag: string) {
    return this.chat.createInvite(id, tag);
  }

  @Post('invites/:token/join')
  joinInvite(@Param('token') token: string, @UserTag() tag: string) {
    return this.chat.joinByInvite(token, tag);
  }

  // ---- channels / rooms ----
  // @Post('rooms/:id/join')
  // joinRoom(@Param('id') id: string, @UserTag() tag: string) {
  //   return this.chat.joinRoom(id, tag);
  // }

  @Get('rooms/:id/members')
  members(@Param('id') id: string, @UserTag() tag: string) {
    return this.chat.getRoomMembers(id, tag);
  }

  @Get('rooms/:id/messages')
  messages(
    @Param('id') id: string,
    @UserTag() tag: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chat.getRoomMessages(id, tag, Number(limit) || 50, before);
  }

  @Get('channels/:id/messages')
  channelMessages(
    @Param('id') id: string,
    @UserTag() tag: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chat.getRoomMessages(id, tag, Number(limit) || 50, before);
  }

  @Post('rooms/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @UserTag() tag: string,
    @Body() body: { message?: string; content?: string },
  ) {
    return this.chat.createRoomMessage(id, tag, body.message ?? body.content ?? '');
  }

  @Post('channels/:id/messages')
  channelSendMessage(
    @Param('id') id: string,
    @UserTag() tag: string,
    @Body() body: { message?: string; content?: string },
  ) {
    return this.chat.createRoomMessage(id, tag, body.message ?? body.content ?? '');
  }

  @Patch('rooms/:roomId/messages/:messageId')
  editMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
    @UserTag() tag: string,
    @Body() body: { message: string },
  ) {
    return this.chat.editMessage(roomId, messageId, tag, body.message);
  }

  @Delete('rooms/:roomId/messages/:messageId')
  deleteMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
    @UserTag() tag: string,
  ) {
    return this.chat.deleteMessage(roomId, messageId, tag);
  }

  // ---- voice ----
  @Post('channels/:id/join-voice')
  joinVoice(@Param('id') id: string, @UserTag() tag: string) {
    return this.chat.joinVoice(id, tag);
  }

  @Post('channels/:id/leave-voice')
  leaveVoice(@Param('id') id: string, @UserTag() tag: string) {
    return this.chat.leaveVoice(id, tag);
  }

  // ---- DMs (caller = header, :partnerId = public numeric id) ----
  @Get('dms')
  dms(@UserTag() tag: string) {
    return this.chat.getDirectMessages(tag);
  }

  @Get('dms/:partnerId')
  dmHistory(@UserTag() tag: string, @Param('partnerId') partnerId: string) {
    return this.chat.getDirectMessageHistory(tag, partnerId);
  }

  @Post('dms/:partnerId')
  sendDm(
    @UserTag() tag: string,
    @Param('partnerId') partnerId: string,
    @Body() body: { message: string },
  ) {
    return this.chat.sendDirectMessage(tag, partnerId, body.message);
  }

  @Patch('dms/:partnerId/read')
  readDm(@UserTag() tag: string, @Param('partnerId') partnerId: string) {
    return this.chat.markDmRead(tag, partnerId);
  }

}