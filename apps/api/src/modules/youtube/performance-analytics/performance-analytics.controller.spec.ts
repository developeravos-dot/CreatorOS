import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PerformanceAnalyticsController,
} from './performance-analytics.controller';

import {
  PerformanceAnalyticsService,
} from './performance-analytics.service';

describe('PerformanceAnalyticsController', () => {
  let controller: PerformanceAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PerformanceAnalyticsController],
        providers: [PerformanceAnalyticsService],
      }).compile();

    controller =
      module.get<PerformanceAnalyticsController>(
        PerformanceAnalyticsController,
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

  it('should create a record', () => {
    const record = controller.createRecord({
      title: 'Controller Operation',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
