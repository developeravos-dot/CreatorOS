import { Module } from '@nestjs/common';
import { ProductionCouncilStageController } from './production-council-stage.controller';
import { ProductionCouncilStageService } from './production-council-stage.service';

@Module({
  controllers: [ProductionCouncilStageController],
  providers: [ProductionCouncilStageService],
  exports: [ProductionCouncilStageService],
})
export class ProductionCouncilStageModule {}
