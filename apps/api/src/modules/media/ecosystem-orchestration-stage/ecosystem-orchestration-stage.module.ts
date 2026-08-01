import { Module } from '@nestjs/common';
import { EcosystemOrchestrationStageController } from './ecosystem-orchestration-stage.controller';
import { EcosystemOrchestrationStageService } from './ecosystem-orchestration-stage.service';

@Module({
  controllers: [EcosystemOrchestrationStageController],
  providers: [EcosystemOrchestrationStageService],
  exports: [EcosystemOrchestrationStageService],
})
export class EcosystemOrchestrationStageModule {}
