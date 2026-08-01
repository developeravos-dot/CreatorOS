import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MonetizationDashboardController,
} from './monetization-dashboard.controller';

import {
  MonetizationDashboardService,
} from './monetization-dashboard.service';

describe('MonetizationDashboardController', () => {
  let controller: MonetizationDashboardController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [MonetizationDashboardController],
        providers: [MonetizationDashboardService],
      }).compile();

    controller =
      module.get<MonetizationDashboardController>(
        MonetizationDashboardController,
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

  it('should create a monetization record', () => {
    const record = controller.createRecord({
      title: 'Controller Revenue',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
