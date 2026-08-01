import { Module } from '@nestjs/common';

import {
  ContentTrustSafetyEngineController,
} from './content-trust-safety-engine.controller';

import {
  ContentTrustSafetyEngineService,
} from './content-trust-safety-engine.service';

@Module({
  controllers: [ContentTrustSafetyEngineController],
  providers: [ContentTrustSafetyEngineService],
  exports: [ContentTrustSafetyEngineService],
})
export class ContentTrustSafetyEngineModule {}
