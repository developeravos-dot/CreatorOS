import { Injectable } from '@nestjs/common';

import {
  CapabilityEventBusService,
} from '../../events';
import type {
  CapabilityHealthReportContract,
  CapabilityIdentifier,
} from '../../contracts';
import {
  CapabilityLifecycleEventOrchestratorService,
} from '../../events';
import {
  CapabilityLifecycleManagerService,
} from '../../lifecycle';
import {
  CapabilityRegistryEngineService,
} from '../../registry-engine';
import type {
  CapabilityRuntimeHealthResult,
  CapabilityRuntimeInstance,
  CapabilityRuntimeOperationResult,
  CapabilityRuntimeStartRequest,
  CapabilityRuntimeStopRequest,
} from '../contracts';
import {
  CapabilityRuntimeAlreadyRunningError,
  CapabilityRuntimeInstanceNotFoundError,
  CapabilityRuntimeLoadError,
} from '../errors/capability-runtime.errors';
import {
  CapabilityRuntimeInstanceModel,
} from '../models/capability-runtime-instance.model';
import {
  CapabilityRuntimeAdapterRegistryService,
} from './capability-runtime-adapter-registry.service';
import {
  CapabilityRuntimeContextFactory,
} from './capability-runtime-context.factory';
import {
  CapabilityRuntimeLoggerService,
} from './capability-runtime-logger.service';

@Injectable()
export class CapabilityRuntimeEngineService {
  private readonly instances =
    new Map<string, CapabilityRuntimeInstanceModel>();

  private readonly capabilityInstances =
    new Map<CapabilityIdentifier, string>();

  private readonly lifecycleManager:
    CapabilityLifecycleManagerService;

  private readonly lifecycleOrchestrator:
    CapabilityLifecycleEventOrchestratorService;

  constructor(
    private readonly registry =
      new CapabilityRegistryEngineService(),
    private readonly adapterRegistry =
      new CapabilityRuntimeAdapterRegistryService(),
    private readonly eventBus =
      new CapabilityEventBusService(),
    private readonly contextFactory =
      new CapabilityRuntimeContextFactory(),
    private readonly logger =
      new CapabilityRuntimeLoggerService(),
  ) {
    this.lifecycleManager =
      new CapabilityLifecycleManagerService();

    this.lifecycleOrchestrator =
      new CapabilityLifecycleEventOrchestratorService(
        this.lifecycleManager,
        this.eventBus,
      );
  }

  async start(
    request: CapabilityRuntimeStartRequest,
  ): Promise<CapabilityRuntimeOperationResult> {
    const existingInstanceId =
      this.capabilityInstances.get(
        request.capabilityId,
      );

    if (existingInstanceId) {
      const existing =
        this.instances.get(existingInstanceId);

      if (
        existing &&
        existing.status !== 'stopped' &&
        existing.status !== 'failed'
      ) {
        throw new CapabilityRuntimeAlreadyRunningError(
          request.capabilityId,
        );
      }
    }

    const record =
      await this.registry.getRecord(
        request.capabilityId,
      );

    if (!record) {
      throw new CapabilityRuntimeLoadError(
        request.capabilityId,
        new Error('Capability is not registered.'),
      );
    }

    const adapter =
      this.adapterRegistry.resolve(
        record.manifest.entrypoint.runtime,
      );

    try {
      const provider =
        await adapter.load(
          record.manifest.entrypoint,
        );

      const context =
        this.contextFactory.create({
          capabilityId: record.manifest.id,
          version: record.manifest.version,
          correlationId: request.correlationId,
          logger: this.logger,
          events: this.eventBus,
          metadata: request.metadata,
        });

      const instance =
        new CapabilityRuntimeInstanceModel(
          context.instanceId,
          provider,
          context,
          'created',
          'registered',
          new Date().toISOString(),
          request.metadata,
        );

      this.instances.set(
        instance.instanceId,
        instance,
      );

      this.capabilityInstances.set(
        request.capabilityId,
        instance.instanceId,
      );

      instance.updateStatus(
        'initializing',
        'installed',
      );

      await this.lifecycleOrchestrator.initialize(
        request.capabilityId,
        'registered',
      );

      await this.lifecycleOrchestrator.transition({
        capabilityId: request.capabilityId,
        capabilityVersion:
          record.manifest.version,
        targetState: 'validated',
        correlationId: request.correlationId,
        actorId: request.actorId,
      });

      await this.lifecycleOrchestrator.transition({
        capabilityId: request.capabilityId,
        capabilityVersion:
          record.manifest.version,
        targetState: 'installed',
        correlationId: request.correlationId,
        actorId: request.actorId,
      });

      await provider.lifecycle.initialize(context);

      await this.lifecycleOrchestrator.transition({
        capabilityId: request.capabilityId,
        capabilityVersion:
          record.manifest.version,
        targetState: 'initialized',
        correlationId: request.correlationId,
        actorId: request.actorId,
      });

      await provider.lifecycle.activate(context);

      await this.lifecycleOrchestrator.transition({
        capabilityId: request.capabilityId,
        capabilityVersion:
          record.manifest.version,
        targetState: 'active',
        correlationId: request.correlationId,
        actorId: request.actorId,
      });

      instance.updateStatus(
        'running',
        'active',
      );

      return {
        instanceId: instance.instanceId,
        capabilityId: instance.capabilityId,
        previousStatus: 'created',
        currentStatus: instance.status,
        lifecycleState:
          instance.lifecycleState,
        changed: true,
        completedAt:
          new Date().toISOString(),
        message:
          'Capability runtime started successfully.',
      };
    } catch (error) {
      throw new CapabilityRuntimeLoadError(
        request.capabilityId,
        error,
      );
    }
  }

