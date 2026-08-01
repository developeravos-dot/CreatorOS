import { Module } from '@nestjs/common';
import { RevenueAttributionStageController } from './revenue-attribution-stage.controller';
import { RevenueAttributionStageService } from './revenue-attribution-stage.service';

@Module({
  controllers: [RevenueAttributionStageController],
  providers: [RevenueAttributionStageService],
  exports: [RevenueAttributionStageService],
})
export class RevenueAttributionStageModule {}
