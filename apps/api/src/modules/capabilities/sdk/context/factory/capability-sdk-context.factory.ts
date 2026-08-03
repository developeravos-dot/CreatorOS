import type {
  CreateCapabilitySdkContextInput,
  CapabilitySdkContext,
} from '../../contracts';
import {
  SdkConfigurationReader,
} from '../configuration';
import {
  SdkEventPublisher,
} from '../events';
import {
  SdkContextLogger,
} from '../logging';
import {
  SdkServiceContainer,
} from '../services';
import {
  SdkContextState,
} from '../state';
import {
  DefaultCapabilitySdkContext,
} from '../sdk-context';
import {
  SdkClock,
} from './sdk-clock';
import {
  SdkIdGenerator,
} from './sdk-id-generator';

export class CapabilitySdkContextFactory {
  create(
    input: CreateCapabilitySdkContextInput,
  ): CapabilitySdkContext {
    const ids = new SdkIdGenerator();

    return new DefaultCapabilitySdkContext(
      {
        contextId: ids.generate(),
        capabilityId: input.capabilityId,
        capabilityVersion:
          input.capabilityVersion,
        instanceId:
          input.instanceId ??
          ids.generate(),
        correlationId:
          input.correlationId ??
          ids.generate(),
        actorId: input.actorId,
        scope:
          input.scope ?? 'capability',
      },
      input.logger ??
        new SdkContextLogger(
          input.capabilityId,
        ),
      input.events ??
        new SdkEventPublisher(),
      new SdkConfigurationReader(
        input.configuration,
      ),
      new SdkServiceContainer(
        input.services,
      ),
      new SdkContextState(
        input.state,
      ),
      new SdkClock(),
      ids,
      input.metadata,
    );
  }
}