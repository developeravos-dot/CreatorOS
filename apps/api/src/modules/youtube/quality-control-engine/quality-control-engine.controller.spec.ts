import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  QualityControlEngineController,
} from './quality-control-engine.controller';

import {
  QualityControlEngineService,
} from './quality-control-engine.service';

describe('QualityControlEngineController', () => {
  let controller: QualityControlEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [QualityControlEngineController],
        providers: [QualityControlEngineService],
      }).compile();

    controller =
      module.get<QualityControlEngineController>(
        QualityControlEngineController,
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
