import { Injectable } from '@nestjs/common';

import {
  MediaChannel,
  MediaChannelFamily,
  MediaContentIdea,
  MediaDomainEvent,
  MediaHumanApproval,
  MediaProject,
} from './media-ecosystem.contracts';

@Injectable()
export class MediaEcosystemStore {
  readonly projects = new Map<string, MediaProject>();

  readonly channels = new Map<string, MediaChannel>();

  readonly channelFamilies =
    new Map<string, MediaChannelFamily>();

  readonly ideas =
    new Map<string, MediaContentIdea>();

  readonly approvals =
    new Map<string, MediaHumanApproval>();

  readonly events: MediaDomainEvent[] = [];

  createId(prefix: string): string {
    const timestamp = Date.now().toString(36);

    const random = Math.random()
      .toString(36)
      .slice(2, 10);

    return `${prefix}_${timestamp}_${random}`;
  }

  now(): string {
    return new Date().toISOString();
  }

  recordEvent(
    type: string,
    aggregateType: string,
    aggregateId: string,
    payload: Record<string, unknown> = {},
  ): MediaDomainEvent {
    const event: MediaDomainEvent = {
      id: this.createId('evt'),
      type,
      aggregateType,
      aggregateId,
      payload,
      occurredAt: this.now(),
    };

    this.events.unshift(event);

    if (this.events.length > 1000) {
      this.events.length = 1000;
    }

    return event;
  }
}