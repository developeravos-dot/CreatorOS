import type {
  CapabilityEventPublisher,
} from '../../../../interfaces';

export type MockSdkEvent =
  Readonly<Record<string, unknown>>;

export type MockSdkEventHandler = (
  event: MockSdkEvent,
) => void | Promise<void>;

export class MockSdkEventPublisher
  implements CapabilityEventPublisher
{
  private readonly events:
    MockSdkEvent[] = [];

  private readonly handlers =
    new Set<MockSdkEventHandler>();

  private nextFailure?: Error;

  async publish<TEvent extends object>(
    event: TEvent,
  ): Promise<void> {
    if (this.nextFailure) {
      const failure = this.nextFailure;
      this.nextFailure = undefined;
      throw failure;
    }

    const stored =
      Object.freeze({
        ...event,
      }) as MockSdkEvent;

    this.events.push(stored);

    for (const handler of this.handlers) {
      await handler(stored);
    }
  }

  subscribe(
    handler: MockSdkEventHandler,
  ): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  failNext(
    error:
      Error =
        new Error(
          'Mock SDK event publication failed.',
        ),
  ): void {
    this.nextFailure = error;
  }

  getEvents(): readonly MockSdkEvent[] {
    return [...this.events];
  }

  getEventsByType(
    type: string,
  ): readonly MockSdkEvent[] {
    return this.events.filter(
      (event) => event.type === type,
    );
  }

  lastEvent():
    | MockSdkEvent
    | undefined {
    return this.events.at(-1);
  }

  clear(): void {
    this.events.length = 0;
    this.nextFailure = undefined;
  }
}