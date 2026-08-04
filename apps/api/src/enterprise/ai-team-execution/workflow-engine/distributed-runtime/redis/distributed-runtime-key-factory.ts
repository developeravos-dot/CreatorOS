export class DistributedRuntimeKeyFactory {
  constructor(
    private readonly prefix = 'creatoros:runtime',
  ) {
    if (!prefix.trim()) {
      throw new Error('Runtime Redis prefix is required.');
    }
  }

  execution(executionId: string): string {
    return this.key('executions', executionId);
  }

  executionPattern(): string {
    return `${this.prefix}:executions:*`;
  }

  lease(executionId: string): string {
    return this.key('leases', executionId);
  }

  leasePattern(): string {
    return `${this.prefix}:leases:*`;
  }

  event(eventId: string): string {
    return this.key('events', eventId);
  }

  executionEvents(executionId: string): string {
    return this.key('execution-events', executionId);
  }

  eventSequence(executionId: string): string {
    return this.key('event-sequences', executionId);
  }

  retry(executionId: string): string {
    return this.key('retries', executionId);
  }

  private key(
    collection: string,
    identifier: string,
  ): string {
    const normalized = identifier.trim();

    if (!normalized) {
      throw new Error('Runtime Redis identifier is required.');
    }

    return [
      this.prefix,
      collection,
      encodeURIComponent(normalized),
    ].join(':');
  }
}
