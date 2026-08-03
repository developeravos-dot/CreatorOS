import { Injectable } from '@nestjs/common';

import type {
  CapabilityEventType,
  CapabilityIdentifier,
  CapabilityLifecycleState,
  CapabilityMetadata,
  CapabilityVersion,
} from '../contracts';
import type {
  CapabilityLifecycleTransitionRequest,
  CapabilityLifecycleTransitionResult,
} from '../lifecycle';
import { CapabilityLifecycleManagerService } from '../lifecycle';
import { CapabilityEventBusService } from './capability-event-bus.service';
import { CapabilityEventFactory } from './capability-event.factory';

const STATE_EVENT_MAP: Readonly<
  Partial<Record<CapabilityLifecycleState, CapabilityEventType>>
> = {
  discovered: 'capability.discovered',
  registered: 'capability.registered',
  validated: 'capability.validated',
  installed: 'capability.installed',
  initialized: 'capability.initialized',
  active: 'capability.activated',
  suspended: 'capability.suspended',
  stopped: 'capability.stopped',
  failed: 'capability.failed',
  uninstalled: 'capability.uninstalled',
};

export interface CapabilityLifecycleCommand
  extends CapabilityLifecycleTransitionRequest {
  readonly capabilityVersion: CapabilityVersion;
  readonly eventMetadata?: CapabilityMetadata;
}

@Injectable()
export class CapabilityLifecycleEventOrchestratorService {
  private readonly eventFactory =
    new CapabilityEventFactory();

  constructor(
    private readonly lifecycleManager:
      CapabilityLifecycleManagerService,
    private readonly eventBus:
      CapabilityEventBusService,
  ) {}

  async transition(
    command: CapabilityLifecycleCommand,
  ): Promise<CapabilityLifecycleTransitionResult> {
    const result =
      await this.lifecycleManager.transition(command);

    if (!result.changed) {
      return result;
    }

    const eventType =
      STATE_EVENT_MAP[result.currentState];

    if (!eventType) {
      return result;
    }

    const event = this.eventFactory.create({
      eventType,
      capabilityId: command.capabilityId,
      capabilityVersion: command.capabilityVersion,
      lifecycleState: result.currentState,
      correlationId: command.correlationId,
      actorId: command.actorId,
      metadata:
        command.eventMetadata ?? command.metadata,
    });

    await this.eventBus.publish(event);

    return result;
  }

  async initialize(
    capabilityId: CapabilityIdentifier,
    state: CapabilityLifecycleState = 'discovered',
  ): Promise<void> {
    await this.lifecycleManager.initialize(
      capabilityId,
      state,
    );
  }
}