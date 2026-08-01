import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { CharacterVisualConsistencyEngine } from './engines/character-visual-consistency.engine';
import { ProductionAssetManifestEngine } from './engines/production-asset-manifest.engine';
import { StoryboardQualityEngine } from './engines/storyboard-quality.engine';
import { StoryboardShotPlannerEngine } from './engines/storyboard-shot-planner.engine';
import { VisualProductionPromptEngine } from './engines/visual-production-prompt.engine';

import { StoryboardEngineController } from './storyboard-engine.controller';
import { StoryboardEngineService } from './storyboard-engine.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    StoryboardEngineController,
  ],

  providers: [
    StoryboardEngineService,
    StoryboardShotPlannerEngine,
    CharacterVisualConsistencyEngine,
    VisualProductionPromptEngine,
    ProductionAssetManifestEngine,
    StoryboardQualityEngine,
  ],

  exports: [
    StoryboardEngineService,
  ],
})
export class StoryboardEngineModule {}
