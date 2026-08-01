import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { UniverseDnaEngine } from './engines/universe-dna.engine';
import { WorldBuilderEngine } from './engines/world-builder.engine';
import { WorldPsychologyEngine } from './engines/world-psychology.engine';
import { WorldTimelineEngine } from './engines/world-timeline.engine';

import { WorldEngineController } from './world-engine.controller';
import { WorldEngineService } from './world-engine.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    WorldEngineController,
  ],

  providers: [
    WorldEngineService,
    UniverseDnaEngine,
    WorldBuilderEngine,
    WorldPsychologyEngine,
    WorldTimelineEngine,
  ],

  exports: [
    WorldEngineService,
  ],
})
export class WorldEngineModule {}
