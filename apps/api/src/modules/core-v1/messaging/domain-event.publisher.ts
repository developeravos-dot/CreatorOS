import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

export type CreatorOsDomainEvent<TPayload = unknown> = {
  name: string;
  occurredAt: string;
  payload: TPayload;
};

@Injectable()
export class DomainEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  publish<TPayload>(
    name: string,
    payload: TPayload,
  ): CreatorOsDomainEvent<TPayload> {
    const event: CreatorOsDomainEvent<TPayload> = {
      name,
      occurredAt: new Date().toISOString(),
      payload,
    };

    this.eventBus.publish(event);
    return event;
  }
}