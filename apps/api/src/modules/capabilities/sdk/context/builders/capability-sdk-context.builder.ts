import type {
  CapabilityMetadata,
} from '../../../contracts';
import type {
  CapabilityEventPublisher,
  CapabilityLogger,
} from '../../../interfaces';
import type {
  CapabilitySdkContext,
  CapabilitySdkContextScope,
  CreateCapabilitySdkContextInput,
} from '../../contracts';
import {
  CapabilitySdkContextFactory,
} from '../factory';

export class CapabilitySdkContextBuilder {
  private readonly input:
    Partial<CreateCapabilitySdkContextInput> = {};

  capability(
    capabilityId: string,
    capabilityVersion: string,
  ): this {
    this.input.capabilityId = capabilityId;
    this.input.capabilityVersion =
      capabilityVersion;

    return this;
  }

  instance(instanceId: string): this {
    this.input.instanceId = instanceId;
    return this;
  }

  correlation(
    correlationId: string,
  ): this {
    this.input.correlationId =
      correlationId;

    return this;
  }

  actor(actorId: string): this {
    this.input.actorId = actorId;
    return this;
  }

  scope(
    scope: CapabilitySdkContextScope,
  ): this {
    this.input.scope = scope;
    return this;
  }

  logger(
    logger: CapabilityLogger,
  ): this {
    this.input.logger = logger;
    return this;
  }

  events(
    events: CapabilityEventPublisher,
  ): this {
    this.input.events = events;
    return this;
  }

  configuration(
    configuration:
      Readonly<Record<string, unknown>>,
  ): this {
    this.input.configuration =
      configuration;

    return this;
  }

  services(
    services:
      ReadonlyMap<string | symbol, unknown>,
  ): this {
    this.input.services = services;
    return this;
  }

  state(
    state:
      Readonly<Record<string, unknown>>,
  ): this {
    this.input.state = state;
    return this;
  }

  metadata(
    metadata: CapabilityMetadata,
  ): this {
    this.input.metadata = metadata;
    return this;
  }

  build(): CapabilitySdkContext {
    if (!this.input.capabilityId) {
      throw new Error(
        'SDK context capability id is required.',
      );
    }

    if (!this.input.capabilityVersion) {
      throw new Error(
        'SDK context capability version is required.',
      );
    }

    return new CapabilitySdkContextFactory().create({
      capabilityId:
        this.input.capabilityId,
      capabilityVersion:
        this.input.capabilityVersion,
      instanceId:
        this.input.instanceId,
      correlationId:
        this.input.correlationId,
      actorId:
        this.input.actorId,
      scope: this.input.scope,
      logger: this.input.logger,
      events: this.input.events,
      configuration:
        this.input.configuration,
      services: this.input.services,
      state: this.input.state,
      metadata: this.input.metadata,
    });
  }
}