import { Module } from '@nestjs/common';

import { CharacterOsModule } from './character-os/character-os.module';
import { CinematicScriptEngineModule } from './cinematic-script-engine/cinematic-script-engine.module';
import { EndlessEpisodeEngineModule } from './episode-engine/endless-episode-engine.module';
import { ImageProviderAdapterModule } from './image-provider-adapter/image-provider-adapter.module';
import { PermanentUniverseMemoryModule } from './persistent-memory/permanent-universe-memory.module';
import { ProviderCompatibilityModule } from './provider-compatibility-layer/provider-compatibility.module';
import { ProviderMigrationGateModule } from './provider-migration-gate/provider-migration-gate.module';
import { StoryboardEngineModule } from './storyboard-engine/storyboard-engine.module';
import { VisualConsistencyModule } from './visual-consistency-engine/visual-consistency.module';
import { VisualReferenceBibleModule } from './visual-reference-bible/visual-reference-bible.module';
import { WorldEngineModule } from './world-engine/world-engine.module';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
    WorldEngineModule,
    CharacterOsModule,
    EndlessEpisodeEngineModule,
    CinematicScriptEngineModule,
    StoryboardEngineModule,
    VisualReferenceBibleModule,
    ImageProviderAdapterModule,
    VisualConsistencyModule,
    ProviderCompatibilityModule,
    ProviderMigrationGateModule,
  ],

  exports: [
    PermanentUniverseMemoryModule,
    WorldEngineModule,
    CharacterOsModule,
    EndlessEpisodeEngineModule,
    CinematicScriptEngineModule,
    StoryboardEngineModule,
    VisualReferenceBibleModule,
    ImageProviderAdapterModule,
    VisualConsistencyModule,
    ProviderCompatibilityModule,
    ProviderMigrationGateModule,
  ],
})
export class InfiniteUniverseModule {}
