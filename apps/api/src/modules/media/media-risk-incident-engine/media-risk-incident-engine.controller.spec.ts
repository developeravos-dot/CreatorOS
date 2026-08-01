import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaRiskIncidentEngineController,
} from './media-risk-incident-engine.controller';

import {
  MediaRiskIncidentEngineService,
} from './media-risk-incident-engine.service';

describe('MediaRiskIncidentEngineController', () => {
  let controller: MediaRiskIncidentEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MediaRiskIncidentEngineController,
        ],
        providers: [
          MediaRiskIncidentEngineService,
        ],
      }).compile();

    controller =
      module.get<MediaRiskIncidentEngineController>(
        MediaRiskIncidentEngineController,
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
