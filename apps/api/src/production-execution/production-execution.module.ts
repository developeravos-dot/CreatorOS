import { Module } from '@nestjs/common';
import { ProductionCoreModule } from '../production-core/production-core.module';
import { AssetManagerService } from './asset-manager.service';
import { CostManagerService } from './cost-manager.service';
import { ExecutionMonitorService } from './execution-monitor.service';
import { ProductionExecutionController } from './production-execution.controller';
import { ProductionExecutionService } from './production-execution.service';
import { QualityGateService } from './quality-gate.service';
import { WorkflowRepositoryService } from './workflow-repository.service';

@Module({
  imports: [ProductionCoreModule],
  controllers: [ProductionExecutionController],
  providers: [
    WorkflowRepositoryService,
    AssetManagerService,
    CostManagerService,
    QualityGateService,
    ExecutionMonitorService,
    ProductionExecutionService,
  ],
  exports: [
    WorkflowRepositoryService,
    AssetManagerService,
    CostManagerService,
    QualityGateService,
    ExecutionMonitorService,
    ProductionExecutionService,
  ],
})
export class ProductionExecutionModule {}