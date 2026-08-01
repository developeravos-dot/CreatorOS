import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  QualityAssuranceStageController,
} from './quality-assurance-stage.controller';

import {
  QualityAssuranceStageService,
} from './quality-assurance-stage.service';

describe('QualityAssuranceStageController', () => {
  let controller: QualityAssuranceStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          QualityAssuranceStageController,
        ],
        providers: [
          QualityAssuranceStageService,
        ],
      }).compile();

    controller =
      module.get<QualityAssuranceStageController>(
        QualityAssuranceStageController,
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
