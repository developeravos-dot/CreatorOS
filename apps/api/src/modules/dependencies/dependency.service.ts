import { Injectable } from '@nestjs/common';

type DependencyStatus =
  | 'planned'
  | 'active'
  | 'deprecated';

interface DependencyRecord {
  id: string;
  source: string;
  target: string;
  type:
    | 'requires'
    | 'uses'
    | 'extends';
  status: DependencyStatus;
}

@Injectable()
export class DependencyService {
  private readonly dependencies:
    DependencyRecord[] = [
      {
        id: 'DEP-CORE-CONFIG-001',
        source: 'Core Module',
        target: 'Config Module',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-CORE-LOGGING-001',
        source: 'Core Module',
        target: 'Logging Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-REGISTRY-CAPABILITY-001',
        source: 'Registry Module',
        target: 'Capability Module',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-REGISTRY-DOMAIN-001',
        source: 'Registry Module',
        target: 'Domain Module',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-EVENTBUS-EVENTS-001',
        source: 'Event Bus Module',
        target: '@creatoros/events',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-EVENTS-CONTRACTS-001',
        source: '@creatoros/events',
        target: '@creatoros/contracts',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-KNOWLEDGE-PACKAGE-001',
        source: 'Knowledge Module',
        target: '@creatoros/knowledge',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-WORKFLOW-PACKAGE-001',
        source: 'Workflow Module',
        target: '@creatoros/workflow',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-MESSAGING-PACKAGE-001',
        source: 'Messaging Module',
        target: '@creatoros/messaging',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-MESSAGING-EVENTBUS-001',
        source: 'Messaging Module',
        target: 'Event Bus Module',
        type: 'extends',
        status: 'active',
      },
      {
        id: 'DEP-RUNTIME-PACKAGE-001',
        source: 'Runtime Module',
        target: '@creatoros/runtime',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-RUNTIME-WORKFLOW-001',
        source: 'Runtime Module',
        target: 'Workflow Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-RUNTIME-MESSAGING-001',
        source: 'Runtime Module',
        target: 'Messaging Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-RUNTIME-EVENTBUS-001',
        source: 'Runtime Module',
        target: 'Event Bus Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-RUNTIME-KNOWLEDGE-001',
        source: 'Runtime Module',
        target: 'Knowledge Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-BLUEPRINT-PACKAGE-001',
        source: 'Blueprint Module',
        target: '@creatoros/blueprint',
        type: 'requires',
        status: 'active',
      },
      {
        id: 'DEP-BLUEPRINT-RUNTIME-001',
        source: 'Blueprint Module',
        target: 'Runtime Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-BLUEPRINT-KNOWLEDGE-001',
        source: 'Blueprint Module',
        target: 'Knowledge Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-BLUEPRINT-WORKFLOW-001',
        source: 'Blueprint Module',
        target: 'Workflow Module',
        type: 'uses',
        status: 'active',
      },
      {
        id: 'DEP-BLUEPRINT-MESSAGING-001',
        source: 'Blueprint Module',
        target: 'Messaging Module',
        type: 'uses',
        status: 'active',
      },    ];

  getAll() {
    return {
      registry:
        'dependency-registry',
      status: 'operational',
      count:
        this.dependencies.length,
      dependencies:
        this.dependencies,
    };
  }

  getById(id: string) {
    return this.dependencies.find(
      (dependency) =>
        dependency.id === id,
    );
  }
}

