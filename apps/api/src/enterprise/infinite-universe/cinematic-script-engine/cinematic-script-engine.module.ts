import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { CharacterVoiceEngine } from './engines/character-voice.engine';
import { SceneScreenplayEngine } from './engines/scene-screenplay.engine';
import { ScriptAudienceSafetyEngine } from './engines/script-audience-safety.engine';
import { ScriptQualityEngine } from './engines/script-quality.engine';
import { VisualDirectionEngine } from './engines/visual-direction.engine';

import { CinematicScriptEngineController } from './cinematic-script-engine.controller';
import { CinematicScriptEngineService } from './cinematic-script-engine.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    CinematicScriptEngineController,
  ],

  providers: [
    CinematicScriptEngineService,
    SceneScreenplayEngine,
    CharacterVoiceEngine,
    VisualDirectionEngine,
    ScriptAudienceSafetyEngine,
    ScriptQualityEngine,
  ],

  exports: [
    CinematicScriptEngineService,
  ],
})
export class CinematicScriptEngineModule {}
