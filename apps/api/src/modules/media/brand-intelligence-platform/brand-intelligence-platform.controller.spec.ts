import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  BrandIntelligencePlatformController,
} from './brand-intelligence-platform.controller';

import {
  BrandIntelligencePlatformService,
} from './brand-intelligence-platform.service';

describe('BrandIntelligencePlatformController', () => {
  let controller: BrandIntelligencePlatformController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          BrandIntelligencePlatformController,
        ],
        providers: [
          BrandIntelligencePlatformService,
        ],
      }).compile();

    controller =
      module.get<BrandIntelligencePlatformController>(
        BrandIntelligencePlatformController,
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
