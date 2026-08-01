import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PolicyLegalComplianceEngineController,
} from './policy-legal-compliance-engine.controller';

import {
  PolicyLegalComplianceEngineService,
} from './policy-legal-compliance-engine.service';

describe('PolicyLegalComplianceEngineController', () => {
  let controller: PolicyLegalComplianceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PolicyLegalComplianceEngineController,
        ],
        providers: [
          PolicyLegalComplianceEngineService,
        ],
      }).compile();

    controller =
      module.get<PolicyLegalComplianceEngineController>(
        PolicyLegalComplianceEngineController,
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
