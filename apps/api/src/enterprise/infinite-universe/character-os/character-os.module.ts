import { Module } from '@nestjs/common';

import { PermanentUniverseMemoryModule } from '../persistent-memory/permanent-universe-memory.module';

import { CharacterDecisionEngine } from './engines/character-decision.engine';
import { CharacterDnaEngine } from './engines/character-dna.engine';
import { CharacterMemoryEngine } from './engines/character-memory.engine';
import { CharacterRelationshipEngine } from './engines/character-relationship.engine';

import { CharacterOsController } from './character-os.controller';
import { CharacterOsService } from './character-os.service';

@Module({
  imports: [
    PermanentUniverseMemoryModule,
  ],

  controllers: [
    CharacterOsController,
  ],

  providers: [
    CharacterOsService,
    CharacterDnaEngine,
    CharacterRelationshipEngine,
    CharacterMemoryEngine,
    CharacterDecisionEngine,
  ],

  exports: [
    CharacterOsService,
  ],
})
export class CharacterOsModule {}
