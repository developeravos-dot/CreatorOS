import { Module } from '@nestjs/common';
import { StoryWorldBuildingStageController } from './story-world-building-stage.controller';
import { StoryWorldBuildingStageService } from './story-world-building-stage.service';

@Module({
  controllers: [StoryWorldBuildingStageController],
  providers: [StoryWorldBuildingStageService],
  exports: [StoryWorldBuildingStageService],
})
export class StoryWorldBuildingStageModule {}
