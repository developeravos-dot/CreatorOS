import 'reflect-metadata';

import {
  DeterministicSdkIdGenerator,
  FakeSdkClock,
  MockSdkConfigurationReader,
  MockSdkContextFactory,
  MockSdkEventPublisher,
  MockSdkLogger,
  MockSdkServiceContainer,
} from './index';

describe('Capability SDK Mock Foundation', () => {
  it('controls time deterministically', () => {
    const clock = new FakeSdkClock(
      '2026-08-03T10:00:00.000Z',
    );

    clock.advanceMinutes(30);

    expect(clock.nowIso()).toBe(
      '2026-08-03T10:30:00.000Z',
    );

    clock.advanceHours(2);

    expect(clock.nowIso()).toBe(
      '2026-08-03T12:30:00.000Z',
    );
  });

  it('generates deterministic identifiers', () => {
    const ids =
      new DeterministicSdkIdGenerator(
        'creatoros-test',
      );

    expect(ids.generate()).toBe(
      'creatoros-test-0001',
    );

    expect(ids.generate()).toBe(
      'creatoros-test-0002',
    );

    ids.reset();

    expect(ids.generate()).toBe(
      'creatoros-test-0001',
    );
  });

  it('captures structured log entries', () => {
    const logger = new MockSdkLogger();

    logger.info('Capability started.', {
      capability: 'test',
    });

    logger.error(
      'Capability failed.',
      new Error('Failure'),
    );

    expect(logger.getEntries()).toHaveLength(2);
    expect(logger.getByLevel('error')).toHaveLength(
      1,
    );

    expect(
      logger.containsMessage('started'),
    ).toBe(true);
  });

  it('publishes, tracks and fails events', async () => {
    const publisher =
      new MockSdkEventPublisher();

    const handler = jest.fn();

    publisher.subscribe(handler);

    await publisher.publish({
      type: 'mock.event.created',
      value: 42,
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(publisher.getEvents()).toHaveLength(1);

    publisher.failNext(
      new Error('Planned event failure.'),
    );

    await expect(
      publisher.publish({
        type: 'mock.event.failed',
      }),
    ).rejects.toThrow(
      'Planned event failure.',
    );
  });

  it('tracks configuration reads', () => {
    const configuration =
      new MockSdkConfigurationReader({
        region: 'uae',
      });

    expect(
      configuration.get('region'),
    ).toBe('uae');

    expect(
      configuration.require('region'),
    ).toBe('uae');

    expect(
      configuration.getReads(),
    ).toEqual([
      'region',
      'region',
    ]);
  });

  it('tracks service resolutions', () => {
    const token = Symbol('service');

    const services =
      new MockSdkServiceContainer()
        .register(token, {
          value: 42,
        });

    expect(
      services.resolve<{
        value: number;
      }>(token).value,
    ).toBe(42);

    expect(
      services.resolveOptional('missing'),
    ).toBeUndefined();

    expect(
      services.getResolutions(),
    ).toHaveLength(2);
  });

  it('creates complete deterministic test contexts', async () => {
    const fixture =
      new MockSdkContextFactory().create({
        capabilityId:
          'creatoros.capability.mock-context',
        configuration: {
          environment: 'test',
        },
        state: {
          executions: 0,
        },
      });

    expect(
      fixture.context.identity.contextId,
    ).toBe('sdk-test-0001');

    expect(
      fixture.context.identity.instanceId,
    ).toBe('sdk-test-0002');

    expect(
      fixture.context.identity.correlationId,
    ).toBe('sdk-test-0003');

    expect(
      fixture.context.configuration.get(
        'environment',
      ),
    ).toBe('test');

    await fixture.context.events.publish({
      type: 'mock.context.ready',
    });

    expect(
      fixture.events.getEventsByType(
        'mock.context.ready',
      ),
    ).toHaveLength(1);
  });

  it('creates child contexts with shared mocks', () => {
    const fixture =
      new MockSdkContextFactory().create();

    const child =
      fixture.context.createChild({
        correlationId:
          'child-correlation',
        state: {
          operation: 'test',
        },
      });

    expect(
      child.identity.parentContextId,
    ).toBe(
      fixture.context.identity.contextId,
    );

    expect(child.logger).toBe(
      fixture.logger,
    );

    expect(child.events).toBe(
      fixture.events,
    );

    expect(
      child.state.get('operation'),
    ).toBe('test');
  });
});