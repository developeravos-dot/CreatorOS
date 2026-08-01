import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';
import { ProviderCompatibilityModule } from '../provider-compatibility-layer/provider-compatibility.module';

import { ProviderMigrationGateController } from './provider-migration-gate.controller';
import { ProviderMigrationGateService } from './provider-migration-gate.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
    ProviderCompatibilityModule,
  ],

  controllers: [
    ProviderMigrationGateController,
  ],

  providers: [
    ProviderMigrationGateService,
  ],

  exports: [
    ProviderMigrationGateService,
  ],
})
export class ProviderMigrationGateModule {}
