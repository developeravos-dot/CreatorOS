import { Injectable } from '@nestjs/common';

import type {
  CapabilityEventContract,
  CapabilityEventType,
} from '../contracts';
import type { CapabilityEventPublisher } from '../interfaces';

export type CapabilityEventHandler = (
  event: CapabilityEventContract,
) => void | Promise<void>;

@Injectable()
export class CapabilityEventBusService
  implements CapabilityEventPublisher
{
  private readonly handlers =
    new Map<CapabilityEventType, Set<CapabilityEventHandler>>();

  private readonly wildcardHandlers =
    new Set<CapabilityEventHandler>();

  private readonly eventHistory:
    CapabilityEventContract[] = [];

  subscribe(
    eventType: CapabilityEventType,
    handler: CapabilityEventHandler,
  ): () => void {
    const handlers =
      this.handlers.get(eventType) ??
      new Set<CapabilityEventHandler>();

    handlers.add(handler);
    this.handlers.set(eventType, handlers);

    return () => {
      handlers.delete(handler);

      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  subscribeAll(
    handler: CapabilityEventHandler,
  ): () => void {
    this.wildcardHandlers.add(handler);

    return () => {
      this.wildcardHandlers.delete(handler);
    };
  }

  async publish<TEvent extends object>(
    event: TEvent,
  ): Promise<void> {
    const capabilityEvent =
      event as CapabilityEventContract;

    this.eventHistory.push(capabilityEvent);

    const typedHandlers =
      this.handlers.get(capabilityEvent.eventType) ?? [];

    const handlers = [
      ...typedHandlers,
      ...this.wildcardHandlers,
    ];

    await Promise.all(
      handlers.map((handler) =>
        Promise.resolve(handler(capabilityEvent)),
      ),
    );
  }

  getHistory(): readonly CapabilityEventContract[] {
    return [...this.eventHistory];
  }

  clearHistory(): void {
    this.eventHistory.length = 0;
  }
}