import { randomUUID } from 'node:crypto';

import type {
  PlatformEvent,
  PlatformStartedEvent,
  PlatformStartedPayload,
} from '@creatoros/contracts';

export type EventHandler<TPayload = unknown> = (
  event: PlatformEvent<TPayload>,
) => void | Promise<void>;

export class InMemoryEventBus {
  private readonly handlers = new Map<
    string,
    EventHandler[]
  >();

  subscribe<TPayload>(
    eventName: string,
    handler: EventHandler<TPayload>,
  ): void {
    const currentHandlers =
      this.handlers.get(eventName) ?? [];

    currentHandlers.push(
      handler as EventHandler,
    );

    this.handlers.set(
      eventName,
      currentHandlers,
    );
  }

  async publish<TPayload>(
    event: PlatformEvent<TPayload>,
  ): Promise<void> {
    const eventHandlers =
      this.handlers.get(
        event.metadata.eventName,
      ) ?? [];

    await Promise.all(
      eventHandlers.map((handler) =>
        handler(event),
      ),
    );
  }
}

export function createPlatformStartedEvent(
  payload: PlatformStartedPayload,
): PlatformStartedEvent {
  return {
    metadata: {
      eventId: randomUUID(),
      eventName: 'platform.started',
      eventVersion: '1.0.0',
      source: '@creatoros/events',
      occurredAt: new Date().toISOString(),
    },
    payload,
  };
}

