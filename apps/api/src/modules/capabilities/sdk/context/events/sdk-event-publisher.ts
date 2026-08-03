import type {
  CapabilityEventPublisher,
} from '../../../interfaces';

export type SdkPublishedEvent =
  Readonly<Record<string, unknown>>;

export type SdkEventHandler = (
  event: SdkPublishedEvent,
) => void | Promise<void>;

export class SdkEventPublisher
  implements CapabilityEventPublisher
{
  private readonly handlers =
    new Set<SdkEventHandler>();

  private readonly history:
    SdkPublishedEvent[] = [];

  subscribe(
    handler: SdkEventHandler,
  ): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  async publish<TEvent extends object>(
    event: TEvent,
  ): Promise<void> {
    const publishedEvent =
      Object.freeze({
        ...event,
      }) as SdkPublishedEvent;

    this.history.push(publishedEvent);

    await Promise.all(
      [...this.handlers].map((handler) =>
        Promise.resolve(handler(publishedEvent)),
      ),
    );
  }

  getHistory(): readonly SdkPublishedEvent[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history.length = 0;
  }
}