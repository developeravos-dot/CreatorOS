import { Module } from '@nestjs/common';
import { MusicIntelligenceStageController } from './music-intelligence-stage.controller';
import { MusicIntelligenceStageService } from './music-intelligence-stage.service';

@Module({
  controllers: [MusicIntelligenceStageController],
  providers: [MusicIntelligenceStageService],
  exports: [MusicIntelligenceStageService],
})
export class MusicIntelligenceStageModule {}
