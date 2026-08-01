import {
  ProductionCapability,
  ProductionCostTier,
  ProductionIntegrationMode,
  ProductionToolHealth,
} from './production-capability.contracts';
import { ProductionToolAdapter } from './production-tool.adapter';

export interface EnvironmentToolAdapterOptions {
  id: string;
  displayName: string;
  capabilities: ProductionCapability[];
  mode: ProductionIntegrationMode;
  costTier: ProductionCostTier;
  qualityScore: number;
  enabledEnv?: string;
  configuredEnv?: string;
  enabledByDefault?: boolean;
  configuredByDefault?: boolean;
}

export class EnvironmentToolAdapter implements ProductionToolAdapter {
  readonly id: string;
  readonly displayName: string;

  constructor(private readonly options: EnvironmentToolAdapterOptions) {
    this.id = options.id;
    this.displayName = options.displayName;
  }

  supports(capability: ProductionCapability): boolean {
    return this.options.capabilities.includes(capability);
  }

  async healthCheck(): Promise<ProductionToolHealth> {
    const enabled = this.resolveBoolean(
      this.options.enabledEnv,
      this.options.enabledByDefault ?? false,
    );

    const configured = this.options.configuredEnv
      ? Boolean(process.env[this.options.configuredEnv]?.trim())
      : this.resolveBoolean(
          this.options.enabledEnv,
          this.options.configuredByDefault ?? enabled,
        );

    const available = enabled && configured;

    return {
      id: this.id,
      displayName: this.displayName,
      enabled,
      configured,
      available,
      mode: this.options.mode,
      costTier: this.options.costTier,
      qualityScore: this.options.qualityScore,
      capabilities: this.options.capabilities,
      reason: available
        ? undefined
        : !enabled
          ? `${this.options.enabledEnv ?? this.id} is disabled.`
          : `${this.options.configuredEnv ?? this.options.enabledEnv ?? this.id} is not configured.`,
    };
  }

  private resolveBoolean(name: string | undefined, fallback: boolean): boolean {
    if (!name) {
      return fallback;
    }

    const raw = process.env[name]?.trim().toLowerCase();
    if (!raw) {
      return fallback;
    }

    return !['0', 'false', 'no', 'off', 'disabled'].includes(raw);
  }
}