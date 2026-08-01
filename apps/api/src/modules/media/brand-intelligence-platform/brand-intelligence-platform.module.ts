import { Module } from '@nestjs/common';

import {
  BrandIntelligencePlatformController,
} from './brand-intelligence-platform.controller';

import {
  BrandIntelligencePlatformService,
} from './brand-intelligence-platform.service';

@Module({
  controllers: [BrandIntelligencePlatformController],
  providers: [BrandIntelligencePlatformService],
  exports: [BrandIntelligencePlatformService],
})
export class BrandIntelligencePlatformModule {}
