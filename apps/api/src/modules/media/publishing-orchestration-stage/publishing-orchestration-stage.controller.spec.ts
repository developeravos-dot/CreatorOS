import { Test } from '@nestjs/testing';
import { PublishingOrchestrationStageController } from './publishing-orchestration-stage.controller';
import { PublishingOrchestrationStageService } from './publishing-orchestration-stage.service';

describe('PublishingOrchestrationStageController', () => {
  let controller: PublishingOrchestrationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PublishingOrchestrationStageController],
      providers: [PublishingOrchestrationStageService],
    }).compile();

    controller = moduleRef.get(PublishingOrchestrationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
