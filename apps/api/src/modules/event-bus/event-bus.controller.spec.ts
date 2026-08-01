import { NotFoundException } from '@nestjs/common';
import { EventBusController } from './event-bus.controller';
import { EventBusService } from './event-bus.service';

describe('EventBusController', () => {
  let service: EventBusService;
  let controller: EventBusController;

  beforeEach(() => {
    service = new EventBusService();
    controller = new EventBusController(service);
  });

  it('should return an existing event', async () => {
    const published =
      await service.publishPlatformStarted();

    const event = controller.getEventById(
      published.event.metadata.eventId,
    );

    expect(event).toEqual({
      eventId: published.event.metadata.eventId,
      eventType: 'platform.started',
      occurredAt: published.event.metadata.occurredAt,
    });
  });

  it('should throw NotFoundException for missing event', () => {
    expect(() =>
      controller.getEventById('missing-event'),
    ).toThrow(NotFoundException);
  });
});
