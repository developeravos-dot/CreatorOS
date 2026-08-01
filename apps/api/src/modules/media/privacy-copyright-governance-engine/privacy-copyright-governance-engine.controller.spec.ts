import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PrivacyCopyrightGovernanceEngineController,
} from './privacy-copyright-governance-engine.controller';

import {
  PrivacyCopyrightGovernanceEngineService,
} from './privacy-copyright-governance-engine.service';

describe('PrivacyCopyrightGovernanceEngineController', () => {
  let controller: PrivacyCopyrightGovernanceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          PrivacyCopyrightGovernanceEngineController,
        ],
        providers: [
          PrivacyCopyrightGovernanceEngineService,
        ],
      }).compile();

    controller =
      module.get<PrivacyCopyrightGovernanceEngineController>(
        PrivacyCopyrightGovernanceEngineController,
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
