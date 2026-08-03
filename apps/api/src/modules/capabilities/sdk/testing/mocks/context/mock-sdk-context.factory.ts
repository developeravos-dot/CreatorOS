import type {
  CapabilityMetadata,
} from '../../../../contracts';
import type {
  CapabilitySdkContext,
  CapabilitySdkContextScope,
} from '../../../contracts';
import {
  DefaultCapabilitySdkContext,
  SdkContextState,
} from '../../../context';
import {
  FakeSdkClock,
} from '../clock';
import {
  MockSdkConfigurationReader,
} from '../configuration';
import {
  MockSdkEventPublisher,
} from '../events';
import {
  DeterministicSdkIdGenerator,
} from '../ids';
import {
  MockSdkLogger,
} from '../logging';
import {
  MockSdkServiceContainer,
} from '../services';
export interface CreateMockSdkContextInput {
  readonly capabilityId?: string;
  readonly capabilityVersion?: string;
  readonly instanceId?: string;
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly scope?: CapabilitySdkContextScope;
  readonly configuration?:
    Readonly<Record<string, unknown>>;
  readonly services?:
    ReadonlyMap<string | symbol, unknown>;
  readonly state?:
    Readonly<Record<string, unknown>>;
  readonly metadata?: CapabilityMetadata;
  readonly clock?: FakeSdkClock;
  readonly ids?:
    DeterministicSdkIdGenerator;
  readonly logger?: MockSdkLogger;
  readonly events?:
    MockSdkEventPublisher;
}

export interface MockSdkContextFixture {
  readonly context: CapabilitySdkContext;
  readonly clock: FakeSdkClock;
  readonly ids:
    DeterministicSdkIdGenerator;
  readonly logger: MockSdkLogger;
  readonly events:
    MockSdkEventPublisher;
  readonly configuration:
    MockSdkConfigurationReader;
  readonly services:
    MockSdkServiceContainer;
  readonly state:
    SdkContextState;
}

export class MockSdkContextFactory {
  create(
    input:
      CreateMockSdkContextInput = {},
  ): MockSdkContextFixture {
    const clock =
      input.clock ??
      new FakeSdkClock();

    const ids =
      input.ids ??
      new DeterministicSdkIdGenerator();

    const logger =
      input.logger ??
      new MockSdkLogger();

    const events =
      input.events ??
      new MockSdkEventPublisher();

    const configuration =
      new MockSdkConfigurationReader(
        input.configuration,
      );

    const services =
      new MockSdkServiceContainer(
        input.services,
      );

    const state =
      new SdkContextState(
        input.state,
      );

    const capabilityId =
      input.capabilityId ??
      'creatoros.capability.mock-test';

    const capabilityVersion =
      input.capabilityVersion ??
      '1.0.0';

    const contextId =
      ids.generate();

    const instanceId =
      input.instanceId ??
      ids.generate();

    const correlationId =
      input.correlationId ??
      ids.generate();

    const context =
      new DefaultCapabilitySdkContext(
        {
          contextId,
          capabilityId,
          capabilityVersion,
          instanceId,
          correlationId,
          actorId: input.actorId,
          scope: input.scope ?? 'test',
        },
        logger,
        events,
        configuration,
        services,
        state,
        clock,
        ids,
        input.metadata,
      );

    return Object.freeze({
      context,
      clock,
      ids,
      logger,
      events,
      configuration,
      services,
      state,
    });
  }
}