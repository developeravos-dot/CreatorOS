import type {
  ProjectsPersistenceArea,
  ProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

export type ProjectsSyncOperation =
  | "write"
  | "remove";

export type ProjectsSyncQueueItemStatus =
  | "pending"
  | "processing"
  | "failed";

export interface ProjectsSyncQueueItem {
  readonly id: string;
  readonly area:
    ProjectsPersistenceArea;
  readonly operation:
    ProjectsSyncOperation;
  readonly record:
    ProjectsPersistenceRecord<unknown> |
    null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly attempts: number;
  readonly status:
    ProjectsSyncQueueItemStatus;
  readonly lastError:
    string | null;
}

export interface ProjectsSyncQueueSnapshot {
  readonly version: 1;
  readonly items:
    readonly ProjectsSyncQueueItem[];
}

export interface ProjectsSyncQueueStorage {
  load(): ProjectsSyncQueueSnapshot;
  save(
    snapshot:
      ProjectsSyncQueueSnapshot,
  ): void;
  clear(): void;
}

export interface ProjectsSyncQueueProcessor {
  write(
    record:
      ProjectsPersistenceRecord<unknown>,
  ): Promise<void>;

  remove(
    area:
      ProjectsPersistenceArea,
  ): Promise<void>;
}

export interface ProjectsSyncQueueProcessResult {
  readonly processed: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly remaining: number;
}

export interface ProjectsOfflineSyncQueue {
  getSnapshot():
    ProjectsSyncQueueSnapshot;

  enqueueWrite<TValue>(
    record:
      ProjectsPersistenceRecord<TValue>,
  ): ProjectsSyncQueueItem;

  enqueueRemove(
    area:
      ProjectsPersistenceArea,
  ): ProjectsSyncQueueItem;

  process(
    processor:
      ProjectsSyncQueueProcessor,
  ): Promise<
    ProjectsSyncQueueProcessResult
  >;

  clear(): void;
}

export const PROJECTS_SYNC_QUEUE_STORAGE_KEY =
  "creatoros.projects.sync-queue.v1";

function normalizeTimestamp(
  value:
    string | undefined,
): string {
  if (!value) {
    return new Date()
      .toISOString();
  }

  const parsed =
    Date.parse(value);

  return Number.isFinite(
    parsed,
  )
    ? new Date(parsed)
        .toISOString()
    : value;
}

function createQueueItemId(
  area:
    ProjectsPersistenceArea,
  operation:
    ProjectsSyncOperation,
  timestamp: string,
): string {
  return [
    area,
    operation,
    timestamp,
  ].join(":");
}

function isPersistenceArea(
  value: unknown,
): value is ProjectsPersistenceArea {
  return (
    value ===
      "workspace-preferences" ||
    value ===
      "project-assets" ||
    value ===
      "assistant-conversations"
  );
}

function isQueueItem(
  value: unknown,
): value is ProjectsSyncQueueItem {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const item =
    value as
      Partial<ProjectsSyncQueueItem>;

  return (
    typeof item.id ===
      "string" &&
    isPersistenceArea(
      item.area,
    ) &&
    (
      item.operation ===
        "write" ||
      item.operation ===
        "remove"
    ) &&
    typeof item.createdAt ===
      "string" &&
    typeof item.updatedAt ===
      "string" &&
    typeof item.attempts ===
      "number" &&
    (
      item.status ===
        "pending" ||
      item.status ===
        "processing" ||
      item.status ===
        "failed"
    )
  );
}

export function createProjectsSyncQueueStorage(
  storage:
    Pick<
      Storage,
      | "getItem"
      | "setItem"
      | "removeItem"
    > = window.localStorage,
): ProjectsSyncQueueStorage {
  return {
    load():
      ProjectsSyncQueueSnapshot {
      try {
        const raw =
          storage.getItem(
            PROJECTS_SYNC_QUEUE_STORAGE_KEY,
          );

        if (!raw) {
          return {
            version: 1,
            items: [],
          };
        }

        const parsed =
          JSON.parse(
            raw,
          ) as
            Partial<
              ProjectsSyncQueueSnapshot
            >;

        if (
          parsed.version !== 1 ||
          !Array.isArray(
            parsed.items,
          )
        ) {
          return {
            version: 1,
            items: [],
          };
        }

        return {
          version: 1,
          items:
            parsed.items.filter(
              isQueueItem,
            ),
        };
      }
      catch {
        return {
          version: 1,
          items: [],
        };
      }
    },

    save(
      snapshot:
        ProjectsSyncQueueSnapshot,
    ): void {
      storage.setItem(
        PROJECTS_SYNC_QUEUE_STORAGE_KEY,
        JSON.stringify(
          snapshot,
        ),
      );
    },

    clear(): void {
      storage.removeItem(
        PROJECTS_SYNC_QUEUE_STORAGE_KEY,
      );
    },
  };
}

export function createProjectsOfflineSyncQueue(
  storage:
    ProjectsSyncQueueStorage,
  now:
    () => string =
      () =>
        new Date()
          .toISOString(),
): ProjectsOfflineSyncQueue {
  let snapshot =
    storage.load();

  function persist(
    items:
      readonly ProjectsSyncQueueItem[],
  ): void {
    snapshot = {
      version: 1,
      items,
    };

    storage.save(
      snapshot,
    );
  }

  function enqueue(
    area:
      ProjectsPersistenceArea,
    operation:
      ProjectsSyncOperation,
    record:
      ProjectsPersistenceRecord<unknown> |
      null,
  ): ProjectsSyncQueueItem {
    const timestamp =
      normalizeTimestamp(
        now(),
      );

    const item:
      ProjectsSyncQueueItem = {
      id:
        createQueueItemId(
          area,
          operation,
          timestamp,
        ),
      area,
      operation,
      record,
      createdAt:
        timestamp,
      updatedAt:
        timestamp,
      attempts: 0,
      status: "pending",
      lastError: null,
    };

    const withoutOlderAreaOperations =
      snapshot.items.filter(
        (current) =>
          current.area !==
          area,
      );

    persist([
      ...withoutOlderAreaOperations,
      item,
    ]);

    return item;
  }

  return {
    getSnapshot():
      ProjectsSyncQueueSnapshot {
      return snapshot;
    },

    enqueueWrite<TValue>(
      record:
        ProjectsPersistenceRecord<TValue>,
    ): ProjectsSyncQueueItem {
      return enqueue(
        record.area,
        "write",
        record,
      );
    },

    enqueueRemove(
      area:
        ProjectsPersistenceArea,
    ): ProjectsSyncQueueItem {
      return enqueue(
        area,
        "remove",
        null,
      );
    },

    async process(
      processor:
        ProjectsSyncQueueProcessor,
    ): Promise<
      ProjectsSyncQueueProcessResult
    > {
      let succeeded = 0;
      let failed = 0;

      const remaining:
        ProjectsSyncQueueItem[] = [];

      for (
        const current of
        snapshot.items
      ) {
        const processing:
          ProjectsSyncQueueItem = {
          ...current,
          status:
            "processing",
          updatedAt:
            normalizeTimestamp(
              now(),
            ),
        };

        try {
          if (
            processing.operation ===
            "write"
          ) {
            if (
              !processing.record
            ) {
              throw new Error(
                "Queued write operation is missing its record.",
              );
            }

            await processor.write(
              processing.record,
            );
          }
          else {
            await processor.remove(
              processing.area,
            );
          }

          succeeded += 1;
        }
        catch (error: unknown) {
          failed += 1;

          remaining.push({
            ...processing,
            attempts:
              processing.attempts +
              1,
            status: "failed",
            lastError:
              error instanceof Error
                ? error.message
                : "Unknown synchronization error.",
            updatedAt:
              normalizeTimestamp(
                now(),
              ),
          });
        }
      }

      persist(
        remaining,
      );

      return {
        processed:
          succeeded +
          failed,
        succeeded,
        failed,
        remaining:
          remaining.length,
      };
    },

    clear(): void {
      snapshot = {
        version: 1,
        items: [],
      };

      storage.clear();
    },
  };
}
