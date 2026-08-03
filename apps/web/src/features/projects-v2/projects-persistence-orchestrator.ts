import type {
  ProjectsPersistenceArea,
  ProjectsPersistenceGateway,
  ProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

import {
  ProjectsRemotePersistenceError,
} from "./projects-remote-persistence-adapter";

export type ProjectsPersistenceSource =
  | "remote"
  | "local"
  | "none";

export type ProjectsPersistenceSyncState =
  | "synchronized"
  | "pending"
  | "local-only"
  | "missing";

export interface ProjectsPersistenceReadResult<
  TValue,
> {
  readonly record:
    ProjectsPersistenceRecord<TValue> |
    null;
  readonly source:
    ProjectsPersistenceSource;
  readonly syncState:
    ProjectsPersistenceSyncState;
  readonly remoteError:
    Error | null;
}

export interface ProjectsPersistenceWriteResult {
  readonly synchronized: boolean;
  readonly localSaved: boolean;
  readonly remoteSaved: boolean;
  readonly syncState:
    ProjectsPersistenceSyncState;
  readonly remoteError:
    Error | null;
}

export interface ProjectsPersistenceRemoveResult {
  readonly synchronized: boolean;
  readonly localRemoved: boolean;
  readonly remoteRemoved: boolean;
  readonly syncState:
    ProjectsPersistenceSyncState;
  readonly remoteError:
    Error | null;
}

export interface ProjectsPersistenceOrchestrator {
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
    ProjectsPersistenceWriteResult
  >;

  remove(
    area:
      ProjectsPersistenceArea,
  ): Promise<
    ProjectsPersistenceRemoveResult
  >;

  clear(): Promise<void>;

  synchronizeArea(
    area:
      ProjectsPersistenceArea,
  ): Promise<
    ProjectsPersistenceWriteResult
  >;

  synchronizeAll(): Promise<
    readonly ProjectsPersistenceWriteResult[]
  >;
}

export interface CreateProjectsPersistenceOrchestratorOptions {
  readonly remote:
    ProjectsPersistenceGateway;
  readonly local:
    ProjectsPersistenceGateway;
  readonly preferRemoteReads?: boolean;
  readonly mirrorRemoteReadsLocally?: boolean;
}

const PERSISTENCE_AREAS:
  readonly ProjectsPersistenceArea[] = [
  "workspace-preferences",
  "project-assets",
  "assistant-conversations",
];

function isRecoverableRemoteError(
  error: unknown,
): boolean {
  if (
    error instanceof
    ProjectsRemotePersistenceError
  ) {
    return (
      error.code ===
        "timeout" ||
      error.code ===
        "network" ||
      (
        error.code ===
          "http" &&
        (
          error.status === null ||
          error.status >= 500
        )
      )
    );
  }

  return (
    error instanceof Error
  );
}

function toError(
  error: unknown,
): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(
    "Unknown projects persistence error.",
  );
}

function compareRecordFreshness(
  left:
    ProjectsPersistenceRecord<unknown>,
  right:
    ProjectsPersistenceRecord<unknown>,
): number {
  if (
    left.version !==
    right.version
  ) {
    return (
      left.version -
      right.version
    );
  }

  const leftTime =
    Date.parse(
      left.updatedAt,
    );

  const rightTime =
    Date.parse(
      right.updatedAt,
    );

  const safeLeft =
    Number.isFinite(leftTime)
      ? leftTime
      : 0;

  const safeRight =
    Number.isFinite(rightTime)
      ? rightTime
      : 0;

  return (
    safeLeft -
    safeRight
  );
}

