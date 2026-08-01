import { Injectable } from '@nestjs/common';

type CapabilityStatus =
  | 'planned'
  | 'development'
  | 'operational';

interface CapabilityRecord {
  id: string;
  name: string;
  domain: string;
  status: CapabilityStatus;
  version: string;
}

@Injectable()
export class CapabilityService {
  private readonly capabilities:
    CapabilityRecord[] = [
      {
        id: 'CAP-CORE-001',
        name: 'Core Platform',
        domain: 'platform',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-CONFIG-001',
        name: 'Configuration Management',
        domain: 'platform',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-LOGGING-001',
        name: 'Centralized Logging',
        domain: 'observability',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-EVENTS-001',
        name: 'In-Memory Event Bus',
        domain: 'integration',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-KNOWLEDGE-001',
        name: 'Knowledge Foundation',
        domain: 'knowledge',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-WORKFLOW-001',
        name: 'Workflow Foundation',
        domain: 'automation',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-MESSAGING-001',
        name: 'Messaging Foundation',
        domain: 'integration',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-RUNTIME-001',
        name: 'Runtime Mega Pack',
        domain: 'platform',
        status: 'operational',
        version: '0.1.0',
      },
      {
        id: 'CAP-BLUEPRINT-001',
        name: 'Blueprint Engine Mega Pack',
        domain: 'platform',
        status: 'operational',
        version: '0.1.0',
      },    ];

  getAll() {
    return {
      registry:
        'capability-registry',
      status: 'operational',
      count:
        this.capabilities.length,
      capabilities:
        this.capabilities,
    };
  }

  getById(id: string) {
    return this.capabilities.find(
      (capability) =>
        capability.id === id,
    );
  }
}

