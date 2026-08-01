import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  VisualProductionEngineController,
} from './visual-production-engine.controller';

import {
  VisualProductionEngineService,
} from './visual-production-engine.service';

describe('VisualProductionEngineController', () => {
  let controller: VisualProductionEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          VisualProductionEngineController,
        ],
        providers: [
          VisualProductionEngineService,
        ],
      }).compile();

    controller =
      module.get<VisualProductionEngineController>(
        VisualProductionEngineController,
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
