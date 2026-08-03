import 'reflect-metadata';

import { CapabilityEventBusService } from './capability-event-bus.service';
import { CapabilityEventFactory } from './capability-event.factory';
import { CapabilityLifecycleEventOrchestratorService } from './capability-lifecycle-event-orchestrator.service';
import { CapabilityLifecycleManagerService } from '../lifecycle';

describe('Capability Events', () => {
  it('creates immutable capability events', () => {
    const factory = new CapabilityEventFactory();

    const event = factory.create({
      eventType: 'capability.registered',
      capabilityId:
        'creatoros.capability.event-test',
      capabilityVersion: '1.0.0',
      lifecycleState: 'registered',
    });

    expect(event.eventId).toBeTruthy();
    expect(event.eventType).toBe(
      'capability.registered',
    );
    expect(Object.isFrozen(event)).toBe(true);
  });

  it('publishes typed events to subscribers', async () => {
    const bus = new CapabilityEventBusService();
    const factory = new CapabilityEventFactory();
    const handler = jest.fn();

    bus.subscribe(
      'capability.activated',
      handler,
    );

    const event = factory.create({
      eventType: 'capability.activated',
      capabilityId:
        'creatoros.capability.event-test',
      capabilityVersion: '1.0.0',
      lifecycleState: 'active',
    });

    await bus.publish(event);

    expect(handler).toHaveBeenCalledWith(event);
    expect(bus.getHistory()).toHaveLength(1);
  });

  it('publishes events after lifecycle transitions', async () => {
    const manager =
      new CapabilityLifecycleManagerService();

    const bus = new CapabilityEventBusService();

    const orchestrator =
      new CapabilityLifecycleEventOrchestratorService(
        manager,
        bus,
      );

    const capabilityId =
      'creatoros.capability.orchestrator-test';

    await orchestrator.initialize(capabilityId);

    await orchestrator.transition({
      capabilityId,
      capabilityVersion: '1.0.0',
      targetState: 'registered',
    });

    expect(bus.getHistory()).toHaveLength(1);
    expect(bus.getHistory()[0]?.eventType).toBe(
      'capability.registered',
    );
  });
});