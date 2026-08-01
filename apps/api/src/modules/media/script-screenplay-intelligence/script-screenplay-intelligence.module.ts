import { Module } from '@nestjs/common';

import {
  ScriptScreenplayIntelligenceController,
} from './script-screenplay-intelligence.controller';

import {
  ScriptScreenplayIntelligenceService,
} from './script-screenplay-intelligence.service';

@Module({
  controllers: [ScriptScreenplayIntelligenceController],
  providers: [ScriptScreenplayIntelligenceService],
  exports: [ScriptScreenplayIntelligenceService],
})
export class ScriptScreenplayIntelligenceModule {}
