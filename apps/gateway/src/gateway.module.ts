import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MyGateway } from './app/gateway';

@Module({
  imports: [],
  controllers: [GatewayController],
  providers: [GatewayService, MyGateway],
})
export class GatewayModule {}
