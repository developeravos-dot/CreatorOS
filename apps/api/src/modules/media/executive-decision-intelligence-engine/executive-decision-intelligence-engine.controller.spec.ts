import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ExecutiveDecisionIntelligenceEngineController,
} from './executive-decision-intelligence-engine.controller';

import {
  ExecutiveDecisionIntelligenceEngineService,
} from './executive-decision-intelligence-engine.service';

describe('ExecutiveDecisionIntelligenceEngineController', () => {
  let controller: ExecutiveDecisionIntelligenceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ExecutiveDecisionIntelligenceEngineController,
        ],
        providers: [
          ExecutiveDecisionIntelligenceEngineService,
        ],
      }).compile();

    controller =
      module.get<ExecutiveDecisionIntelligenceEngineController>(
        ExecutiveDecisionIntelligenceEngineController,
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
