import {
  Injectable,
} from '@nestjs/common';

import {
  InMemoryJobQueueAdapter,
  type JobQueueAdapter,
} from '../queue';
import type {
  JobQueueConfiguration,
  JobQueueMetrics,
} from '../models';

@Injectable()
export class JobQueueFactoryService {
  private readonly adapters =
    new Map<
      string,
      JobQueueAdapter
    >();

  create(
    name: string,
    configuration?:
      Partial<JobQueueConfiguration>,
  ): JobQueueAdapter {
    const normalizedName =
      name.trim();

    if (!normalizedName) {
      throw new Error(
        'Queue name is required.',
      );
    }

    if (
      this.adapters.has(
        normalizedName,
      )
    ) {
      throw new Error(
        `Queue ${normalizedName} already exists.`,
      );
    }

    const driver =
      configuration?.driver ??
      'memory';

    let adapter:
      JobQueueAdapter;

    switch (driver) {
      case 'memory':
        adapter =
          new InMemoryJobQueueAdapter(
            normalizedName,
            configuration,
          );
        break;

      case 'bullmq':
        throw new Error(
          'BullMQ adapter is not implemented in this stage.',
        );

      default: {
        const exhaustive:
          never = driver;

        throw new Error(
          `Unsupported queue driver: ${String(exhaustive)}`,
        );
      }
    }

    this.adapters.set(
      normalizedName,
      adapter,
    );

    return adapter;
  }

  register(
    adapter:
      JobQueueAdapter,
  ): void {
    const name =
      adapter.name.trim();

    if (!name) {
      throw new Error(
        'Queue adapter name is required.',
      );
    }

    if (this.adapters.has(name)) {
      throw new Error(
        `Queue ${name} already exists.`,
      );
    }

    this.adapters.set(
      name,
      adapter,
    );
  }

  get(
    name: string,
  ): JobQueueAdapter | undefined {
    return this.adapters.get(
      name,
    );
  }

  require(
    name: string,
  ): JobQueueAdapter {
    const adapter =
      this.adapters.get(name);

    if (!adapter) {
      throw new Error(
        `Queue ${name} was not found.`,
      );
    }

    return adapter;
  }

  list():
    readonly JobQueueAdapter[] {
    return [
      ...this.adapters.values(),
    ].sort(
      (left, right) =>
        left.name.localeCompare(
          right.name,
        ),
    );
  }

  remove(
    name: string,
  ): boolean {
    return this.adapters.delete(
      name,
    );
  }

  aggregateMetrics():
    JobQueueMetrics {
    const metrics =
      this.list().map(
        (adapter) =>
          adapter.metrics(),
      );

    const sum =
      (
        selector:
          (
            item:
              JobQueueMetrics,
          ) => number,
      ) =>
        metrics.reduce(
          (
            total,
            item,
          ) =>
            total +
            selector(item),
          0,
        );

    return {
      waiting:
        sum(
          (item) =>
            item.waiting,
        ),
      delayed:
        sum(
          (item) =>
            item.delayed,
        ),
      active:
        sum(
          (item) =>
            item.active,
        ),
      completed:
        sum(
          (item) =>
            item.completed,
        ),
      failed:
        sum(
          (item) =>
            item.failed,
        ),
      paused:
        sum(
          (item) =>
            item.paused,
        ),
      total:
        sum(
          (item) =>
            item.total,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    for (
      const adapter
      of this.adapters.values()
    ) {
      adapter.clear();
    }

    this.adapters.clear();
  }
}