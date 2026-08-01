import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AiOrganizationDecisionEngineController,
} from './ai-organization-decision-engine.controller';

import {
  AiOrganizationDecisionEngineService,
} from './ai-organization-decision-engine.service';

describe('AiOrganizationDecisionEngineController', () => {
  let controller: AiOrganizationDecisionEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AiOrganizationDecisionEngineController,
        ],
        providers: [
          AiOrganizationDecisionEngineService,
        ],
      }).compile();

    controller =
      module.get<AiOrganizationDecisionEngineController>(
        AiOrganizationDecisionEngineController,
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
