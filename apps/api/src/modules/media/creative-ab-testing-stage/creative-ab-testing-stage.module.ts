import { Module } from '@nestjs/common';
import { CreativeAbTestingStageController } from './creative-ab-testing-stage.controller';
import { CreativeAbTestingStageService } from './creative-ab-testing-stage.service';

@Module({
  controllers: [CreativeAbTestingStageController],
  providers: [CreativeAbTestingStageService],
  exports: [CreativeAbTestingStageService],
})
export class CreativeAbTestingStageModule {}
