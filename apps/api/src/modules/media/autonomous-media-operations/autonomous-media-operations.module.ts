import { Module } from '@nestjs/common';
import { AutonomousMediaOperationsController } from './autonomous-media-operations.controller';
import { AutonomousMediaOperationsService } from './autonomous-media-operations.service';
import { MediaExperimentService } from './media-experiment.service';
import { MediaMemoryService } from './media-memory.service';

@Module({
  controllers: [AutonomousMediaOperationsController],
  providers: [
    MediaMemoryService,
    MediaExperimentService,
    AutonomousMediaOperationsService,
  ],
  exports: [
    MediaMemoryService,
    MediaExperimentService,
    AutonomousMediaOperationsService,
  ],
})
export class AutonomousMediaOperationsModule {}
