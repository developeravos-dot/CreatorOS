import { Module } from '@nestjs/common';
import { ProductionStrategyStageController } from './production-strategy-stage.controller';
import { ProductionStrategyStageService } from './production-strategy-stage.service';

@Module({
  controllers: [ProductionStrategyStageController],
  providers: [ProductionStrategyStageService],
  exports: [ProductionStrategyStageService],
})
export class ProductionStrategyStageModule {}
