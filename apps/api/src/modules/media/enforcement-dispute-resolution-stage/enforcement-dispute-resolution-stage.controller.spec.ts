import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  EnforcementDisputeResolutionStageController,
} from './enforcement-dispute-resolution-stage.controller';

import {
  EnforcementDisputeResolutionStageService,
} from './enforcement-dispute-resolution-stage.service';

describe('EnforcementDisputeResolutionStageController', () => {
  let controller: EnforcementDisputeResolutionStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          EnforcementDisputeResolutionStageController,
        ],
        providers: [
          EnforcementDisputeResolutionStageService,
        ],
      }).compile();

    controller =
      module.get<EnforcementDisputeResolutionStageController>(
        EnforcementDisputeResolutionStageController,
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
