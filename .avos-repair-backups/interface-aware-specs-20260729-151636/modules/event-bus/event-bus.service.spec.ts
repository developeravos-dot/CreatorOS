import { EventBusService } from './event-bus.service';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    service = new EventBusService();
  });

  it('should report operational status', () => {
    expect(service.getStatus()).toEqual({
      module: 'event-bus',
      status: 'operational',
      provider: 'InMemoryEventBus',
      subscriptions: 1,
      receivedEvents: 0,
    });
  });

  it('should publish and store a platform.started event', async () => {
    const result =
      await service.publishPlatformStarted();

    expect(result.delivered).toBe(true);
    expect(result.receivedCount).toBe(1);
    expect(result.event.metadata.eventName)
      .toBe('platform.started');

    const storedEvent =
      service.getEventById(
        result.event.metadata.eventId,
      );

    expect(storedEvent).toEqual({
      eventId: result.event.metadata.eventId,
      eventType: 'platform.started',
      occurredAt: result.event.metadata.occurredAt,
    });
  });
});
