import { Module } from '@nestjs/common';
import { IdeaGenerationStageController } from './idea-generation-stage.controller';
import { IdeaGenerationStageService } from './idea-generation-stage.service';

@Module({
  controllers: [IdeaGenerationStageController],
  providers: [IdeaGenerationStageService],
  exports: [IdeaGenerationStageService],
})
export class IdeaGenerationStageModule {}
