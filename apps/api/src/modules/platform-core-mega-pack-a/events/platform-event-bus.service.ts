import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlatformEvent } from '../platform-core.types';

type Handler = (
  event: PlatformEvent,
) => void | Promise<void>;

@Injectable()
export class PlatformEventBusService {
  private readonly events: PlatformEvent[] = [];
  private readonly handlers = new Map<
    string,
    Handler[]
  >();

  subscribe(
    eventName: string,
    handler: Handler,
  ) {
    const handlers =
      this.handlers.get(eventName) ?? [];

    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }

  async publish(
    name: string,
    source: string,
    payload: Record<string, unknown>,
    correlationId?: string,
  ) {
    const event: PlatformEvent = {
      id: randomUUID(),
      name,
      source,
      payload,
      correlationId,
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);

    for (const handler of this.handlers.get(name) ?? []) {
      await handler(event);
    }

    return event;
  }

  history() {
    return [...this.events];
  }
}