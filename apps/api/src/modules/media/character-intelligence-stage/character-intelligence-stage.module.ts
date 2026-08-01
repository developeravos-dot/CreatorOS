import { Module } from '@nestjs/common';
import { CharacterIntelligenceStageController } from './character-intelligence-stage.controller';
import { CharacterIntelligenceStageService } from './character-intelligence-stage.service';

@Module({
  controllers: [CharacterIntelligenceStageController],
  providers: [CharacterIntelligenceStageService],
  exports: [CharacterIntelligenceStageService],
})
export class CharacterIntelligenceStageModule {}
