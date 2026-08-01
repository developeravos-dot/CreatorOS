import { Module } from '@nestjs/common';
import { BusinessHumanFinalAuthorityStageController } from './business-human-final-authority-stage.controller';
import { BusinessHumanFinalAuthorityStageService } from './business-human-final-authority-stage.service';

@Module({
  controllers: [BusinessHumanFinalAuthorityStageController],
  providers: [BusinessHumanFinalAuthorityStageService],
  exports: [BusinessHumanFinalAuthorityStageService],
})
export class BusinessHumanFinalAuthorityStageModule {}
