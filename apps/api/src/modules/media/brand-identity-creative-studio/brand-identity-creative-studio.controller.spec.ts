import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  BrandIdentityCreativeStudioController,
} from './brand-identity-creative-studio.controller';

import {
  BrandIdentityCreativeStudioService,
} from './brand-identity-creative-studio.service';

describe('BrandIdentityCreativeStudioController', () => {
  let controller: BrandIdentityCreativeStudioController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          BrandIdentityCreativeStudioController,
        ],
        providers: [
          BrandIdentityCreativeStudioService,
        ],
      }).compile();

    controller =
      module.get<BrandIdentityCreativeStudioController>(
        BrandIdentityCreativeStudioController,
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
