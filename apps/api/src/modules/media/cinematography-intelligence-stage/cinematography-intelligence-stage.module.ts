import { Module } from '@nestjs/common';
import { CinematographyIntelligenceStageController } from './cinematography-intelligence-stage.controller';
import { CinematographyIntelligenceStageService } from './cinematography-intelligence-stage.service';

@Module({
  controllers: [CinematographyIntelligenceStageController],
  providers: [CinematographyIntelligenceStageService],
  exports: [CinematographyIntelligenceStageService],
})
export class CinematographyIntelligenceStageModule {}
