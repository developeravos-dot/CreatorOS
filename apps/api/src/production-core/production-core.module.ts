import { Module } from '@nestjs/common';
import { CostFirstPolicyService } from './cost-first-policy.service';
import { EnvironmentToolAdapter } from './environment-tool.adapter';
import { ProductionCoreController } from './production-core.controller';
import { ProductionRouterService } from './production-router.service';
import { PRODUCTION_TOOL_CATALOG } from './production-tool.catalog';
import { ProductionToolRegistryService } from './production-tool.registry.service';

const productionToolProviders = PRODUCTION_TOOL_CATALOG.map((definition) => ({
  provide: `PRODUCTION_TOOL_${definition.id}`,
  useFactory: (registry: ProductionToolRegistryService) => {
    const adapter = new EnvironmentToolAdapter(definition);
    registry.register(adapter);
    return adapter;
  },
  inject: [ProductionToolRegistryService],
}));

@Module({
  controllers: [ProductionCoreController],
  providers: [
    ProductionToolRegistryService,
    CostFirstPolicyService,
    ProductionRouterService,
    ...productionToolProviders,
  ],
  exports: [
    ProductionToolRegistryService,
    CostFirstPolicyService,
    ProductionRouterService,
  ],
})
export class ProductionCoreModule {}