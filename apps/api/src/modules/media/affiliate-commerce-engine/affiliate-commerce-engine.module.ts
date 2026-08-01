import { Module } from '@nestjs/common';

import {
  AffiliateCommerceEngineController,
} from './affiliate-commerce-engine.controller';

import {
  AffiliateCommerceEngineService,
} from './affiliate-commerce-engine.service';

@Module({
  controllers: [AffiliateCommerceEngineController],
  providers: [AffiliateCommerceEngineService],
  exports: [AffiliateCommerceEngineService],
})
export class AffiliateCommerceEngineModule {}
