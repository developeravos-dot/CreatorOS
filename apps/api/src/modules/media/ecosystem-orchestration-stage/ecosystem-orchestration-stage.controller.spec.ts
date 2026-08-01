import { Test } from '@nestjs/testing';
import { EcosystemOrchestrationStageController } from './ecosystem-orchestration-stage.controller';
import { EcosystemOrchestrationStageService } from './ecosystem-orchestration-stage.service';

describe('EcosystemOrchestrationStageController', () => {
  let controller: EcosystemOrchestrationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EcosystemOrchestrationStageController],
      providers: [EcosystemOrchestrationStageService],
    }).compile();

    controller = moduleRef.get(EcosystemOrchestrationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
