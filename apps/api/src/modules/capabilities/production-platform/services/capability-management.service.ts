import {
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityManifestContract,
} from '../../contracts';
import type {
  CapabilityRegistryRecord,
} from '../../registry-engine';
import type {
  BulkCapabilityIdsDto,
  CapabilityManagementListQueryDto,
  RegisterManagedCapabilityDto,
  ValidateCapabilityManifestDto,
} from '../dto';
import type {
  BulkCapabilityOperationResult,
  CapabilityManagementRegistryResult,
  CapabilityManifestValidationResult,
} from '../contracts';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

@Injectable()
export class CapabilityManagementService {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  async list(
    query:
      CapabilityManagementListQueryDto,
  ): Promise<
    CapabilityManagementRegistryResult
  > {
    const records =
      await this.platform.registry.listRecords();

    const filtered =
      this.filterRecords(
        records,
        query,
      );

    const sorted =
      this.sortRecords(
        filtered,
        query,
      );

    const page =
      Math.max(
        1,
        query.page ?? 1,
      );

    const pageSize =
      Math.max(
        1,
        Math.min(
          200,
          query.pageSize ?? 25,
        ),
      );

    const totalItems =
      sorted.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalItems / pageSize,
        ),
      );

    const safePage =
      Math.min(
        page,
        totalPages,
      );

    const offset =
      (safePage - 1) *
      pageSize;

    const pageRecords =
      sorted.slice(
        offset,
        offset + pageSize,
      );

    this.audit.record({
      operation:
        'management.registry-records-read',
      successful: true,
      subjectId:
        'capability-registry',
      metadata: {
        totalItems,
        returnedItems:
          pageRecords.length,
        page:
          safePage,
        pageSize,
      },
    });

    return {
      count:
        pageRecords.length,
      total:
        totalItems,
      pagination: {
        page:
          safePage,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage:
          safePage > 1,
        hasNextPage:
          safePage < totalPages,
      },
      records:
        pageRecords,
    };
  }

  async getRecord(
    capabilityId: string,
  ) {
    const record =
      await this.platform.registry.getRecord(
        capabilityId,
      );

    this.audit.record({
      operation:
        'management.registry-record-read',
      successful:
        Boolean(record),
      subjectId:
        capabilityId,
      metadata: {
        found:
          Boolean(record),
      },
    });

    return record;
  }

  async getManifest(
    capabilityId: string,
  ) {
    const manifest =
      await this.platform.registry.get(
        capabilityId,
      );

    this.audit.record({
      operation:
        'management.manifest-read',
      successful:
        Boolean(manifest),
      subjectId:
        capabilityId,
      metadata: {
        found:
          Boolean(manifest),
      },
    });

    return manifest;
  }

  async register(
    input:
      RegisterManagedCapabilityDto,
  ) {
    const manifest =
      input.manifest as unknown as
        CapabilityManifestContract;

    try {
      const result =
        await this.platform.registry.register(
          manifest,
        );

      this.audit.record({
        operation:
          'capability.registered',
        successful: true,
        subjectId:
          manifest.id,
        actorId:
          input.actorId,
        correlationId:
          input.correlationId,
      });

      return result;
    } catch (error) {
      this.recordFailure(
        'capability.registered',
        manifest.id ??
          'unknown-capability',
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async unregister(
    capabilityId: string,
    actorId?: string,
    correlationId?: string,
  ) {
    try {
      await this.platform.registry.unregister(
        capabilityId,
      );

      this.audit.record({
        operation:
          'capability.unregistered',
        successful: true,
        subjectId:
          capabilityId,
        actorId,
        correlationId,
      });

      return {
        capabilityId,
        unregistered: true,
        completedAt:
          new Date().toISOString(),
      };
    } catch (error) {
      this.recordFailure(
        'capability.unregistered',
        capabilityId,
        error,
        actorId,
        correlationId,
      );

      throw error;
    }
  }

  async validateManifest(
    input:
      ValidateCapabilityManifestDto,
  ): Promise<
    CapabilityManifestValidationResult
  > {
    const manifest =
      input.manifest as unknown as
        CapabilityManifestContract;

    const issues: {
      code: string;
      message: string;
      path?: string;
    }[] = [];

    if (
      !manifest ||
      typeof manifest !== 'object'
    ) {
      issues.push({
        code:
          'MANIFEST_INVALID',
        message:
          'Manifest must be an object.',
      });
    }

    if (!manifest?.schemaVersion) {
      issues.push({
        code:
          'SCHEMA_VERSION_REQUIRED',
        message:
          'schemaVersion is required.',
        path:
          'schemaVersion',
      });
    }

    if (!manifest?.id) {
      issues.push({
        code:
          'CAPABILITY_ID_REQUIRED',
        message:
          'Capability id is required.',
        path:
          'id',
      });
    }

    if (!manifest?.name) {
      issues.push({
        code:
          'CAPABILITY_NAME_REQUIRED',
        message:
          'Capability name is required.',
        path:
          'name',
      });
    }

    if (!manifest?.version) {
      issues.push({
        code:
          'CAPABILITY_VERSION_REQUIRED',
        message:
          'Capability version is required.',
        path:
          'version',
      });
    }

    if (!manifest?.entrypoint) {
      issues.push({
        code:
          'ENTRYPOINT_REQUIRED',
        message:
          'Capability entrypoint is required.',
        path:
          'entrypoint',
      });
    }

    if (!manifest?.policy) {
      issues.push({
        code:
          'POLICY_REQUIRED',
        message:
          'Capability resource policy is required.',
        path:
          'policy',
      });
    }

    const result:
      CapabilityManifestValidationResult = {
        capabilityId:
          manifest?.id,
        valid:
          issues.length === 0,
        issues,
        manifest:
          issues.length === 0
            ? manifest
            : undefined,
        validatedAt:
          new Date().toISOString(),
      };

    this.audit.record({
      operation:
        'management.manifest-validated',
      successful:
        result.valid,
      subjectId:
        manifest?.id ??
        'unknown-capability',
      metadata: {
        issues:
          result.issues.length,
      },
    });

    return result;
  }

  async bulkUnregister(
    input:
      BulkCapabilityIdsDto,
  ): Promise<
    BulkCapabilityOperationResult
  > {
    const uniqueIds = [
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
      of uniqueIds
    ) {
      try {
        await this.platform.registry.unregister(
          capabilityId,
        );

        results.push({
          capabilityId,
          successful: true,
        });

        this.audit.record({
          operation:
            'capability.unregistered',
          successful: true,
          subjectId:
            capabilityId,
          actorId:
            input.actorId,
          correlationId:
            input.correlationId,
          metadata: {
            bulk: true,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        results.push({
          capabilityId,
          successful: false,
          error:
            message,
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
      }
    }

    const succeeded =
      results.filter(
        (item) =>
          item.successful,
      ).length;

    return {
      requested:
        uniqueIds.length,
      succeeded,
      failed:
        uniqueIds.length -
        succeeded,
      results,
      completedAt:
        new Date().toISOString(),
    };
  }

  private filterRecords(
    records:
      readonly CapabilityRegistryRecord[],
    query:
      CapabilityManagementListQueryDto,
  ) {
    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const domain =
      query.domain
        ?.trim()
        .toLowerCase();

    const state =
      query.state
        ?.trim()
        .toLowerCase();

    return records.filter(
      (record) => {
        if (
          domain &&
          record.manifest.domain
            .toLowerCase() !==
            domain
        ) {
          return false;
        }

        if (
          state &&
          record.state
            .toLowerCase() !==
            state
        ) {
          return false;
        }

        if (search) {
          const value = [
            record.manifest.id,
            record.manifest.name,
            record.manifest.description,
            record.manifest.domain,
            record.manifest.version,
          ]
            .join(' ')
            .toLowerCase();

          if (
            !value.includes(search)
          ) {
            return false;
          }
        }

        return true;
      },
    );
  }

  private sortRecords(
    records:
      readonly CapabilityRegistryRecord[],
    query:
      CapabilityManagementListQueryDto,
  ) {
    const direction =
      query.sortDirection ===
      'asc'
        ? 1
        : -1;

    const field =
      query.sortBy ??
      'registeredAt';

    return [...records].sort(
      (left, right) => {
        const leftValue =
          this.getSortValue(
            left,
            field,
          );

        const rightValue =
          this.getSortValue(
            right,
            field,
          );

        return leftValue.localeCompare(
          rightValue,
        ) * direction;
      },
    );
  }

  private getSortValue(
    record:
      CapabilityRegistryRecord,
    field: string,
  ): string {
    switch (field) {
      case 'id':
        return record.manifest.id;

      case 'name':
        return record.manifest.name;

      case 'domain':
        return record.manifest.domain;

      case 'version':
        return record.manifest.version;

      case 'updatedAt':
        return record.updatedAt;

      case 'registeredAt':
      default:
        return record.registeredAt;
    }
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
        error instanceof Error
          ? error.message
          : String(error),
      metadata: {
        requestedOperation,
        ...metadata,
      },
    });
  }
}