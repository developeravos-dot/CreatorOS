import { Module } from '@nestjs/common';

import {
  MonetizationDashboardController,
} from './monetization-dashboard.controller';

import {
  MonetizationDashboardService,
} from './monetization-dashboard.service';

@Module({
  controllers: [MonetizationDashboardController],
  providers: [MonetizationDashboardService],
  exports: [MonetizationDashboardService],
})
export class MonetizationDashboardModule {}
