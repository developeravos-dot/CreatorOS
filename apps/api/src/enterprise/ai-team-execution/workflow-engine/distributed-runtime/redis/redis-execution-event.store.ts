import type {
  RedisClusterStoreClient,
} from '../../distributed-dispatch/cluster/redis';
import type {
  ExecutionRuntimeEvent,
} from '../services';
import {
  DistributedRuntimeKeyFactory,
} from './distributed-runtime-key-factory';

interface SerializedExecutionRuntimeEvent
  extends Omit<
    ExecutionRuntimeEvent,
    'occurredAt'
  > {
  readonly occurredAt: string;
}

export class RedisExecutionEventStore {
  constructor(
    private readonly client:
      RedisClusterStoreClient,
    private readonly keys =
      new DistributedRuntimeKeyFactory(),
  ) {}

  async append(
    event: ExecutionRuntimeEvent,
  ): Promise<boolean> {
    const created = await this.client.set(
      this.keys.event(event.eventId),
      JSON.stringify(
        this.serialize(event),
      ),
      'NX',
    );

    if (created !== 'OK') {
      return false;
    }

    await this.client.set(
      this.keys.executionEvents(
        event.executionId,
      ),
      JSON.stringify(
        await this.mergeEventId(event),
      ),
    );

    return true;
  }

  async list(
    executionId: string,
  ): Promise<readonly ExecutionRuntimeEvent[]> {
    const value = await this.client.get(
      this.keys.executionEvents(
        executionId,
      ),
    );

    if (!value) {
      return [];
    }

    const ids = JSON.parse(value) as string[];

    if (ids.length === 0) {
      return [];
    }

    const values = await this.client.mget(
      ...ids.map((eventId) =>
        this.keys.event(eventId),
      ),
    );

    return values
      .filter(
        (candidate): candidate is string =>
          candidate !== null,
      )
      .map((candidate) =>
        this.deserialize(candidate),
      )
      .sort(
        (left, right) =>
          left.sequence - right.sequence,
      );
  }

  async nextSequence(
    executionId: string,
  ): Promise<number> {
    return this.client.incr(
      this.keys.eventSequence(executionId),
    );
  }

  private async mergeEventId(
    event: ExecutionRuntimeEvent,
  ): Promise<readonly string[]> {
    const key =
      this.keys.executionEvents(
        event.executionId,
      );

    const current = await this.client.get(key);
    const ids = current
      ? JSON.parse(current) as string[]
      : [];

    return [
      ...new Set([
        ...ids,
        event.eventId,
      ]),
    ];
  }

  private serialize(
    event: ExecutionRuntimeEvent,
  ): SerializedExecutionRuntimeEvent {
    return {
      ...event,
      occurredAt:
        event.occurredAt.toISOString(),
      payload: structuredClone(
        event.payload,
      ),
    };
  }

  private deserialize(
    value: string,
  ): ExecutionRuntimeEvent {
    const parsed = (
      JSON.parse(value)
    ) as SerializedExecutionRuntimeEvent;

    return {
      ...parsed,
      occurredAt: new Date(
        parsed.occurredAt,
      ),
      payload: structuredClone(
        parsed.payload,
      ),
    };
  }
}
