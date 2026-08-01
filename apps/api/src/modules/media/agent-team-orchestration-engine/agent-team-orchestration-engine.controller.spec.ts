import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AgentTeamOrchestrationEngineController,
} from './agent-team-orchestration-engine.controller';

import {
  AgentTeamOrchestrationEngineService,
} from './agent-team-orchestration-engine.service';

describe('AgentTeamOrchestrationEngineController', () => {
  let controller: AgentTeamOrchestrationEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AgentTeamOrchestrationEngineController,
        ],
        providers: [
          AgentTeamOrchestrationEngineService,
        ],
      }).compile();

    controller =
      module.get<AgentTeamOrchestrationEngineController>(
        AgentTeamOrchestrationEngineController,
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
