import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpClassificationStageController,
} from './ip-classification-stage.controller';

import {
  IpClassificationStageService,
} from './ip-classification-stage.service';

describe('IpClassificationStageController', () => {
  let controller: IpClassificationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpClassificationStageController,
        ],
        providers: [
          IpClassificationStageService,
        ],
      }).compile();

    controller =
      module.get<IpClassificationStageController>(
        IpClassificationStageController,
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
