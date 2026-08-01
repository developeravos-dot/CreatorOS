import { Injectable } from '@nestjs/common';

export type IntegrationDescriptor = {
  key: string;
  status: 'configured' | 'disabled';
  capabilities: string[];
};

@Injectable()
export class IntegrationRegistryService {
  private readonly integrations = new Map<string, IntegrationDescriptor>();

  register(descriptor: IntegrationDescriptor): void {
    this.integrations.set(descriptor.key, descriptor);
  }

  list(): IntegrationDescriptor[] {
    return [...this.integrations.values()];
  }

  get(key: string): IntegrationDescriptor | undefined {
    return this.integrations.get(key);
  }
}