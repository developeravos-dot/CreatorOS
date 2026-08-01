import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CommerceProductExpansionStageController,
} from './commerce-product-expansion-stage.controller';

import {
  CommerceProductExpansionStageService,
} from './commerce-product-expansion-stage.service';

describe('CommerceProductExpansionStageController', () => {
  let controller: CommerceProductExpansionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          CommerceProductExpansionStageController,
        ],
        providers: [
          CommerceProductExpansionStageService,
        ],
      }).compile();

    controller =
      module.get<CommerceProductExpansionStageController>(
        CommerceProductExpansionStageController,
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
