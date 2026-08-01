import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  IpFamilyTreeEngineController,
} from './ip-family-tree-engine.controller';

import {
  IpFamilyTreeEngineService,
} from './ip-family-tree-engine.service';

describe('IpFamilyTreeEngineController', () => {
  let controller: IpFamilyTreeEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          IpFamilyTreeEngineController,
        ],
        providers: [
          IpFamilyTreeEngineService,
        ],
      }).compile();

    controller =
      module.get<IpFamilyTreeEngineController>(
        IpFamilyTreeEngineController,
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
