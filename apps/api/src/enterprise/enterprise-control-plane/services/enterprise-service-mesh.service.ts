import { Injectable } from '@nestjs/common';

export interface EnterpriseServiceEndpoint {
  readonly endpointId: string;
  readonly serviceId: string;
  readonly region: string;
  readonly priority: number;
  readonly healthy: boolean;
  readonly activeRequests: number;
}

@Injectable()
export class EnterpriseServiceMeshService {
  private readonly endpoints = new Map<string, EnterpriseServiceEndpoint>();

  register(input: Omit<EnterpriseServiceEndpoint, 'healthy' | 'activeRequests'>): EnterpriseServiceEndpoint {
    const endpointId = input.endpointId.trim();
    if (!endpointId || !input.serviceId.trim() || !input.region.trim() || this.endpoints.has(endpointId)) throw new Error('Valid unique service endpoint is required.');
    const endpoint: EnterpriseServiceEndpoint = { ...input, endpointId, serviceId: input.serviceId.trim(), region: input.region.trim(), healthy: true, activeRequests: 0 };
    this.endpoints.set(endpointId, endpoint);
    return { ...endpoint };
  }

  route(serviceId: string, preferredRegion?: string): EnterpriseServiceEndpoint {
    const endpoint = [...this.endpoints.values()]
      .filter((item) => item.healthy && item.serviceId === serviceId.trim())
      .sort((left, right) => Number(right.region === preferredRegion) - Number(left.region === preferredRegion) || left.activeRequests - right.activeRequests || right.priority - left.priority || left.endpointId.localeCompare(right.endpointId))[0];
    if (!endpoint) throw new Error('No healthy service endpoint is available.');
    const updated = { ...endpoint, activeRequests: endpoint.activeRequests + 1 };
    this.endpoints.set(endpoint.endpointId, updated);
    return { ...updated };
  }

  release(endpointId: string): void {
    const endpoint = this.endpoints.get(endpointId.trim());
    if (!endpoint) return;
    this.endpoints.set(endpoint.endpointId, { ...endpoint, activeRequests: Math.max(0, endpoint.activeRequests - 1) });
  }

  setHealth(endpointId: string, healthy: boolean): EnterpriseServiceEndpoint {
    const endpoint = this.endpoints.get(endpointId.trim());
    if (!endpoint) throw new Error('Service endpoint was not found.');
    const updated = { ...endpoint, healthy };
    this.endpoints.set(endpoint.endpointId, updated);
    return { ...updated };
  }

  list(): readonly EnterpriseServiceEndpoint[] {
    return [...this.endpoints.values()].map((endpoint) => ({ ...endpoint }));
  }
}
