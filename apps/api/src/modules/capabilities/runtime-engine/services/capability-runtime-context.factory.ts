import { randomUUID } from 'node:crypto';

import type {
  CapabilityMetadata,
} from '../../contracts';
import type {
  CapabilityConfigurationReader,
  CapabilityEventPublisher,
  CapabilityExecutionContext,
  CapabilityLogger,
  CapabilityServiceResolver,
} from '../../interfaces';

class RuntimeConfigurationReader
  implements CapabilityConfigurationReader
{
  constructor(
    private readonly values:
      Readonly<Record<string, unknown>> = {},
  ) {}

  get<TValue = unknown>(
    key: string,
  ): TValue | undefined {
    return this.values[key] as TValue | undefined;
  }

  require<TValue = unknown>(
    key: string,
  ): TValue {
    const value = this.get<TValue>(key);

    if (value === undefined) {
      throw new Error(
        `Required capability configuration "${key}" was not found.`,
      );
    }

    return value;
  }
}

class RuntimeServiceResolver
  implements CapabilityServiceResolver
{
  constructor(
    private readonly services =
      new Map<string | symbol, unknown>(),
  ) {}

  resolve<TService>(
    token: string | symbol,
  ): TService {
    const service = this.services.get(token);

    if (service === undefined) {
      throw new Error(
        `Capability runtime service "${String(token)}" was not found.`,
      );
    }

    return service as TService;
  }

  resolveOptional<TService>(
    token: string | symbol,
  ): TService | undefined {
    return this.services.get(token) as
      | TService
      | undefined;
  }
}

export interface CreateRuntimeContextInput {
  readonly capabilityId: string;
  readonly version: string;
  readonly correlationId?: string;
  readonly logger: CapabilityLogger;
  readonly events: CapabilityEventPublisher;
  readonly configuration?: Readonly<Record<string, unknown>>;
  readonly services?: ReadonlyMap<string | symbol, unknown>;
  readonly metadata?: CapabilityMetadata;
}

export class CapabilityRuntimeContextFactory {
  create(
    input: CreateRuntimeContextInput,
  ): CapabilityExecutionContext {
    return {
      capabilityId: input.capabilityId,
      version: input.version,
      instanceId: randomUUID(),
      correlationId:
        input.correlationId ?? randomUUID(),
      logger: input.logger,
      events: input.events,
      configuration:
        new RuntimeConfigurationReader(
          input.configuration,
        ),
      services:
        new RuntimeServiceResolver(
          new Map(input.services),
        ),
      metadata: input.metadata,
    };
  }
}