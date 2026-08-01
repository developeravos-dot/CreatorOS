import { Module } from '@nestjs/common';
import { IdeaRankingStageController } from './idea-ranking-stage.controller';
import { IdeaRankingStageService } from './idea-ranking-stage.service';

@Module({
  controllers: [IdeaRankingStageController],
  providers: [IdeaRankingStageService],
  exports: [IdeaRankingStageService],
})
export class IdeaRankingStageModule {}
