import 'reflect-metadata';

import {
  CapabilitySdkContextBuilder,
  CapabilitySdkContextFactory,
  DefaultCapabilitySdkContext,
  SdkConfigurationReader,
  SdkContextState,
  SdkEventPublisher,
  SdkServiceContainer,
} from './index';

describe('Capability SDK Context', () => {
  it('creates a complete SDK context', () => {
    const context =
      new CapabilitySdkContextFactory().create({
        capabilityId:
          'creatoros.capability.sdk-context',
        capabilityVersion: '1.0.0',
        configuration: {
          region: 'uae',
        },
        state: {
          executions: 0,
        },
      });

    expect(
      context.identity.capabilityId,
    ).toBe(
      'creatoros.capability.sdk-context',
    );

    expect(
      context.configuration.get('region'),
    ).toBe('uae');

    expect(
      context.state.get('executions'),
    ).toBe(0);

    expect(
      context.identity.contextId,
    ).toBeTruthy();
  });

  it('builds contexts using fluent builder API', () => {
    const context =
      new CapabilitySdkContextBuilder()
        .capability(
          'creatoros.capability.builder-test',
          '1.0.0',
        )
        .scope('test')
        .configuration({
          environment: 'test',
        })
        .state({
          active: true,
        })
        .build();

    expect(context.identity.scope).toBe(
      'test',
    );

    expect(
      context.configuration.get(
        'environment',
      ),
    ).toBe('test');

    expect(
      context.state.get('active'),
    ).toBe(true);
  });

  it('creates child operation contexts', () => {
    const parent =
      DefaultCapabilitySdkContext.createEmpty(
        'creatoros.capability.parent',
        '1.0.0',
      );

    const child = parent.createChild({
      scope: 'operation',
      correlationId:
        'correlation-test',
      state: {
        operation: 'execute',
      },
    });

    expect(
      child.identity.parentContextId,
    ).toBe(
      parent.identity.contextId,
    );

    expect(
      child.identity.correlationId,
    ).toBe('correlation-test');

    expect(
      child.state.get('operation'),
    ).toBe('execute');
  });

  it('stores and resolves SDK services', () => {
    const services =
      new SdkServiceContainer();

    const token =
      Symbol('test-service');

    services.register(token, {
      value: 42,
    });

    expect(
      services.resolve<{
        value: number;
      }>(token).value,
    ).toBe(42);

    expect(
      services.resolveOptional(
        'missing',
      ),
    ).toBeUndefined();
  });

  it('reads required configuration values', () => {
    const configuration =
      new SdkConfigurationReader({
        apiKey: 'secret',
      });

    expect(
      configuration.require('apiKey'),
    ).toBe('secret');

    expect(() =>
      configuration.require('missing'),
    ).toThrow(
      'Required SDK configuration',
    );
  });

  it('manages isolated SDK context state', () => {
    const state =
      new SdkContextState({
        count: 1,
      });

    state.set('count', 2);
    state.set('status', 'active');

    expect(state.require('count')).toBe(2);
    expect(state.has('status')).toBe(true);

    state.delete('status');

    expect(state.has('status')).toBe(false);
  });

  it('publishes and records SDK events', async () => {
    const publisher =
      new SdkEventPublisher();

    const handler = jest.fn();

    publisher.subscribe(handler);

    await publisher.publish({
      type: 'sdk.context.created',
      contextId: 'context-1',
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(
      publisher.getHistory(),
    ).toHaveLength(1);
  });
});