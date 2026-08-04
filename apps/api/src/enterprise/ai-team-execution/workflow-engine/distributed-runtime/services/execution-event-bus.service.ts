import { Injectable } from '@nestjs/common';

export const EXECUTION_EVENT_TYPES = [
  'execution.started',
  'execution.progressed',
  'execution.completed',
  'execution.failed',
  'execution.reassigned',
  'execution.recovered',
] as const;

export type ExecutionEventType =
  (typeof EXECUTION_EVENT_TYPES)[number];

export interface ExecutionRuntimeEvent {
  readonly eventId: string;
  readonly executionId: string;
  readonly type: ExecutionEventType;
  readonly sequence: number;
  readonly occurredAt: Date;
  readonly payload:
    Readonly<Record<string, unknown>>;
}

@Injectable()
export class ExecutionEventBusService {
  private readonly events =
    new Map<string, ExecutionRuntimeEvent>();

  private readonly sequences =
    new Map<string, number>();

  publish(input: {
    readonly eventId: string;
    readonly executionId: string;
    readonly type: ExecutionEventType;
    readonly payload?: Readonly<
      Record<string, unknown>
    >;
    readonly occurredAt?: Date;
  }): ExecutionRuntimeEvent {
    const eventId = this.text(
      input.eventId,
      'eventId',
    );

    if (this.events.has(eventId)) {
      return this.clone(
        this.events.get(eventId)!,
      );
    }

    const executionId = this.text(
      input.executionId,
      'executionId',
    );

    const sequence =
      (this.sequences.get(executionId) ?? 0) + 1;

    const event: ExecutionRuntimeEvent = {
      eventId,
      executionId,
      type: input.type,
      sequence,
      occurredAt: new Date(
        input.occurredAt ?? new Date(),
      ),
      payload: structuredClone(
        input.payload ?? {},
      ),
    };

    this.events.set(event.eventId, event);
    this.sequences.set(
      executionId,
      sequence,
    );

    return this.clone(event);
  }

  list(
    executionId?: string,
  ): readonly ExecutionRuntimeEvent[] {
    return [...this.events.values()]
      .filter(
        (event) =>
          executionId === undefined ||
          event.executionId === executionId,
      )
      .sort((left, right) => {
        if (
          left.executionId === right.executionId
        ) {
          return left.sequence - right.sequence;
        }

        return left.executionId.localeCompare(
          right.executionId,
        );
      })
      .map((event) => this.clone(event));
  }

  private text(
    value: string,
    field: string,
  ): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error(`${field} is required.`);
    }

    return normalized;
  }

  private clone(
    event: ExecutionRuntimeEvent,
  ): ExecutionRuntimeEvent {
    return {
      ...event,
      occurredAt: new Date(event.occurredAt),
      payload: structuredClone(event.payload),
    };
  }
}
