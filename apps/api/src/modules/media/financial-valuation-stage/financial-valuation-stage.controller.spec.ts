import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  FinancialValuationStageController,
} from './financial-valuation-stage.controller';

import {
  FinancialValuationStageService,
} from './financial-valuation-stage.service';

describe('FinancialValuationStageController', () => {
  let controller: FinancialValuationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          FinancialValuationStageController,
        ],
        providers: [
          FinancialValuationStageService,
        ],
      }).compile();

    controller =
      module.get<FinancialValuationStageController>(
        FinancialValuationStageController,
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

  it('should expose 24-stage blueprint', () => {
    expect(
      controller.getBlueprint().stages,
    ).toHaveLength(24);
  });
});
