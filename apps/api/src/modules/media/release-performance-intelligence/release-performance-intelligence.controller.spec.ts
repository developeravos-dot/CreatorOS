import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ReleasePerformanceIntelligenceController,
} from './release-performance-intelligence.controller';

import {
  ReleasePerformanceIntelligenceService,
} from './release-performance-intelligence.service';

describe('ReleasePerformanceIntelligenceController', () => {
  let controller: ReleasePerformanceIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ReleasePerformanceIntelligenceController,
        ],
        providers: [
          ReleasePerformanceIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<ReleasePerformanceIntelligenceController>(
        ReleasePerformanceIntelligenceController,
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
