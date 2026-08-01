import { Module } from '@nestjs/common';

import {
  MediaIpRegistryEngineController,
} from './media-ip-registry-engine.controller';

import {
  MediaIpRegistryEngineService,
} from './media-ip-registry-engine.service';

@Module({
  controllers: [MediaIpRegistryEngineController],
  providers: [MediaIpRegistryEngineService],
  exports: [MediaIpRegistryEngineService],
})
export class MediaIpRegistryEngineModule {}
