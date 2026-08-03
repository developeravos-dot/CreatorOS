import {
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityMetadata,
} from '../../contracts';
import type {
  DependencyResolverCatalogEntry,
} from '../../dependency-resolver';
import type {
  CapabilityManagementQueryDto,
  ResolveManagedDependenciesDto,
} from '../dto';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

@Injectable()
export class CapabilityPlatformManagementService {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  async listRegistryRecords(
    query: CapabilityManagementQueryDto = {},
  ) {
    const records =
      await this.platform.registry.listRecords();

    const normalizedSearch =
      query.search
        ?.trim()
        .toLowerCase();

    const normalizedDomain =
      query.domain
        ?.trim()
        .toLowerCase();

    const normalizedState =
      query.state
        ?.trim()
        .toLowerCase();

    const filtered =
      records.filter((record) => {
        if (
          normalizedState &&
          record.state.toLowerCase() !==
            normalizedState
        ) {
          return false;
        }

        if (
          normalizedDomain &&
          record.manifest.domain
            .toLowerCase() !==
            normalizedDomain
        ) {
          return false;
        }

        if (normalizedSearch) {
          const searchable = [
            record.manifest.id,
            record.manifest.name,
            record.manifest.description,
            record.manifest.domain,
            record.manifest.version,
          ]
            .join(' ')
            .toLowerCase();

          if (
            !searchable.includes(
              normalizedSearch,
            )
          ) {
            return false;
          }
        }

        return true;
      });

    this.recordSuccess(
      'management.registry-records-read',
      'registry',
      {
        totalRecords:
          records.length,
        returnedRecords:
          filtered.length,
      },
    );

    return {
      total:
        records.length,
      count:
        filtered.length,
      records:
        filtered,
    };
  }

  async getRegistryRecord(
    capabilityId: string,
  ) {
    const record =
      await this.platform.registry.getRecord(
        capabilityId,
      );

    this.recordSuccess(
      'management.registry-record-read',
      capabilityId,
      {
        found:
          Boolean(record),
      },
    );

    return record;
  }

  async getManifest(
    capabilityId: string,
  ) {
    const manifest =
      await this.platform.registry.get(
        capabilityId,
      );

    this.recordSuccess(
      'management.manifest-read',
      capabilityId,
      {
        found:
          Boolean(manifest),
      },
    );

    return manifest;
  }

  listRuntimeInstances() {
    const instances =
      this.platform.runtime.listInstances();

    this.recordSuccess(
      'management.runtime-instances-read',
      'runtime',
      {
        instances:
          instances.length,
      },
    );

    return {
      count:
        instances.length,
      instances,
    };
  }

  getRuntimeInstance(
    instanceId: string,
  ) {
    try {
      const instance =
        this.platform.runtime.getInstance(
          instanceId,
        );

      this.recordSuccess(
        'management.runtime-instance-read',
        instanceId,
      );

      return instance;
    } catch (error) {
      this.recordFailure(
        'management.runtime-instance-read',
        instanceId,
        error,
      );

      throw error;
    }
  }

  async getRuntimeHealth(
    instanceId: string,
  ) {
    try {
      const result =
        await this.platform.runtime.healthCheck(
          instanceId,
        );

      this.recordSuccess(
        'management.runtime-health-read',
        instanceId,
        {
          status:
            result.report.status,
        },
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'management.runtime-health-read',
        instanceId,
        error,
      );

      throw error;
    }
  }

  resolveDependencies(
    input:
      ResolveManagedDependenciesDto,
  ) {
    try {
      const result =
        this.platform.dependencyResolver.resolve({
          rootCapabilityId:
            input.rootCapabilityId,
          catalog:
            input.catalog as unknown as
              readonly DependencyResolverCatalogEntry[],
          includeOptional:
            input.includeOptional,
          enforcePeerDependencies:
            input.enforcePeerDependencies,
          metadata:
            input.metadata as
              | CapabilityMetadata
              | undefined,
        });

      this.recordSuccess(
        'management.dependencies-resolved',
        input.rootCapabilityId,
        {
          status:
            result.status,
          issues:
            result.issues.length,
        },
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'management.dependencies-resolved',
        input.rootCapabilityId,
        error,
      );

      throw error;
    }
  }

  createDependencyPlan(
    input:
      ResolveManagedDependenciesDto,
  ) {
    try {
      const plan =
        this.platform.dependencyResolver.createPlan({
          rootCapabilityId:
            input.rootCapabilityId,
          catalog:
            input.catalog as unknown as
              readonly DependencyResolverCatalogEntry[],
          includeOptional:
            input.includeOptional,
          enforcePeerDependencies:
            input.enforcePeerDependencies,
          metadata:
            input.metadata as
              | CapabilityMetadata
              | undefined,
        });

      this.recordSuccess(
        'management.dependency-plan-created',
        input.rootCapabilityId,
        {
          executable:
            plan.executable,
          steps:
            plan.steps.length,
        },
      );

      return plan;
    } catch (error) {
      this.recordFailure(
        'management.dependency-plan-created',
        input.rootCapabilityId,
        error,
      );

      throw error;
    }
  }

  async listPlugins() {
    const plugins =
      await this.platform.pluginHost.listInstalled();

    this.recordSuccess(
      'management.plugins-read',
      'plugins',
      {
        plugins:
          plugins.length,
      },
    );

    return {
      count:
        plugins.length,
      plugins,
    };
  }

  async getPlugin(
    pluginKey: string,
  ) {
    const plugin =
      await this.platform.pluginHost.getInstalled(
        pluginKey,
      );

    this.recordSuccess(
      'management.plugin-read',
      pluginKey,
      {
        found:
          Boolean(plugin),
      },
    );

    return plugin;
  }

  async getPluginPackage(
    pluginKey: string,
  ) {
    const pluginPackage =
      await this.platform.pluginHost.getPackage(
        pluginKey,
      );

    this.recordSuccess(
      'management.plugin-package-read',
      pluginKey,
      {
        found:
          Boolean(pluginPackage),
      },
    );

    return pluginPackage;
  }

  private recordSuccess(
    operation: string,
    subjectId: string,
    metadata?:
      Readonly<Record<string, unknown>>,
  ): void {
    this.audit.record({
      operation:
        operation as never,
      successful: true,
      subjectId,
      metadata,
    });
  }

  private recordFailure(
    operation: string,
    subjectId: string,
    error: unknown,
  ): void {
    this.audit.record({
      operation:
        'operation.failed',
      successful: false,
      subjectId,
      message:
        error instanceof Error
          ? error.message
          : String(error),
      metadata: {
        requestedOperation:
          operation,
      },
    });
  }
}