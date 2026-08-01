import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ExpansionReadinessStageController,
} from './expansion-readiness-stage.controller';

import {
  ExpansionReadinessStageService,
} from './expansion-readiness-stage.service';

describe('ExpansionReadinessStageController', () => {
  let controller: ExpansionReadinessStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ExpansionReadinessStageController,
        ],
        providers: [
          ExpansionReadinessStageService,
        ],
      }).compile();

    controller =
      module.get<ExpansionReadinessStageController>(
        ExpansionReadinessStageController,
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
