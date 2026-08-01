import { Injectable } from '@nestjs/common';
import type { PlatformStartedEvent } from '@creatoros/contracts';
import {
  createPlatformStartedEvent,
  InMemoryEventBus,
} from '@creatoros/events';

interface ReceivedEventRecord {
  eventId: string;
  eventType: string;
  occurredAt: string;
}

@Injectable()
export class EventBusService {
  private readonly eventBus = new InMemoryEventBus();
  private readonly receivedEvents: ReceivedEventRecord[] = [];

  constructor() {
    this.eventBus.subscribe(
      'platform.started',
      async (event) => {
        this.receivedEvents.push({
          eventId: event.metadata.eventId,
          eventType: event.metadata.eventName,
          occurredAt: event.metadata.occurredAt,
        });
      },
    );
  }

  async publishPlatformStarted() {
    const event: PlatformStartedEvent =
      createPlatformStartedEvent({
        platformName: 'CreatorOS / AVOS',
        version: '0.1.0',
        environment:
          process.env.NODE_ENV ?? 'development',
        status: 'operational',
      });

    await this.eventBus.publish(event);

    return {
      event,
      delivered: true,
      receivedCount: this.receivedEvents.length,
    };
  }

  getEvents() {
    return {
      registry: 'received-events',
      status: 'operational',
      count: this.receivedEvents.length,
      events: this.receivedEvents,
    };
  }

  getEventById(eventId: string) {
    return this.receivedEvents.find(
      (event) => event.eventId === eventId,
    );
  }

  getStatus() {
    return {
      module: 'event-bus',
      status: 'operational',
      provider: 'InMemoryEventBus',
      subscriptions: 1,
      receivedEvents: this.receivedEvents.length,
    };
  }
}
