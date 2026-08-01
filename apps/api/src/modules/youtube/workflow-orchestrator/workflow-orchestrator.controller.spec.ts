import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  WorkflowOrchestratorController,
} from './workflow-orchestrator.controller';

import {
  WorkflowOrchestratorService,
} from './workflow-orchestrator.service';

describe('WorkflowOrchestratorController', () => {
  let controller: WorkflowOrchestratorController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [WorkflowOrchestratorController],
        providers: [WorkflowOrchestratorService],
      }).compile();

    controller =
      module.get<WorkflowOrchestratorController>(
        WorkflowOrchestratorController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
