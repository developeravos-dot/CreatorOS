import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AudienceIntelligenceController,
} from './audience-intelligence.controller';

import {
  AudienceIntelligenceService,
} from './audience-intelligence.service';

describe('AudienceIntelligenceController', () => {
  let controller: AudienceIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AudienceIntelligenceController],
        providers: [AudienceIntelligenceService],
      }).compile();

    controller =
      module.get<AudienceIntelligenceController>(
        AudienceIntelligenceController,
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

  it('should create an audience record', () => {
    const record = controller.createRecord({
      name: 'Controller Audience',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
