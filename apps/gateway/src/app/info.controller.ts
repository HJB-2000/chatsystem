import { Controller, Get, Post } from '@nestjs/common';
import { RegistryService } from './registry.service';

@Controller('gateway')
export class InfoController {
  constructor(private readonly registry: RegistryService) {}

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
  stats() {
    return this.registry.stats();
  }
}