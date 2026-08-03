import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityManifestContract,
} from '../../contracts';
import type {
  CapabilityRegistryRecord,
} from '../../registry-engine';
import type {
  CapabilityRegistryAdministrationOverview,
  CapabilityRegistryBulkOperationResult,
  CapabilityRegistryClearResult,
  CapabilityRegistryConsistencyReport,
  CapabilityRegistrySnapshot,
} from '../contracts';
import type {
  BulkRegisterCapabilitiesDto,
  BulkUnregisterCapabilitiesDto,
  ClearCapabilityRegistryDto,
  RestoreCapabilityRegistrySnapshotDto,
} from '../dto';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

@Injectable()
export class CapabilityRegistryAdministrationService {
  static readonly CLEAR_CONFIRMATION =
    'CLEAR_CAPABILITY_REGISTRY';

  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  async overview():
    Promise<CapabilityRegistryAdministrationOverview> {
    const records =
      await this.platform.registry.listRecords();

    const domainCounts =
      this.countBy(
        records,
        (record) =>
          record.manifest.domain,
      );

    const stateCounts =
      this.countBy(
        records,
        (record) =>
          record.state,
      );

    const versionCounts =
      this.countBy(
        records,
        (record) =>
          record.manifest.version,
      );

    const registrationDates =
      records
        .map(
          (record) =>
            record.registeredAt,
        )
        .sort();

    const validCapabilities =
      records.filter(
        (record) =>
          record.validation.valid,
      ).length;

    const result:
      CapabilityRegistryAdministrationOverview = {
        totalCapabilities:
          records.length,
        validCapabilities,
        invalidCapabilities:
          records.length -
          validCapabilities,
        domains:
          [...domainCounts.entries()]
            .map(
              ([domain, capabilities]) => ({
                domain,
                capabilities,
              }),
            )
            .sort(
              (left, right) =>
                left.domain.localeCompare(
                  right.domain,
                ),
            ),
        states:
          [...stateCounts.entries()]
            .map(
              ([state, capabilities]) => ({
                state,
                capabilities,
              }),
            )
            .sort(
              (left, right) =>
                left.state.localeCompare(
                  right.state,
                ),
            ),
        versions:
          [...versionCounts.entries()]
            .map(
              ([version, capabilities]) => ({
                version,
                capabilities,
              }),
            )
            .sort(
              (left, right) =>
                left.version.localeCompare(
                  right.version,
                ),
            ),
        oldestRegistration:
          registrationDates[0],
        newestRegistration:
          registrationDates[
            registrationDates.length - 1
          ],
        generatedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'management.registry-overview-read',
      'capability-registry',
      {
        totalCapabilities:
          result.totalCapabilities,
      },
    );

    return result;
  }

  async consistency():
    Promise<CapabilityRegistryConsistencyReport> {
    const [
      manifests,
      records,
    ] = await Promise.all([
      this.platform.registry.list(),
      this.platform.registry.listRecords(),
    ]);

    const manifestIds =
      manifests.map(
        (manifest) =>
          manifest.id,
      );

    const recordIds =
      records.map(
        (record) =>
          record.manifest.id,
      );

    const duplicateCapabilityIds =
      this.findDuplicates(recordIds);

    const recordIdSet =
      new Set(recordIds);

    const missingManifestRecords =
      manifestIds.filter(
        (capabilityId) =>
          !recordIdSet.has(
            capabilityId,
          ),
      );

    const invalidRecords =
      records
        .filter(
          (record) =>
            !record.validation.valid,
        )
        .map(
          (record) => ({
            capabilityId:
              record.manifest.id,
            issues:
              record.validation.issues.length,
          }),
        );

    const consistent =
      manifests.length ===
        records.length &&
      duplicateCapabilityIds.length ===
        0 &&
      missingManifestRecords.length ===
        0 &&
      invalidRecords.length ===
        0;

    const result:
      CapabilityRegistryConsistencyReport = {
        consistent,
        manifestCount:
          manifests.length,
        recordCount:
          records.length,
        duplicateCapabilityIds,
        missingManifestRecords,
        invalidRecords,
        checkedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'management.registry-consistency-read',
      'capability-registry',
      {
        consistent,
        manifestCount:
          result.manifestCount,
        recordCount:
          result.recordCount,
      },
    );

    return result;
  }

