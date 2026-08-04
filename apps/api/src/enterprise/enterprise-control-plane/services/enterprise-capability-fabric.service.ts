import { Injectable } from '@nestjs/common';

export interface EnterpriseCapabilityProvider {
  readonly capabilityId: string;
  readonly providerId: string;
  readonly operation: string;
  readonly priority: number;
  readonly enabled: boolean;
}

@Injectable()
export class EnterpriseCapabilityFabricService {
  private readonly providers: EnterpriseCapabilityProvider[] = [];

  register(provider: EnterpriseCapabilityProvider): EnterpriseCapabilityProvider {
    const normalized = {
      ...provider,
      capabilityId: provider.capabilityId.trim(),
      providerId: provider.providerId.trim(),
      operation: provider.operation.trim(),
    };
    if (!normalized.capabilityId || !normalized.providerId || !normalized.operation || this.providers.some((item) => item.capabilityId === normalized.capabilityId && item.providerId === normalized.providerId && item.operation === normalized.operation)) {
      throw new Error('Valid unique capability provider is required.');
    }
    this.providers.push(normalized);
    return { ...normalized };
  }

  resolve(capabilityId: string, operation: string): EnterpriseCapabilityProvider {
    const provider = this.providers
      .filter((item) => item.enabled && item.capabilityId === capabilityId.trim() && item.operation === operation.trim())
      .sort((left, right) => right.priority - left.priority || left.providerId.localeCompare(right.providerId))[0];
    if (!provider) throw new Error('No enabled capability provider was found.');
    return { ...provider };
  }

  list(): readonly EnterpriseCapabilityProvider[] {
    return this.providers.map((provider) => ({ ...provider }));
  }
}
