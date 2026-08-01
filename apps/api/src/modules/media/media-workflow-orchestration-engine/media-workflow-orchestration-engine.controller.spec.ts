import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaWorkflowOrchestrationEngineController,
} from './media-workflow-orchestration-engine.controller';

import {
  MediaWorkflowOrchestrationEngineService,
} from './media-workflow-orchestration-engine.service';

describe('MediaWorkflowOrchestrationEngineController', () => {
  let controller: MediaWorkflowOrchestrationEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MediaWorkflowOrchestrationEngineController,
        ],
        providers: [
          MediaWorkflowOrchestrationEngineService,
        ],
      }).compile();

    controller =
      module.get<MediaWorkflowOrchestrationEngineController>(
        MediaWorkflowOrchestrationEngineController,
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
