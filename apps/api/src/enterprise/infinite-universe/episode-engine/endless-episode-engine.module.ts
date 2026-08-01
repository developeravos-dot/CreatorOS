import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { EpisodeCharacterCastEngine } from './engines/episode-character-cast.engine';
import { EpisodeScenePlannerEngine } from './engines/episode-scene-planner.engine';
import { StoryPressureEngine } from './engines/story-pressure.engine';
import { StoryThreadSelectorEngine } from './engines/story-thread-selector.engine';

import { EndlessEpisodeEngineController } from './endless-episode-engine.controller';
import { EndlessEpisodeEngineService } from './endless-episode-engine.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    EndlessEpisodeEngineController,
  ],

  providers: [
    EndlessEpisodeEngineService,
    StoryPressureEngine,
    StoryThreadSelectorEngine,
    EpisodeCharacterCastEngine,
    EpisodeScenePlannerEngine,
  ],

  exports: [
    EndlessEpisodeEngineService,
  ],
})
export class EndlessEpisodeEngineModule {}