  async snapshot():
    Promise<CapabilityRegistrySnapshot> {
    const records =
      await this.platform.registry.listRecords();

    const result:
      CapabilityRegistrySnapshot = {
        schemaVersion:
          '1.0.0',
        exportedAt:
          new Date().toISOString(),
        count:
          records.length,
        manifests:
          records.map(
            (record) =>
              record.manifest,
          ),
        records,
      };

    this.recordSuccess(
      'management.registry-snapshot-exported',
      'capability-registry',
      {
        count:
          result.count,
      },
    );

    return result;
  }

  async bulkRegister(
    input:
      BulkRegisterCapabilitiesDto,
  ): Promise<
    CapabilityRegistryBulkOperationResult
  > {
    const manifests =
      input.manifests as unknown as
        CapabilityManifestContract[];

    const uniqueManifests =
      this.uniqueManifests(
        manifests,
      );

    const results:
      {
        capabilityId: string;
        successful: boolean;
        error?: string;
      }[] = [];

    for (
      const manifest
      of uniqueManifests
    ) {
      const capabilityId =
        manifest?.id ??
        'unknown-capability';

      try {
        await this.platform.registry.register(
          manifest,
        );

        results.push({
          capabilityId,
          successful: true,
        });

        this.recordSuccess(
          'capability.registered',
          capabilityId,
          {
            bulk: true,
          },
          input.actorId,
          input.correlationId,
        );
      } catch (error) {
        results.push({
          capabilityId,
          successful: false,
          error:
            this.errorMessage(
              error,
            ),
        });

        this.recordFailure(
          'capability.registered',
          capabilityId,
          error,
          input.actorId,
          input.correlationId,
          {
            bulk: true,
          },
        );

        if (
          input.continueOnError ===
          false
        ) {
          break;
        }
      }
    }

    return this.bulkResult(
      uniqueManifests.length,
      results,
    );
  }

  async bulkUnregister(
    input:
      BulkUnregisterCapabilitiesDto,
  ): Promise<
    CapabilityRegistryBulkOperationResult
  > {
    const capabilityIds = [
      ...new Set(
        input.capabilityIds,
      ),
    ];

    const results:
      {
        capabilityId: string;
        successful: boolean;
        error?: string;
      }[] = [];

    for (
      const capabilityId
      of capabilityIds
    ) {
      try {
        await this.platform.registry.unregister(
          capabilityId,
        );

        results.push({
          capabilityId,
          successful: true,
        });

        this.recordSuccess(
          'capability.unregistered',
          capabilityId,
          {
            bulk: true,
          },
          input.actorId,
          input.correlationId,
        );
      } catch (error) {
        results.push({
          capabilityId,
          successful: false,
          error:
            this.errorMessage(
              error,
            ),
        });

        this.recordFailure(
          'capability.unregistered',
          capabilityId,
          error,
          input.actorId,
          input.correlationId,
          {
            bulk: true,
          },
        );

        if (
          input.continueOnError ===
          false
        ) {
          break;
        }
      }
    }

    return this.bulkResult(
      capabilityIds.length,
      results,
    );
  }

  async restore(
    input:
      RestoreCapabilityRegistrySnapshotDto,
  ): Promise<
    CapabilityRegistryBulkOperationResult
  > {
    const manifests =
      input.manifests as unknown as
        CapabilityManifestContract[];

    if (input.clearExisting) {
      const runningInstances =
        this.platform.runtime
          .listInstances()
          .filter(
            (instance) =>
              instance.status !==
                'stopped' &&
              instance.status !==
                'failed',
          );

      if (
        runningInstances.length >
        0
      ) {
        throw new ConflictException(
          'Registry restore cannot clear existing capabilities while runtime instances are active.',
        );
      }

      await this.platform.registry.clear();

      this.recordSuccess(
        'management.registry-cleared',
        'capability-registry',
        {
          restore: true,
        },
        input.actorId,
        input.correlationId,
      );
    }

    return this.bulkRegister({
      manifests:
        manifests as unknown as
          Record<string, unknown>[],
      actorId:
        input.actorId,
      correlationId:
        input.correlationId,
      continueOnError:
        input.continueOnError,
    });
  }

