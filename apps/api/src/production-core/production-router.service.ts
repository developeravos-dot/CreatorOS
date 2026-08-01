import { Injectable } from '@nestjs/common';
import {
  ProductionCapability,
  ProductionPlanRequest,
  ProductionSelectionResult,
  ProductionToolHealth,
} from './production-capability.contracts';
import { CostFirstPolicyService } from './cost-first-policy.service';
import { ProductionToolRegistryService } from './production-tool.registry.service';

const DEFAULT_PIPELINE: ProductionCapability[] = [
  'idea-generation',
  'research',
  'script-generation',
  'video-generation',
  'thumbnail-generation',
  'voice-generation',
  'music-generation',
  'video-editing',
  'publishing-youtube',
  'publishing-tiktok',
  'analytics-youtube',
  'analytics-tiktok',
];

@Injectable()
export class ProductionRouterService {
  constructor(
    private readonly registry: ProductionToolRegistryService,
    private readonly policy: CostFirstPolicyService,
  ) {}

  async status() {
    const tools = await this.health();

    return {
      success: true,
      architecture: 'Cost-First Capability-Based Production Architecture',
      policy: {
        default: 'lowest-cost-available-tool',
        paidToolsRequiredAtLaunch: false,
        replaceableAdapters: true,
        optionalIntegrations: true,
      },
      pipeline: DEFAULT_PIPELINE,
      tools,
    };
  }

  async health(): Promise<ProductionToolHealth[]> {
    return Promise.all(
      this.registry.list().map((tool) => tool.healthCheck()),
    );
  }

  async plan(request: ProductionPlanRequest = {}) {
    const tools = await this.health();
    const capabilities = request.capabilities?.length
      ? request.capabilities
      : DEFAULT_PIPELINE;

    const selections: ProductionSelectionResult[] = capabilities.map(
      (capability) =>
        this.policy.select(
          {
            capability,
            allowPaid: request.allowPaid ?? false,
            minimumQuality: request.minimumQuality,
            preferredToolId: request.preferredTools?.[capability],
          },
          tools,
        ),
    );

    return {
      success: true,
      strategy: 'cost-first',
      paidToolsAllowed: request.allowPaid ?? false,
      selections,
      ready: selections.every((item) => item.selectedTool !== null),
    };
  }
}