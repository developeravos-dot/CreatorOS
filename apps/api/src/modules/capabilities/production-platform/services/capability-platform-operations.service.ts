import {
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityManifestContract,
  CapabilityMetadata,
} from '../../contracts';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';
import type {
  RegisterCapabilityDto,
  StartCapabilityRuntimeDto,
  StopCapabilityRuntimeDto,
} from '../dto';

@Injectable()
export class CapabilityPlatformOperationsService {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  listCapabilities() {
    return this.platform.registry.list();
  }

  getCapability(
    capabilityId: string,
  ) {
    return this.platform.registry.get(
      capabilityId,
    );
  }

  async registerCapability(
    input: RegisterCapabilityDto,
  ) {
    const manifest =
      input.manifest as unknown as
        CapabilityManifestContract;

    return this.execute(
      'capability.registered',
      manifest.id,
      input.actorId,
      input.correlationId,
      () =>
        this.platform.registry.register(
          manifest,
        ),
    );
  }

  async unregisterCapability(
    capabilityId: string,
    actorId?: string,
    correlationId?: string,
  ) {
    return this.execute(
      'capability.unregistered',
      capabilityId,
      actorId,
      correlationId,
      async () => {
        await this.platform.registry.unregister(
          capabilityId,
        );

        return {
          capabilityId,
          unregistered: true,
        };
      },
    );
  }

  listRuntimeInstances() {
    return this.platform.runtime.listInstances();
  }

  getRuntimeInstance(
    instanceId: string,
  ) {
    return this.platform.runtime.getInstance(
      instanceId,
    );
  }

  async startRuntime(
    input: StartCapabilityRuntimeDto,
  ) {
    return this.execute(
      'runtime.started',
      input.capabilityId,
      input.actorId,
      input.correlationId,
      () =>
        this.platform.runtime.start({
          capabilityId:
            input.capabilityId,
          actorId:
            input.actorId,
          correlationId:
            input.correlationId,
          metadata:
            input.metadata as
              | CapabilityMetadata
              | undefined,
        }),
    );
  }

  async stopRuntime(
    input: StopCapabilityRuntimeDto,
  ) {
    return this.execute(
      'runtime.stopped',
      input.instanceId,
      undefined,
      undefined,
      () =>
        this.platform.runtime.stop({
          instanceId:
            input.instanceId,
          reason:
            input.reason,
        }),
    );
  }

  private async execute<T>(
    requestedOperation: string,
    subjectId: string,
    actorId: string | undefined,
    correlationId: string | undefined,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      const result = await action();

      this.audit.record({
        operation:
          requestedOperation as never,
        successful: true,
        subjectId,
        actorId,
        correlationId,
      });

      return result;
    } catch (error) {
      this.audit.record({
        operation:
          'operation.failed',
        successful: false,
        subjectId,
        actorId,
        correlationId,
        message:
          error instanceof Error
            ? error.message
            : String(error),
        metadata: {
          requestedOperation,
        },
      });

      throw error;
    }
  }
}