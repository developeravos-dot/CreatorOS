import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  FranchiseExpansionEngineController,
} from './franchise-expansion-engine.controller';

import {
  FranchiseExpansionEngineService,
} from './franchise-expansion-engine.service';

describe('FranchiseExpansionEngineController', () => {
  let controller: FranchiseExpansionEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          FranchiseExpansionEngineController,
        ],
        providers: [
          FranchiseExpansionEngineService,
        ],
      }).compile();

    controller =
      module.get<FranchiseExpansionEngineController>(
        FranchiseExpansionEngineController,
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
