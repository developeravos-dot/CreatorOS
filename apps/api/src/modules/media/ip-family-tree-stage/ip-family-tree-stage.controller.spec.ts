import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpFamilyTreeStageController,
} from './ip-family-tree-stage.controller';

import {
  IpFamilyTreeStageService,
} from './ip-family-tree-stage.service';

describe('IpFamilyTreeStageController', () => {
  let controller: IpFamilyTreeStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpFamilyTreeStageController,
        ],
        providers: [
          IpFamilyTreeStageService,
        ],
      }).compile();

    controller =
      module.get<IpFamilyTreeStageController>(
        IpFamilyTreeStageController,
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
