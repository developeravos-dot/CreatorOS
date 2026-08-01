import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AudienceCulturalIntelligenceController,
} from './audience-cultural-intelligence.controller';

import {
  AudienceCulturalIntelligenceService,
} from './audience-cultural-intelligence.service';

describe('AudienceCulturalIntelligenceController', () => {
  let controller: AudienceCulturalIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AudienceCulturalIntelligenceController,
        ],
        providers: [
          AudienceCulturalIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<AudienceCulturalIntelligenceController>(
        AudienceCulturalIntelligenceController,
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
