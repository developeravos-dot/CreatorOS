import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  DigitalProductsEngineController,
} from './digital-products-engine.controller';

import {
  DigitalProductsEngineService,
} from './digital-products-engine.service';

describe('DigitalProductsEngineController', () => {
  let controller: DigitalProductsEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [DigitalProductsEngineController],
        providers: [DigitalProductsEngineService],
      }).compile();

    controller =
      module.get<DigitalProductsEngineController>(
        DigitalProductsEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create a monetization record', () => {
    const record = controller.createRecord({
      title: 'Controller Revenue',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
