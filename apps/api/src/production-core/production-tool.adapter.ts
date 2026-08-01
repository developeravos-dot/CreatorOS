import {
  ProductionCapability,
  ProductionToolHealth,
} from './production-capability.contracts';

export interface ProductionToolAdapter {
  readonly id: string;
  readonly displayName: string;

  supports(capability: ProductionCapability): boolean;
  healthCheck(): Promise<ProductionToolHealth>;
}