  async clear(
    input:
      ClearCapabilityRegistryDto,
  ): Promise<
    CapabilityRegistryClearResult
  > {
    if (
      input.confirmation !==
      CapabilityRegistryAdministrationService
        .CLEAR_CONFIRMATION
    ) {
      throw new BadRequestException(
        'Invalid registry clear confirmation.',
      );
    }

    const records =
      await this.platform.registry.listRecords();

    const removedCapabilities =
      records.length;

    const activeInstances =
      this.platform.runtime
        .listInstances()
        .filter(
          (instance) =>
            instance.status !==
              'stopped' &&
            instance.status !==
              'failed',
        );

    if (
      activeInstances.length >
        0 &&
      !input.force
    ) {
      throw new ConflictException(
        'Registry cannot be cleared while runtime instances are active.',
      );
    }

    let stoppedRuntimeInstances =
      0;

    if (
      activeInstances.length >
        0 &&
      input.force
    ) {
      for (
        const instance
        of activeInstances
      ) {
        try {
          await this.platform.runtime.stop({
            instanceId:
              instance.instanceId,
            reason:
              'Forced registry clear.',
            actorId:
              input.actorId,
            correlationId:
              input.correlationId,
          });

          stoppedRuntimeInstances +=
            1;
        } catch (error) {
          this.recordFailure(
            'runtime.stopped',
            instance.instanceId,
            error,
            input.actorId,
            input.correlationId,
            {
              registryClear: true,
            },
          );

          throw error;
        }
      }
    }

    await this.platform.registry.clear();

    const result:
      CapabilityRegistryClearResult = {
        cleared: true,
        removedCapabilities,
        stoppedRuntimeInstances,
        completedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'management.registry-cleared',
      'capability-registry',
      {
        removedCapabilities:
          result.removedCapabilities,
        stoppedRuntimeInstances:
          result.stoppedRuntimeInstances,
        forced:
          Boolean(input.force),
      },
      input.actorId,
      input.correlationId,
    );

    return result;
  }

  private countBy(
    records:
      readonly CapabilityRegistryRecord[],
    selector:
      (
        record:
          CapabilityRegistryRecord,
      ) => string,
  ): Map<string, number> {
    const result =
      new Map<string, number>();

    for (
      const record
      of records
    ) {
      const key =
        selector(record);

      result.set(
        key,
        (result.get(key) ?? 0) +
          1,
      );
    }

    return result;
  }

  private findDuplicates(
    values:
      readonly string[],
  ): string[] {
    const seen =
      new Set<string>();

    const duplicates =
      new Set<string>();

    for (
      const value
      of values
    ) {
      if (seen.has(value)) {
        duplicates.add(value);
      }

      seen.add(value);
    }

    return [...duplicates];
  }

  private uniqueManifests(
    manifests:
      readonly CapabilityManifestContract[],
  ): CapabilityManifestContract[] {
    const result =
      new Map<
        string,
        CapabilityManifestContract
      >();

    manifests.forEach(
      (manifest, index) => {
        const key =
          manifest?.id ??
          `unknown-${index}`;

        if (!result.has(key)) {
          result.set(
            key,
            manifest,
          );
        }
      },
    );

    return [...result.values()];
  }

  private bulkResult(
    requested: number,
    results:
      {
        capabilityId: string;
        successful: boolean;
        error?: string;
      }[],
  ): CapabilityRegistryBulkOperationResult {
    const succeeded =
      results.filter(
        (item) =>
          item.successful,
      ).length;

    return {
      requested,
      succeeded,
      failed:
        requested -
        succeeded,
      results,
      completedAt:
        new Date().toISOString(),
    };
  }

  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(error);
  }

  private recordSuccess(
    operation:
      | `capability.${string}`
      | `runtime.${string}`
      | `management.${string}`,
    subjectId: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
    actorId?: string,
    correlationId?: string,
  ): void {
    this.audit.record({
      operation,
      successful: true,
      subjectId,
      actorId,
      correlationId,
      metadata,
    });
  }

  private recordFailure(
    requestedOperation: string,
    subjectId: string,
    error: unknown,
    actorId?: string,
    correlationId?: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
  ): void {
    this.audit.record({
      operation:
        'operation.failed',
      successful: false,
      subjectId,
      actorId,
      correlationId,
      message:
        this.errorMessage(
          error,
        ),
      metadata: {
        requestedOperation,
        ...metadata,
      },
    });
  }
}