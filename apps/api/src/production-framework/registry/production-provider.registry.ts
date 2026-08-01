import { Injectable } from '@nestjs/common';
import { ProductionProvider } from '../contracts/production-provider.interface';

@Injectable()
export class ProductionProviderRegistry {
  private readonly providers = new Map<string, ProductionProvider>();

  register(provider: ProductionProvider): void {
    const name = this.normalize(provider.name);
    if (!name) throw new Error('Production provider name is required.');
    this.providers.set(name, provider);
  }

  unregister(name: string): void {
    this.providers.delete(this.normalize(name));
  }

  get(name: string): ProductionProvider | undefined {
    return this.providers.get(this.normalize(name));
  }

  require(name: string): ProductionProvider {
    const provider = this.get(name);
    if (!provider) throw new Error(`Production provider "${name}" is not registered.`);
    return provider;
  }

  list(): ProductionProvider[] {
    return [...this.providers.values()];
  }

  private normalize(value: string): string {
    return String(value ?? '').trim().toLowerCase();
  }
}
