import { Injectable } from '@nestjs/common';

import type {
  CapabilityRuntime,
} from '../../contracts';
import type {
  CapabilityRuntimeAdapter,
} from '../contracts';
import {
  CapabilityRuntimeAdapterNotFoundError,
} from '../errors/capability-runtime.errors';

@Injectable()
export class CapabilityRuntimeAdapterRegistryService {
  private readonly adapters =
    new Map<
      CapabilityRuntime,
      CapabilityRuntimeAdapter
    >();

  register(
    adapter: CapabilityRuntimeAdapter,
  ): void {
    this.adapters.set(adapter.runtime, adapter);
  }

  unregister(
    runtime: CapabilityRuntime,
  ): boolean {
    return this.adapters.delete(runtime);
  }

  has(
    runtime: CapabilityRuntime,
  ): boolean {
    return this.adapters.has(runtime);
  }

  resolve(
    runtime: CapabilityRuntime,
  ): CapabilityRuntimeAdapter {
    const adapter = this.adapters.get(runtime);

    if (!adapter) {
      throw new CapabilityRuntimeAdapterNotFoundError(
        runtime,
      );
    }

    return adapter;
  }

  list(): readonly CapabilityRuntimeAdapter[] {
    return [...this.adapters.values()];
  }
}