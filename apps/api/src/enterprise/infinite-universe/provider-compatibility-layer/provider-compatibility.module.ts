import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { ProviderCompatibilityController } from './provider-compatibility.controller';
import { ProviderCompatibilityService } from './provider-compatibility.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    ProviderCompatibilityController,
  ],

  providers: [
    ProviderCompatibilityService,
  ],

  exports: [
    ProviderCompatibilityService,
  ],
})
export class ProviderCompatibilityModule {}
