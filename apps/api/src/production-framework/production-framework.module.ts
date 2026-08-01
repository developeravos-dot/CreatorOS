import { Module } from '@nestjs/common';
import { HailuoModule } from '../production-adapters/hailuo/hailuo.module';
import { ProductionFrameworkController } from './controllers/production-framework.controller';
import { ProductionOrchestratorService } from './orchestrator/production-orchestrator.service';
import { HailuoProductionProvider } from './providers/hailuo/hailuo-production.provider';
import { ProductionProviderRegistry } from './registry/production-provider.registry';

@Module({
  imports: [HailuoModule],
  controllers: [ProductionFrameworkController],
  providers: [
    ProductionProviderRegistry,
    ProductionOrchestratorService,
    HailuoProductionProvider,
  ],
  exports: [ProductionProviderRegistry, ProductionOrchestratorService],
})
export class ProductionFrameworkModule {}
