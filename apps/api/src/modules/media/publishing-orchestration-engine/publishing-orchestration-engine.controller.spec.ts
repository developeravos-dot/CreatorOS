import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PublishingOrchestrationEngineController,
} from './publishing-orchestration-engine.controller';

import {
  PublishingOrchestrationEngineService,
} from './publishing-orchestration-engine.service';

describe('PublishingOrchestrationEngineController', () => {
  let controller: PublishingOrchestrationEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PublishingOrchestrationEngineController,
        ],
        providers: [
          PublishingOrchestrationEngineService,
        ],
      }).compile();

    controller =
      module.get<PublishingOrchestrationEngineController>(
        PublishingOrchestrationEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
