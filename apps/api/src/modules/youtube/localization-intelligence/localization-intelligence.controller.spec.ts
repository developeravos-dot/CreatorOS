import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  LocalizationIntelligenceController,
} from './localization-intelligence.controller';

import {
  LocalizationIntelligenceService,
} from './localization-intelligence.service';

describe('LocalizationIntelligenceController', () => {
  let controller: LocalizationIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [LocalizationIntelligenceController],
        providers: [LocalizationIntelligenceService],
      }).compile();

    controller =
      module.get<LocalizationIntelligenceController>(
        LocalizationIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
