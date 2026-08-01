import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  EvidenceTimestampRegistrationStageController,
} from './evidence-timestamp-registration-stage.controller';

import {
  EvidenceTimestampRegistrationStageService,
} from './evidence-timestamp-registration-stage.service';

describe('EvidenceTimestampRegistrationStageController', () => {
  let controller: EvidenceTimestampRegistrationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          EvidenceTimestampRegistrationStageController,
        ],
        providers: [
          EvidenceTimestampRegistrationStageService,
        ],
      }).compile();

    controller =
      module.get<EvidenceTimestampRegistrationStageController>(
        EvidenceTimestampRegistrationStageController,
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
