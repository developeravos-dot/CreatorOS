import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseEvent {
  readonly eventId: string;
  readonly type: string;
  readonly source: string;
  readonly payload:
    Readonly<Record<string, unknown>>;
  readonly occurredAt: Date;
}

@Injectable()
export class EnterpriseEventBusService {
  private readonly events:
    EnterpriseEvent[] = [];

  publish(input: {
    readonly eventId: string;
    readonly type: string;
    readonly source: string;
    readonly payload?:
      Readonly<Record<string, unknown>>;
    readonly now?: Date;
  }): EnterpriseEvent {
    const eventId =
      input.eventId.trim();

    const type =
      input.type.trim();

    const source =
      input.source.trim();

    if (
      !eventId ||
      !type ||
      !source ||
      this.events.some(
        (event) =>
          event.eventId === eventId,
      )
    ) {
      throw new Error(
        'A unique event id, type and source are required.',
      );
    }

    const event: EnterpriseEvent = {
      eventId,
      type,
      source,
      payload: structuredClone(
        input.payload ?? {},
      ),
      occurredAt: new Date(
        input.now ?? new Date(),
      ),
    };

    this.events.push(event);
    return this.clone(event);
  }

  query(input: {
    readonly type?: string;
    readonly source?: string;
  } = {}): readonly EnterpriseEvent[] {
    return this.events
      .filter(
        (event) =>
          !input.type ||
          event.type ===
            input.type.trim(),
      )
      .filter(
        (event) =>
          !input.source ||
          event.source ===
            input.source.trim(),
      )
      .map((event) =>
        this.clone(event),
      );
  }

  private clone(
    event: EnterpriseEvent,
  ): EnterpriseEvent {
    return {
      ...event,
      payload: structuredClone(
        event.payload,
      ),
      occurredAt: new Date(
        event.occurredAt,
      ),
    };
  }
}
