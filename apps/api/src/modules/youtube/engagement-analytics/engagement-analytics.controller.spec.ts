import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  EngagementAnalyticsController,
} from './engagement-analytics.controller';

import {
  EngagementAnalyticsService,
} from './engagement-analytics.service';

describe('EngagementAnalyticsController', () => {
  let controller: EngagementAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [EngagementAnalyticsController],
        providers: [EngagementAnalyticsService],
      }).compile();

    controller =
      module.get<EngagementAnalyticsController>(
        EngagementAnalyticsController,
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
