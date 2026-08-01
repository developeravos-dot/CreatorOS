import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ProductionStageController,
} from './production-stage.controller';

import {
  ProductionStageService,
} from './production-stage.service';

describe('ProductionStageController', () => {
  let controller: ProductionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ProductionStageController,
        ],
        providers: [
          ProductionStageService,
        ],
      }).compile();

    controller =
      module.get<ProductionStageController>(
        ProductionStageController,
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
