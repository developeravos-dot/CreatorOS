import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { CharacterReferenceBibleEngine } from './engines/character-reference-bible.engine';
import { EnvironmentReferenceBibleEngine } from './engines/environment-reference-bible.engine';
import { PropReferenceBibleEngine } from './engines/prop-reference-bible.engine';
import { VisualReferenceBibleQualityEngine } from './engines/visual-reference-bible-quality.engine';
import { WorldVisualRulesEngine } from './engines/world-visual-rules.engine';

import { VisualReferenceBibleController } from './visual-reference-bible.controller';
import { VisualReferenceBibleService } from './visual-reference-bible.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    VisualReferenceBibleController,
  ],

  providers: [
    VisualReferenceBibleService,
    CharacterReferenceBibleEngine,
    EnvironmentReferenceBibleEngine,
    PropReferenceBibleEngine,
    WorldVisualRulesEngine,
    VisualReferenceBibleQualityEngine,
  ],

  exports: [
    VisualReferenceBibleService,
  ],
})
export class VisualReferenceBibleModule {}
