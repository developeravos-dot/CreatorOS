import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpProductizationStageController,
} from './ip-productization-stage.controller';

import {
  IpProductizationStageService,
} from './ip-productization-stage.service';

describe('IpProductizationStageController', () => {
  let controller: IpProductizationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpProductizationStageController,
        ],
        providers: [
          IpProductizationStageService,
        ],
      }).compile();

    controller =
      module.get<IpProductizationStageController>(
        IpProductizationStageController,
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

  it('should expose 24-stage blueprint', () => {
    expect(
      controller.getBlueprint().stages,
    ).toHaveLength(24);
  });
});
