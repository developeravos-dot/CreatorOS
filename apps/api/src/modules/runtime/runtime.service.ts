import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import {
  InMemoryRuntimeEngine,
  RegisterPluginInput,
} from '@creatoros/runtime';

@Injectable()
export class RuntimeService
  implements OnModuleInit
{
  private readonly engine =
    new InMemoryRuntimeEngine();

  private bootstrapped = false;

  private bootstrapResult = {
    registered: 0,
    validated: 0,
    loaded: 0,
    started: 0,
    failed: 0,
  };

  onModuleInit(): void {
    this.registerBuiltInPlugins();

    this.bootstrapResult =
      this.engine.bootstrap();

    this.bootstrapped = true;
  }

  registerPlugin(
    input: RegisterPluginInput,
  ) {
    return this.engine.registerPlugin(
      input,
    );
  }

  validatePlugin(pluginId: string) {
    return this.engine.validatePlugin(
      pluginId,
    );
  }

  loadPlugin(pluginId: string) {
    return this.engine.loadPlugin(
      pluginId,
    );
  }

  startPlugin(pluginId: string) {
    return this.engine.startPlugin(
      pluginId,
    );
  }

  stopPlugin(pluginId: string) {
    return this.engine.stopPlugin(
      pluginId,
    );
  }

  enablePlugin(pluginId: string) {
    return this.engine.enablePlugin(
      pluginId,
    );
  }

  disablePlugin(pluginId: string) {
    return this.engine.disablePlugin(
      pluginId,
    );
  }

  unloadPlugin(pluginId: string) {
    return this.engine.unloadPlugin(
      pluginId,
    );
  }

  getPlugins() {
    const plugins =
      this.engine.getPlugins();

    return {
      registry: 'runtime-plugins',
      status: 'operational',
      count: plugins.length,
      plugins,
    };
  }

  getPluginById(pluginId: string) {
    return this.engine.getPluginById(
      pluginId,
    );
  }

  getPluginByKey(pluginKey: string) {
    return this.engine.getPluginByKey(
      pluginKey,
    );
  }

  getCapabilities() {
    const capabilities =
      this.engine.getCapabilities();

    return {
      registry:
        'runtime-capabilities',
      status: 'operational',
      count: capabilities.length,
      capabilities,
    };
  }

  getCapability(
    capabilityKey: string,
  ) {
    return this.engine.getCapability(
      capabilityKey,
    );
  }

  getLifecycleEvents(
    pluginId?: string,
  ) {
    const events =
      this.engine
        .getLifecycleEvents(
          pluginId,
        );

    return {
      registry:
        'runtime-lifecycle-events',
      status: 'operational',
      count: events.length,
      events,
    };
  }

  bootstrapRuntime() {
    this.bootstrapResult =
      this.engine.bootstrap();

    this.bootstrapped = true;

    return this.bootstrapResult;
  }

  getHealth() {
    return {
      module: 'runtime',
      bootstrapped:
        this.bootstrapped,
      bootstrap:
        this.bootstrapResult,
      ...this.engine.getHealth(),
    };
  }

  private registerBuiltInPlugins(): void {
    this.engine.registerPlugin({
      key: 'creatoros.core',
      name: 'CreatorOS Core Runtime',
      description:
        'Core platform runtime services.',
      version: '0.1.0',
      type: 'core',
      runtimeCompatibility: '^0.1.0',
      enabled: true,
      autoStart: true,
      capabilities: [
        {
          key: 'platform.core',
          name: 'Core Platform',
          version: '0.1.0',
        },
        {
          key: 'platform.registry',
          name: 'System Registry',
          version: '0.1.0',
        },
      ],
      metadata: {
        builtIn: true,
        domain: 'platform',
      },
    });

    this.engine.registerPlugin({
      key: 'creatoros.events',
      name: 'CreatorOS Event Bus',
      description:
        'Event publication and subscription foundation.',
      version: '0.1.0',
      type: 'integration',
      runtimeCompatibility: '^0.1.0',
      enabled: true,
      autoStart: true,
      dependencies: [
        {
          pluginKey:
            'creatoros.core',
          minimumVersion: '0.1.0',
        },
      ],
      capabilities: [
        {
          key: 'integration.events',
          name: 'Event Bus',
          version: '0.1.0',
        },
      ],
      metadata: {
        package: '@creatoros/events',
        provider:
          'InMemoryEventBus',
      },
    });

    this.engine.registerPlugin({
      key: 'creatoros.knowledge',
      name: 'CreatorOS Knowledge',
      description:
        'Knowledge objects, relations and versions.',
      version: '0.1.0',
      type: 'capability',
      runtimeCompatibility: '^0.1.0',
      enabled: true,
      autoStart: true,
      dependencies: [
        {
          pluginKey:
            'creatoros.core',
          minimumVersion: '0.1.0',
        },
        {
          pluginKey:
            'creatoros.events',
          minimumVersion: '0.1.0',
          optional: true,
        },
      ],
      capabilities: [
        {
          key: 'knowledge.objects',
          name: 'Knowledge Objects',
          version: '0.1.0',
        },
        {
          key: 'knowledge.relations',
          name: 'Knowledge Relations',
          version: '0.1.0',
        },
        {
          key: 'knowledge.versions',
          name: 'Knowledge Versions',
          version: '0.1.0',
        },
      ],
      metadata: {
        package:
          '@creatoros/knowledge',
        provider:
          'InMemoryKnowledgeStore',
      },
    });

    this.engine.registerPlugin({
      key: 'creatoros.workflow',
      name: 'CreatorOS Workflow',
      description:
        'Workflow definitions, instances and task execution.',
      version: '0.1.0',
      type: 'capability',
      runtimeCompatibility: '^0.1.0',
      enabled: true,
      autoStart: true,
      dependencies: [
        {
          pluginKey:
            'creatoros.core',
          minimumVersion: '0.1.0',
        },
        {
          pluginKey:
            'creatoros.events',
          minimumVersion: '0.1.0',
          optional: true,
        },
      ],
      capabilities: [
        {
          key:
            'automation.workflow',
          name: 'Workflow Engine',
          version: '0.1.0',
        },
        {
          key:
            'automation.tasks',
          name: 'Workflow Tasks',
          version: '0.1.0',
        },
      ],
      metadata: {
        package:
          '@creatoros/workflow',
        provider:
          'InMemoryWorkflowEngine',
      },
    });

    this.engine.registerPlugin({
      key: 'creatoros.messaging',
      name: 'CreatorOS Messaging',
      description:
        'Topics, subscriptions, messages and delivery lifecycle.',
      version: '0.1.0',
      type: 'integration',
      runtimeCompatibility: '^0.1.0',
      enabled: true,
      autoStart: true,
      dependencies: [
        {
          pluginKey:
            'creatoros.core',
          minimumVersion: '0.1.0',
        },
        {
          pluginKey:
            'creatoros.events',
          minimumVersion: '0.1.0',
        },
      ],
      capabilities: [
        {
          key:
            'integration.messaging',
          name: 'Messaging Broker',
          version: '0.1.0',
        },
        {
          key:
            'integration.delivery',
          name: 'Message Delivery',
          version: '0.1.0',
        },
      ],
      metadata: {
        package:
          '@creatoros/messaging',
        provider:
          'InMemoryMessagingBroker',
      },
    });

    this.engine.registerPlugin({
      key: 'creatoros.blueprint',
      name: 'CreatorOS Blueprint Engine',
      description:
        'Blueprint registry, governance, validation and execution planning.',
      version: '0.1.0',
      type: 'capability',
      runtimeCompatibility: '^0.1.0',
      enabled: true,
      autoStart: true,
      dependencies: [
        {
          pluginKey: 'creatoros.core',
          minimumVersion: '0.1.0',
        },
        {
          pluginKey: 'creatoros.knowledge',
          minimumVersion: '0.1.0',
          optional: true,
        },
        {
          pluginKey: 'creatoros.workflow',
          minimumVersion: '0.1.0',
          optional: true,
        },
        {
          pluginKey: 'creatoros.messaging',
          minimumVersion: '0.1.0',
          optional: true,
        },
      ],
      capabilities: [
        {
          key: 'architecture.blueprints',
          name: 'Blueprint Registry',
          version: '0.1.0',
        },
        {
          key: 'architecture.validation',
          name: 'Blueprint Validation',
          version: '0.1.0',
        },
        {
          key: 'architecture.execution-plans',
          name: 'Blueprint Execution Plans',
          version: '0.1.0',
        },
        {
          key: 'governance.approval-gates',
          name: 'Blueprint Approval Gates',
          version: '0.1.0',
        },
      ],
      metadata: {
        package: '@creatoros/blueprint',
        provider: 'InMemoryBlueprintEngine',
        humanFinalAuthority: true,
      },
    });
  }
}


