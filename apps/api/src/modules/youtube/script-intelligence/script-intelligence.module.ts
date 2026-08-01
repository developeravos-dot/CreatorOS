import { Module } from '@nestjs/common';

import {
  ScriptIntelligenceController,
} from './script-intelligence.controller';

import {
  ScriptIntelligenceService,
} from './script-intelligence.service';

@Module({
  controllers: [ScriptIntelligenceController],
  providers: [ScriptIntelligenceService],
  exports: [ScriptIntelligenceService],
})
export class ScriptIntelligenceModule {}
