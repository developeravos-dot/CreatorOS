import { Module } from '@nestjs/common';

import {
  BrandIdentityCreativeStudioController,
} from './brand-identity-creative-studio.controller';

import {
  BrandIdentityCreativeStudioService,
} from './brand-identity-creative-studio.service';

@Module({
  controllers: [BrandIdentityCreativeStudioController],
  providers: [BrandIdentityCreativeStudioService],
  exports: [BrandIdentityCreativeStudioService],
})
export class BrandIdentityCreativeStudioModule {}
