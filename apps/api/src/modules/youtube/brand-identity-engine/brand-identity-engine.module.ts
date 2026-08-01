import { Module } from '@nestjs/common';

import {
  BrandIdentityEngineController,
} from './brand-identity-engine.controller';

import {
  BrandIdentityEngineService,
} from './brand-identity-engine.service';

@Module({
  controllers: [BrandIdentityEngineController],
  providers: [BrandIdentityEngineService],
  exports: [BrandIdentityEngineService],
})
export class BrandIdentityEngineModule {}