export function createProjectsPersistenceOrchestrator(
  options:
    CreateProjectsPersistenceOrchestratorOptions,
): ProjectsPersistenceOrchestrator {
  const {
    remote,
    local,
    preferRemoteReads = true,
    mirrorRemoteReadsLocally = true,
  } = options;

  if (
    remote.kind !==
    "remote"
  ) {
    throw new Error(
      "Projects persistence orchestrator requires a remote gateway.",
    );
  }

  if (
    local.kind ===
    "remote"
  ) {
    throw new Error(
      "Projects persistence fallback gateway must be local or memory.",
    );
  }

  async function readRemote<TValue>(
    area:
      ProjectsPersistenceArea,
  ): Promise<
    ProjectsPersistenceRecord<TValue> |
    null
  > {
    return remote.read<TValue>(
      area,
    );
  }

  async function readLocal<TValue>(
    area:
      ProjectsPersistenceArea,
  ): Promise<
    ProjectsPersistenceRecord<TValue> |
    null
  > {
    return local.read<TValue>(
      area,
    );
  }

  return {
    async read<TValue>(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceReadResult<TValue>
    > {
      if (!preferRemoteReads) {
        const localRecord =
          await readLocal<TValue>(
            area,
          );

        if (localRecord) {
          return {
            record:
              localRecord,
            source:
              "local",
            syncState:
              "pending",
            remoteError:
              null,
          };
        }
      }

      try {
        const remoteRecord =
          await readRemote<TValue>(
            area,
          );

        if (remoteRecord) {
          const localRecord =
            await readLocal<TValue>(
              area,
            );

          if (
            mirrorRemoteReadsLocally &&
            (
              !localRecord ||
              compareRecordFreshness(
                remoteRecord,
                localRecord,
              ) >= 0
            )
          ) {
            await local.write(
              remoteRecord,
            );
          }

          return {
            record:
              remoteRecord,
            source:
              "remote",
            syncState:
              "synchronized",
            remoteError:
              null,
          };
        }

        const localRecord =
          await readLocal<TValue>(
            area,
          );

        if (localRecord) {
          return {
            record:
              localRecord,
            source:
              "local",
            syncState:
              "pending",
            remoteError:
              null,
          };
        }

        return {
          record: null,
          source: "none",
          syncState:
            "missing",
          remoteError:
            null,
        };
      }
      catch (error: unknown) {
        if (
          !isRecoverableRemoteError(
            error,
          )
        ) {
          throw error;
        }

        const localRecord =
          await readLocal<TValue>(
            area,
          );

        return {
          record:
            localRecord,
          source:
            localRecord
              ? "local"
              : "none",
          syncState:
            localRecord
              ? "local-only"
              : "missing",
          remoteError:
            toError(error),
        };
      }
    },

    async write<TValue>(
      record:
        ProjectsPersistenceRecord<TValue>,
    ): Promise<
      ProjectsPersistenceWriteResult
    > {
      await local.write(
        record,
      );

      try {
        await remote.write(
          record,
        );

        return {
          synchronized: true,
          localSaved: true,
          remoteSaved: true,
          syncState:
            "synchronized",
          remoteError:
            null,
        };
      }
      catch (error: unknown) {
        if (
          !isRecoverableRemoteError(
            error,
          )
        ) {
          throw error;
        }

        return {
          synchronized: false,
          localSaved: true,
          remoteSaved: false,
          syncState:
            "pending",
          remoteError:
            toError(error),
        };
      }
    },

    async remove(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceRemoveResult
    > {
      await local.remove(
        area,
      );

      try {
        await remote.remove(
          area,
        );

        return {
          synchronized: true,
          localRemoved: true,
          remoteRemoved: true,
          syncState:
            "synchronized",
          remoteError:
            null,
        };
      }
      catch (error: unknown) {
        if (
          !isRecoverableRemoteError(
            error,
          )
        ) {
          throw error;
        }

        return {
          synchronized: false,
          localRemoved: true,
          remoteRemoved: false,
          syncState:
            "pending",
          remoteError:
            toError(error),
        };
      }
    },

    async clear():
      Promise<void> {
      await local.clear();

      try {
        await remote.clear();
      }
      catch (error: unknown) {
        if (
          !isRecoverableRemoteError(
            error,
          )
        ) {
          throw error;
        }
      }
    },

    async synchronizeArea(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceWriteResult
    > {
      const localRecord =
        await readLocal(
          area,
        );

      if (!localRecord) {
        return {
          synchronized: true,
          localSaved: false,
          remoteSaved: false,
          syncState:
            "missing",
          remoteError:
            null,
        };
      }

      try {
        const remoteRecord =
          await readRemote(
            area,
          );

        if (
          remoteRecord &&
          compareRecordFreshness(
            remoteRecord,
            localRecord,
          ) > 0
        ) {
          await local.write(
            remoteRecord,
          );

          return {
            synchronized: true,
            localSaved: true,
            remoteSaved: false,
            syncState:
              "synchronized",
            remoteError:
              null,
          };
        }

        await remote.write(
          localRecord,
        );

        return {
          synchronized: true,
          localSaved: true,
          remoteSaved: true,
          syncState:
            "synchronized",
          remoteError:
            null,
        };
      }
      catch (error: unknown) {
        if (
          !isRecoverableRemoteError(
            error,
          )
        ) {
          throw error;
        }

        return {
          synchronized: false,
          localSaved: true,
          remoteSaved: false,
          syncState:
            "pending",
          remoteError:
            toError(error),
        };
      }
    },

    async synchronizeAll():
      Promise<
        readonly ProjectsPersistenceWriteResult[]
      > {
      const results:
        ProjectsPersistenceWriteResult[] = [];

      for (
        const area of
        PERSISTENCE_AREAS
      ) {
        results.push(
          await this.synchronizeArea(
            area,
          ),
        );
      }

      return results;
    },
  };
}
