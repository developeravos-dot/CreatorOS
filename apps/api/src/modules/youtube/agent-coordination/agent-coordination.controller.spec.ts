import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AgentCoordinationController,
} from './agent-coordination.controller';

import {
  AgentCoordinationService,
} from './agent-coordination.service';

describe('AgentCoordinationController', () => {
  let controller: AgentCoordinationController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AgentCoordinationController],
        providers: [AgentCoordinationService],
      }).compile();

    controller =
      module.get<AgentCoordinationController>(
        AgentCoordinationController,
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
