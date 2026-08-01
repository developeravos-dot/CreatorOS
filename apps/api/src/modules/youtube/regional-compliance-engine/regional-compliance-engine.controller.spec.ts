import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RegionalComplianceEngineController,
} from './regional-compliance-engine.controller';

import {
  RegionalComplianceEngineService,
} from './regional-compliance-engine.service';

describe('RegionalComplianceEngineController', () => {
  let controller: RegionalComplianceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [RegionalComplianceEngineController],
        providers: [RegionalComplianceEngineService],
      }).compile();

    controller =
      module.get<RegionalComplianceEngineController>(
        RegionalComplianceEngineController,
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
