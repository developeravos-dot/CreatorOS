import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AffiliateCommerceEngineController,
} from './affiliate-commerce-engine.controller';

import {
  AffiliateCommerceEngineService,
} from './affiliate-commerce-engine.service';

describe('AffiliateCommerceEngineController', () => {
  let controller: AffiliateCommerceEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AffiliateCommerceEngineController,
        ],
        providers: [
          AffiliateCommerceEngineService,
        ],
      }).compile();

    controller =
      module.get<AffiliateCommerceEngineController>(
        AffiliateCommerceEngineController,
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
