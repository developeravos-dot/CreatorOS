import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  DigitalProductBusinessEngineController,
} from './digital-product-business-engine.controller';

import {
  DigitalProductBusinessEngineService,
} from './digital-product-business-engine.service';

describe('DigitalProductBusinessEngineController', () => {
  let controller: DigitalProductBusinessEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          DigitalProductBusinessEngineController,
        ],
        providers: [
          DigitalProductBusinessEngineService,
        ],
      }).compile();

    controller =
      module.get<DigitalProductBusinessEngineController>(
        DigitalProductBusinessEngineController,
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
