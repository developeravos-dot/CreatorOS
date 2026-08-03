import {
  analyzeProjectsConflict,
  resolveProjectsConflict,
  type ProjectsConflictResolution,
  type ProjectsConflictStrategy,
} from "./projects-conflict-resolution-engine";

import {
  createProjectsOfflineSyncQueue,
  type ProjectsOfflineSyncQueue,
  type ProjectsSyncQueueProcessResult,
  type ProjectsSyncQueueStorage,
} from "./projects-offline-sync-queue";

import type {
  ProjectsPersistenceArea,
  ProjectsPersistenceGateway,
  ProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

import {
  createProjectsPersistenceOrchestrator,
  type ProjectsPersistenceOrchestrator,
  type ProjectsPersistenceReadResult,
  type ProjectsPersistenceWriteResult,
} from "./projects-persistence-orchestrator";

import {
  canAccessProject,
  evaluateProjectPermission,
  type ProjectAccessPolicy,
  type ProjectPermission,
  type ProjectPermissionEvaluation,
  type ProjectPrincipal,
} from "./projects-permissions-engine";

export type ProjectsRuntimeStatus =
  | "idle"
  | "initializing"
  | "ready"
  | "degraded"
  | "synchronizing"
  | "failed";

export interface ProjectsRuntimeSnapshot {
  readonly status:
    ProjectsRuntimeStatus;
  readonly initialized: boolean;
  readonly online: boolean;
  readonly pendingOperations: number;
  readonly lastSynchronizedAt:
    string | null;
  readonly lastError:
    string | null;
}

export interface ProjectsRuntimeInitializationResult {
  readonly status:
    ProjectsRuntimeStatus;
  readonly synchronizedAreas: number;
  readonly pendingOperations: number;
  readonly errors:
    readonly string[];
}

export interface ProjectsRuntimeWriteResult {
  readonly persistence:
    ProjectsPersistenceWriteResult;
  readonly queued: boolean;
}

export interface ProjectsRuntimeConflictResult<
  TValue,
> {
  readonly conflict: boolean;
  readonly resolution:
    ProjectsConflictResolution<TValue> |
    null;
  readonly persisted: boolean;
}

export interface CreateProjectsProductionRuntimeOptions {
  readonly remote:
    ProjectsPersistenceGateway;
  readonly local:
    ProjectsPersistenceGateway;
  readonly queueStorage:
    ProjectsSyncQueueStorage;
  readonly conflictStrategy?:
    ProjectsConflictStrategy;
  readonly protectedPaths?:
    Readonly<
      Partial<
        Record<
          ProjectsPersistenceArea,
          readonly string[]
        >
      >
    >;
  readonly isOnline?:
    () => boolean;
  readonly now?:
    () => string;
}

export interface ProjectsProductionRuntime {
  getSnapshot():
    ProjectsRuntimeSnapshot;

  initialize():
    Promise<
      ProjectsRuntimeInitializationResult
    >;

  read<TValue>(
    area:
      ProjectsPersistenceArea,
  ): Promise<
    ProjectsPersistenceReadResult<TValue>
  >;

  write<TValue>(
    record:
      ProjectsPersistenceRecord<TValue>,
  ): Promise<
    ProjectsRuntimeWriteResult
  >;

  remove(
    area:
      ProjectsPersistenceArea,
  ): Promise<void>;

  synchronize():
    Promise<
      ProjectsSyncQueueProcessResult
    >;

  resolveConflict<TValue>(
    local:
      ProjectsPersistenceRecord<TValue>,
    remote:
      ProjectsPersistenceRecord<TValue>,
  ): Promise<
    ProjectsRuntimeConflictResult<TValue>
  >;

  evaluatePermission(
    policy:
      ProjectAccessPolicy,
    principal:
      ProjectPrincipal,
    permission:
      ProjectPermission,
  ): ProjectPermissionEvaluation;

  can(
    policy:
      ProjectAccessPolicy,
    principal:
      ProjectPrincipal,
    permission:
      ProjectPermission,
  ): boolean;
}

const AREAS:
  readonly ProjectsPersistenceArea[] = [
  "workspace-preferences",
  "project-assets",
  "assistant-conversations",
];

function normalizeTimestamp(
  value: string,
): string {
  const parsed =
    Date.parse(value);

  return Number.isFinite(parsed)
    ? new Date(parsed)
        .toISOString()
    : value;
}

function errorMessage(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : "Unknown projects runtime error.";
}

export function createProjectsProductionRuntime(
  options:
    CreateProjectsProductionRuntimeOptions,
): ProjectsProductionRuntime {
  const now =
    options.now ??
    (() =>
      new Date()
        .toISOString());

  const isOnline =
    options.isOnline ??
    (() =>
      typeof navigator ===
        "undefined" ||
      navigator.onLine);

  const conflictStrategy =
    options.conflictStrategy ??
    "newest-wins";

  const orchestrator:
    ProjectsPersistenceOrchestrator =
    createProjectsPersistenceOrchestrator({
      remote:
        options.remote,
      local:
        options.local,
      preferRemoteReads:
        true,
      mirrorRemoteReadsLocally:
        true,
    });

  const queue:
    ProjectsOfflineSyncQueue =
    createProjectsOfflineSyncQueue(
      options.queueStorage,
      now,
    );

  let snapshot:
    ProjectsRuntimeSnapshot = {
    status: "idle",
    initialized: false,
    online:
      isOnline(),
    pendingOperations:
      queue.getSnapshot()
        .items.length,
    lastSynchronizedAt:
      null,
    lastError:
      null,
  };

  function updateSnapshot(
    patch:
      Partial<
        ProjectsRuntimeSnapshot
      >,
  ): void {
    snapshot = {
      ...snapshot,
      ...patch,
      pendingOperations:
        queue.getSnapshot()
          .items.length,
    };
  }

  async function processQueue():
    Promise<
      ProjectsSyncQueueProcessResult
    > {
    if (!isOnline()) {
      updateSnapshot({
        status: "degraded",
        online: false,
        lastError:
          "Projects runtime is offline.",
      });

      return {
        processed: 0,
        succeeded: 0,
        failed: 0,
        remaining:
          queue.getSnapshot()
            .items.length,
      };
    }

    updateSnapshot({
      status:
        "synchronizing",
      online: true,
      lastError: null,
    });

    const result =
      await queue.process({
        async write(
          record,
        ): Promise<void> {
          await options.remote.write(
            record,
          );
        },

        async remove(
          area,
        ): Promise<void> {
          await options.remote.remove(
            area,
          );
        },
      });

    updateSnapshot({
      status:
        result.failed > 0
          ? "degraded"
          : "ready",
      lastSynchronizedAt:
        result.failed > 0
          ? snapshot
              .lastSynchronizedAt
          : normalizeTimestamp(
              now(),
            ),
      lastError:
        result.failed > 0
          ? "Some queued project operations could not be synchronized."
          : null,
    });

    return result;
  }

  return {
    getSnapshot():
      ProjectsRuntimeSnapshot {
      return snapshot;
    },

    async initialize():
      Promise<
        ProjectsRuntimeInitializationResult
      > {
      updateSnapshot({
        status:
          "initializing",
        initialized:
          false,
        online:
          isOnline(),
        lastError:
          null,
      });

      const errors:
        string[] = [];

      let synchronizedAreas =
        0;

      for (
        const area of AREAS
      ) {
        try {
          await orchestrator.read(
            area,
          );

          synchronizedAreas +=
            1;
        }
        catch (error: unknown) {
          errors.push(
            `${area}: ${errorMessage(error)}`,
          );
        }
      }

      let queueResult:
        ProjectsSyncQueueProcessResult = {
        processed: 0,
        succeeded: 0,
        failed: 0,
        remaining:
          queue.getSnapshot()
            .items.length,
      };

      if (isOnline()) {
        try {
          queueResult =
            await processQueue();
        }
        catch (error: unknown) {
          errors.push(
            errorMessage(error),
          );
        }
      }

      const status:
        ProjectsRuntimeStatus =
        errors.length > 0 ||
        queueResult.failed > 0 ||
        !isOnline()
          ? "degraded"
          : "ready";

      updateSnapshot({
        status,
        initialized: true,
        online:
          isOnline(),
        lastError:
          errors.length > 0
            ? errors.join(" | ")
            : snapshot
                .lastError,
      });

      return {
        status,
        synchronizedAreas,
        pendingOperations:
          queue.getSnapshot()
            .items.length,
        errors,
      };
    },

    async read<TValue>(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceReadResult<TValue>
    > {
      const result =
        await orchestrator.read<TValue>(
          area,
        );

      updateSnapshot({
        online:
          isOnline(),
        status:
          result.remoteError
            ? "degraded"
            : snapshot.initialized
              ? "ready"
              : snapshot.status,
        lastError:
          result.remoteError
            ?.message ??
          null,
      });

      return result;
    },

    async write<TValue>(
      record:
        ProjectsPersistenceRecord<TValue>,
    ): Promise<
      ProjectsRuntimeWriteResult
    > {
      const result =
        await orchestrator.write(
          record,
        );

      let queued = false;

      if (
        !result.remoteSaved
      ) {
        queue.enqueueWrite(
          record,
        );

        queued = true;
      }

      updateSnapshot({
        online:
          isOnline(),
        status:
          result.synchronized
            ? "ready"
            : "degraded",
        lastError:
          result.remoteError
            ?.message ??
          null,
      });

      return {
        persistence:
          result,
        queued,
      };
    },

    async remove(
      area:
        ProjectsPersistenceArea,
    ): Promise<void> {
      const result =
        await orchestrator.remove(
          area,
        );

      if (
        !result.remoteRemoved
      ) {
        queue.enqueueRemove(
          area,
        );
      }

      updateSnapshot({
        online:
          isOnline(),
        status:
          result.synchronized
            ? "ready"
            : "degraded",
        lastError:
          result.remoteError
            ?.message ??
          null,
      });
    },

    async synchronize():
      Promise<
        ProjectsSyncQueueProcessResult
      > {
      return processQueue();
    },

    async resolveConflict<TValue>(
      local:
        ProjectsPersistenceRecord<TValue>,
      remote:
        ProjectsPersistenceRecord<TValue>,
    ): Promise<
      ProjectsRuntimeConflictResult<TValue>
    > {
      const analysis =
        analyzeProjectsConflict(
          local,
          remote,
        );

      if (
        !analysis.conflict
      ) {
        return {
          conflict: false,
          resolution: null,
          persisted: false,
        };
      }

      const resolution =
        resolveProjectsConflict(
          analysis,
          {
            strategy:
              conflictStrategy,
            protectedPaths:
              options
                .protectedPaths
                ?.[local.area] ??
              [],
            resolvedAt:
              now(),
          },
        );

      const writeResult =
        await this.write(
          resolution.record,
        );

      return {
        conflict: true,
        resolution,
        persisted:
          writeResult
            .persistence
            .localSaved,
      };
    },

    evaluatePermission(
      policy:
        ProjectAccessPolicy,
      principal:
        ProjectPrincipal,
      permission:
        ProjectPermission,
    ): ProjectPermissionEvaluation {
      return evaluateProjectPermission(
        policy,
        principal,
        permission,
      );
    },

    can(
      policy:
        ProjectAccessPolicy,
      principal:
        ProjectPrincipal,
      permission:
        ProjectPermission,
    ): boolean {
      return canAccessProject(
        policy,
        principal,
        permission,
      );
    },
  };
}
