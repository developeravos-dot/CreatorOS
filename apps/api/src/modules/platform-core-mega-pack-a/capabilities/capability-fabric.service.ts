import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CapabilityDefinition,
  PlatformDependencyGraph,
} from '../platform-core.types';

@Injectable()
export class CapabilityFabricService {
  private readonly capabilities = new Map<
    string,
    CapabilityDefinition
  >();

  register(
    input: Omit<
      CapabilityDefinition,
      'id' | 'state'
    >,
  ): CapabilityDefinition {
    if (this.capabilities.has(input.key)) {
      throw new Error(
        `Capability already exists: ${input.key}`,
      );
    }

    const capability: CapabilityDefinition = {
      ...input,
      id: randomUUID(),
      state: 'registered',
    };

    this.capabilities.set(
      capability.key,
      capability,
    );

    return capability;
  }

  activate(key: string) {
    const capability = this.get(key);

    for (const dependency of capability.dependencies) {
      const item = this.capabilities.get(dependency);

      if (!item || item.state !== 'active') {
        throw new Error(
          `Dependency is not active: ${dependency}`,
        );
      }
    }

    capability.state = 'active';
    return capability;
  }

  disable(key: string) {
    const capability = this.get(key);
    capability.state = 'disabled';
    return capability;
  }

  markDegraded(key: string) {
    const capability = this.get(key);
    capability.state = 'degraded';
    return capability;
  }

  list() {
    return [...this.capabilities.values()];
  }

  get(key: string) {
    const capability = this.capabilities.get(key);

    if (!capability) {
      throw new Error(
        `Capability not found: ${key}`,
      );
    }

    return capability;
  }

  graph(): PlatformDependencyGraph {
    const list = this.list();

    return {
      nodes: list.map((item) => ({
        key: item.key,
        state: item.state,
      })),
      edges: list.flatMap((item) =>
        item.dependencies.map((dependency) => ({
          from: dependency,
          to: item.key,
        })),
      ),
    };
  }
}