import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { CanonicalFingerprintEngine } from './engines/canonical-fingerprint.engine';
import { ConsistencyPromptRepairEngine } from './engines/consistency-prompt-repair.engine';
import { VisualIdentityValidatorEngine } from './engines/visual-identity-validator.engine';

import { VisualConsistencyController } from './visual-consistency.controller';
import { VisualConsistencyService } from './visual-consistency.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    VisualConsistencyController,
  ],

  providers: [
    VisualConsistencyService,
    CanonicalFingerprintEngine,
    VisualIdentityValidatorEngine,
    ConsistencyPromptRepairEngine,
  ],

  exports: [
    VisualConsistencyService,
  ],
})
export class VisualConsistencyModule {}
