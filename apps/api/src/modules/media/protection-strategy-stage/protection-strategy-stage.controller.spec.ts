import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ProtectionStrategyStageController,
} from './protection-strategy-stage.controller';

import {
  ProtectionStrategyStageService,
} from './protection-strategy-stage.service';

describe('ProtectionStrategyStageController', () => {
  let controller: ProtectionStrategyStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ProtectionStrategyStageController,
        ],
        providers: [
          ProtectionStrategyStageService,
        ],
      }).compile();

    controller =
      module.get<ProtectionStrategyStageController>(
        ProtectionStrategyStageController,
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
