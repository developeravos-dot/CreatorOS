import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentTrustSafetyEngineController,
} from './content-trust-safety-engine.controller';

import {
  ContentTrustSafetyEngineService,
} from './content-trust-safety-engine.service';

describe('ContentTrustSafetyEngineController', () => {
  let controller: ContentTrustSafetyEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ContentTrustSafetyEngineController,
        ],
        providers: [
          ContentTrustSafetyEngineService,
        ],
      }).compile();

    controller =
      module.get<ContentTrustSafetyEngineController>(
        ContentTrustSafetyEngineController,
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
