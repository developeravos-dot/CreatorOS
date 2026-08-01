import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentIntelligenceController,
} from './content-intelligence.controller';

import {
  ContentIntelligenceService,
} from './content-intelligence.service';

describe('ContentIntelligenceController', () => {
  let controller: ContentIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ContentIntelligenceController],
        providers: [ContentIntelligenceService],
      }).compile();

    controller =
      module.get<ContentIntelligenceController>(
        ContentIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
