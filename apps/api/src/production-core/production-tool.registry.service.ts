import { Injectable } from '@nestjs/common';
import { ProductionToolAdapter } from './production-tool.adapter';

@Injectable()
export class ProductionToolRegistryService {
  private readonly tools = new Map<string, ProductionToolAdapter>();

  register(tool: ProductionToolAdapter): void {
    this.tools.set(tool.id.toLowerCase(), tool);
  }

  get(toolId: string): ProductionToolAdapter | undefined {
    return this.tools.get(toolId.trim().toLowerCase());
  }

  list(): ProductionToolAdapter[] {
    return [...this.tools.values()];
  }
}