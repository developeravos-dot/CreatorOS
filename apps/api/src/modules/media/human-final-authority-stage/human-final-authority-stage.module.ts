import { Module } from '@nestjs/common';
import { HumanFinalAuthorityStageController } from './human-final-authority-stage.controller';
import { HumanFinalAuthorityStageService } from './human-final-authority-stage.service';

@Module({
  controllers: [HumanFinalAuthorityStageController],
  providers: [HumanFinalAuthorityStageService],
  exports: [HumanFinalAuthorityStageService],
})
export class HumanFinalAuthorityStageModule {}
