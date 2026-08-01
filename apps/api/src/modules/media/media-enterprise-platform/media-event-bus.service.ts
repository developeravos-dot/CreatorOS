import { Injectable } from '@nestjs/common';
import { EnterpriseMediaEvent } from './media-enterprise.types';

@Injectable()
export class MediaEventBusService {
  private readonly events: EnterpriseMediaEvent[] = [];

  publish(projectId: string, type: string, payload: Record<string, unknown> = {}) {
    const event: EnterpriseMediaEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      type,
      createdAt: new Date().toISOString(),
      payload,
    };
    this.events.push(event);
    return event;
  }

  list(projectId?: string) {
    return projectId ? this.events.filter((event) => event.projectId === projectId) : [...this.events];
  }
}
