import { Injectable } from '@nestjs/common';

type DomainStatus =
  | 'planned'
  | 'development'
  | 'operational';

interface DomainRecord {
  id: string;
  name: string;
  key: string;
  status: DomainStatus;
  description: string;
}

@Injectable()
export class DomainService {
  private readonly domains: DomainRecord[] = [
    {
      id: 'DOM-PLATFORM-001',
      name: 'Platform',
      key: 'platform',
      status: 'operational',
      description:
        'Core platform foundation and shared system services.',
    },
    {
      id: 'DOM-OBSERVABILITY-001',
      name: 'Observability',
      key: 'observability',
      status: 'operational',
      description:
        'Logging, monitoring and operational visibility.',
    },
    {
      id: 'DOM-INTEGRATION-001',
      name: 'Integration',
      key: 'integration',
      status: 'operational',
      description:
        'Events, messaging and communication between system capabilities.',
    },
    {
      id: 'DOM-KNOWLEDGE-001',
      name: 'Knowledge',
      key: 'knowledge',
      status: 'operational',
      description:
        'Knowledge objects, relations, versions and retrieval foundations.',
    },
    {
      id: 'DOM-AUTOMATION-001',
      name: 'Automation',
      key: 'automation',
      status: 'operational',
      description:
        'Workflow execution, task orchestration and runtime automation.',
    },
  ];

  getAll() {
    return {
      registry: 'domain-registry',
      status: 'operational',
      count: this.domains.length,
      domains: this.domains,
    };
  }

  getById(id: string) {
    return this.domains.find(
      (domain) => domain.id === id,
    );
  }
}
