import { Module } from '@nestjs/common';

import {
  AffiliateCommerceController,
} from './affiliate-commerce.controller';

import {
  AffiliateCommerceService,
} from './affiliate-commerce.service';

@Module({
  controllers: [AffiliateCommerceController],
  providers: [AffiliateCommerceService],
  exports: [AffiliateCommerceService],
})
export class AffiliateCommerceModule {}
