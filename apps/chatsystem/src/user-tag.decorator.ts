import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserTag = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const raw = request.headers['x-user-tag'];
  return Array.isArray(raw) ? raw[0] : raw ?? '';
});