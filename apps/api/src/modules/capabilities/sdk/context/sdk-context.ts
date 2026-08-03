import type {
  CapabilityMetadata,
} from '../../contracts';
import type {
  CapabilityConfigurationReader,
  CapabilityEventPublisher,
  CapabilityLogger,
  CapabilityServiceResolver,
} from '../../interfaces';
import type {
  CapabilitySdkChildContextInput,
  CapabilitySdkClock,
  CapabilitySdkContext,
  CapabilitySdkContextIdentity,
  CapabilitySdkContextState,
  CapabilitySdkIdGenerator,
} from '../contracts';
import {
  SdkConfigurationReader,
} from './configuration';
import {
  SdkEventPublisher,
} from './events';
import {
  SdkIdGenerator,
} from './factory/sdk-id-generator';
import {
  SdkClock,
} from './factory/sdk-clock';
import {
  SdkContextLogger,
} from './logging';
import {
  SdkServiceContainer,
} from './services';
import {
  SdkContextState,
} from './state';

export class DefaultCapabilitySdkContext
  implements CapabilitySdkContext
{
  constructor(
    readonly identity:
      CapabilitySdkContextIdentity,
    readonly logger: CapabilityLogger,
    readonly events: CapabilityEventPublisher,
    readonly configuration:
      CapabilityConfigurationReader,
    readonly services:
      CapabilityServiceResolver,
    readonly state:
      CapabilitySdkContextState,
    readonly clock:
      CapabilitySdkClock,
    readonly ids:
      CapabilitySdkIdGenerator,
    readonly metadata?: CapabilityMetadata,
  ) {}

  createChild(
    input:
      CapabilitySdkChildContextInput = {},
  ): CapabilitySdkContext {
    const childServices =
      this.services instanceof SdkServiceContainer
        ? new Map(this.services.entries())
        : new Map<string | symbol, unknown>();

    if (input.services) {
      for (const [token, service] of input.services) {
        childServices.set(token, service);
      }
    }

    const parentConfiguration =
      this.configuration instanceof
      SdkConfigurationReader
        ? this.configuration.snapshot()
        : {};

    return new DefaultCapabilitySdkContext(
      {
        contextId: this.ids.generate(),
        parentContextId:
          this.identity.contextId,
        capabilityId:
          this.identity.capabilityId,
        capabilityVersion:
          this.identity.capabilityVersion,
        instanceId:
          this.identity.instanceId,
        correlationId:
          input.correlationId ??
          this.identity.correlationId,
        actorId:
          input.actorId ??
          this.identity.actorId,
        scope:
          input.scope ?? 'operation',
      },
      this.logger,
      this.events,
      new SdkConfigurationReader({
        ...parentConfiguration,
        ...(input.configuration ?? {}),
      }),
      new SdkServiceContainer(childServices),
      new SdkContextState(
        input.state ?? {},
      ),
      this.clock,
      this.ids,
      input.metadata ?? this.metadata,
    );
  }

  static createEmpty(
    capabilityId: string,
    capabilityVersion: string,
  ): DefaultCapabilitySdkContext {
    const ids = new SdkIdGenerator();
    const events = new SdkEventPublisher();

    return new DefaultCapabilitySdkContext(
      {
        contextId: ids.generate(),
        capabilityId,
        capabilityVersion,
        instanceId: ids.generate(),
        correlationId: ids.generate(),
        scope: 'capability',
      },
      new SdkContextLogger(capabilityId),
      events,
      new SdkConfigurationReader(),
      new SdkServiceContainer(),
      new SdkContextState(),
      new SdkClock(),
      ids,
    );
  }
}