import { Module } from '@nestjs/common';
import { RevenueStreamDesignStageController } from './revenue-stream-design-stage.controller';
import { RevenueStreamDesignStageService } from './revenue-stream-design-stage.service';

@Module({
  controllers: [RevenueStreamDesignStageController],
  providers: [RevenueStreamDesignStageService],
  exports: [RevenueStreamDesignStageService],
})
export class RevenueStreamDesignStageModule {}