  async stop(
    request: CapabilityRuntimeStopRequest,
  ): Promise<CapabilityRuntimeOperationResult> {
    const instance =
      this.instances.get(request.instanceId);

    if (!instance) {
      throw new CapabilityRuntimeInstanceNotFoundError(
        request.instanceId,
      );
    }

    const previousStatus =
      instance.status;

    if (previousStatus === 'stopped') {
      return {
        instanceId: instance.instanceId,
        capabilityId: instance.capabilityId,
        previousStatus,
        currentStatus: previousStatus,
        lifecycleState:
          instance.lifecycleState,
        changed: false,
        completedAt:
          new Date().toISOString(),
        message:
          'Capability runtime is already stopped.',
      };
    }

    instance.updateStatus(
      'stopping',
      instance.lifecycleState,
    );

    await instance.provider.lifecycle.stop(
      instance.context,
    );

    await this.lifecycleOrchestrator.transition({
      capabilityId: instance.capabilityId,
      capabilityVersion:
        instance.capabilityVersion,
      targetState: 'stopped',
      reason: request.reason,
      correlationId:
        request.correlationId,
      actorId: request.actorId,
    });

    instance.updateStatus(
      'stopped',
      'stopped',
    );

    this.capabilityInstances.delete(
      instance.capabilityId,
    );

    return {
      instanceId: instance.instanceId,
      capabilityId: instance.capabilityId,
      previousStatus,
      currentStatus: instance.status,
      lifecycleState:
        instance.lifecycleState,
      changed: true,
      completedAt:
        new Date().toISOString(),
      message:
        'Capability runtime stopped successfully.',
    };
  }

  getInstance(
    instanceId: string,
  ): CapabilityRuntimeInstance {
    const instance =
      this.instances.get(instanceId);

    if (!instance) {
      throw new CapabilityRuntimeInstanceNotFoundError(
        instanceId,
      );
    }

    return instance;
  }

  listInstances(): readonly CapabilityRuntimeInstance[] {
    return [...this.instances.values()];
  }

  async healthCheck(
    instanceId: string,
  ): Promise<CapabilityRuntimeHealthResult> {
    const instance =
      this.getInstance(instanceId);

    let report: CapabilityHealthReportContract;

    if (
      instance.provider.lifecycle.healthCheck
    ) {
      report =
        await instance.provider.lifecycle.healthCheck(
          instance.context,
        );
    } else {
      report = {
        capabilityId: instance.capabilityId,
        version: instance.capabilityVersion,
        status:
          instance.status === 'running'
            ? 'healthy'
            : 'offline',
        checks: [],
        generatedAt:
          new Date().toISOString(),
      };
    }

    return {
      instanceId,
      capabilityId:
        instance.capabilityId,
      report,
    };
  }
}