import { Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { RegistryService } from './registry.service';
import { SessionLoader } from './session-loader.service';

@Controller('gateway')
export class InfoController {
  constructor(
    private readonly registry: RegistryService,
    private readonly loader: SessionLoader,
  ) {}

  /** spec: client asks API for best gateway URL (geo/load routing goes here) */
  @Post('url')
  url() {
    return {
      url:
        process.env.GATEWAY_PUBLIC_URL ??
        `ws://localhost:${process.env.GATEWAY_PORT ?? process.env.PORT ?? 3001}/gateway`,
    };
  }

  @Get('stats')
  async stats(@Req() request: { headers: { 'x-user-tag'?: string } }) {
    const userTagId = request.headers['x-user-tag'];
    if (!userTagId || !(await this.loader.load(userTagId))) throw new UnauthorizedException();
    return this.registry.stats();
  }
}