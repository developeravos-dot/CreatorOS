import { Injectable } from '@nestjs/common';
import { CapabilityFabricService } from '../capabilities/capability-fabric.service';

@Injectable()
export class PlatformIntegrationMp2Service {
  constructor(
    private readonly fabric:
      CapabilityFabricService,
  ) {}

  bootstrapDefaultCapabilities() {
    const defaults = [
      {
        key: 'platform',
        name: 'CreatorOS Platform',
        version: '1.0.0',
        dependencies: [],
        commands: [
          'health-check',
          'synchronize',
        ],
        eventsProduced: [
          'platform.ready',
        ],
        eventsConsumed: [],
        metadata: {
          domain: 'platform',
        },
      },
      {
        key: 'media',
        name: 'CreatorOS Media',
        version: '1.0.0',
        dependencies: ['platform'],
        commands: [
          'generate-content',
          'publish-content',
        ],
        eventsProduced: [
          'media.content.generated',
        ],
        eventsConsumed: [
          'workflow.started',
        ],
        metadata: {
          domain: 'media',
        },
      },
      {
        key: 'knowledge',
        name: 'CreatorOS Knowledge',
        version: '1.0.0',
        dependencies: ['platform'],
        commands: [
          'store-knowledge',
          'retrieve-knowledge',
        ],
        eventsProduced: [
          'knowledge.updated',
        ],
        eventsConsumed: [
          'media.content.generated',
        ],
        metadata: {
          domain: 'knowledge',
        },
      },
      {
        key: 'factory',
        name: 'CreatorOS Factory',
        version: '1.0.0',
        dependencies: ['platform'],
        commands: [
          'generate-project',
          'validate-project',
        ],
        eventsProduced: [
          'factory.project.generated',
        ],
        eventsConsumed: [
          'workflow.started',
        ],
        metadata: {
          domain: 'factory',
        },
      },
      {
        key: 'live',
        name: 'CreatorOS Live',
        version: '1.0.0',
        dependencies: ['platform'],
        commands: [
          'create-live-experience',
          'launch-live-event',
        ],
        eventsProduced: [
          'live.event.created',
        ],
        eventsConsumed: [
          'workflow.started',
        ],
        metadata: {
          domain: 'live',
        },
      },
    ];

    for (const capability of defaults) {
      try {
        this.fabric.register(capability);
      } catch {
        // Idempotent bootstrap.
      }
    }

    this.fabric.activate('platform');

    for (const key of [
      'media',
      'knowledge',
      'factory',
      'live',
    ]) {
      this.fabric.activate(key);
    }

    return this.fabric.list();
  }
}