import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MonetizationIpExpansionStageController,
} from './monetization-ip-expansion-stage.controller';

import {
  MonetizationIpExpansionStageService,
} from './monetization-ip-expansion-stage.service';

describe('MonetizationIpExpansionStageController', () => {
  let controller: MonetizationIpExpansionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MonetizationIpExpansionStageController,
        ],
        providers: [
          MonetizationIpExpansionStageService,
        ],
      }).compile();

    controller =
      module.get<MonetizationIpExpansionStageController>(
        MonetizationIpExpansionStageController,
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
