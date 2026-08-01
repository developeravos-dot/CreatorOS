import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  GovernanceAuditAuthorityEngineController,
} from './governance-audit-authority-engine.controller';

import {
  GovernanceAuditAuthorityEngineService,
} from './governance-audit-authority-engine.service';

describe('GovernanceAuditAuthorityEngineController', () => {
  let controller: GovernanceAuditAuthorityEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          GovernanceAuditAuthorityEngineController,
        ],
        providers: [
          GovernanceAuditAuthorityEngineService,
        ],
      }).compile();

    controller =
      module.get<GovernanceAuditAuthorityEngineController>(
        GovernanceAuditAuthorityEngineController,
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
