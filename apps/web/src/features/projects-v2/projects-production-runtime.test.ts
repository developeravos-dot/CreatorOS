import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createMemoryProjectsPersistenceGateway,
  createProjectsPersistenceRecord,
  type ProjectsPersistenceGateway,
} from "./projects-persistence-gateway";

import {
  createProjectAccessPolicy,
  type ProjectPrincipal,
} from "./projects-permissions-engine";

import {
  createProjectsProductionRuntime,
} from "./projects-production-runtime";

import {
  ProjectsRemotePersistenceError,
} from "./projects-remote-persistence-adapter";

function createQueueStorage() {
  let snapshot = {
    version:
      1 as const,
    items: [],
  };

  return {
    load() {
      return snapshot;
    },

    save(
      next:
        typeof snapshot,
    ) {
      snapshot = next;
    },

    clear() {
      snapshot = {
        version: 1,
        items: [],
      };
    },
  };
}

function createRemoteGateway(
  overrides:
    Partial<
      ProjectsPersistenceGateway
    > = {},
): ProjectsPersistenceGateway {
  return {
    kind: "remote",

    async read() {
      return null;
    },

    async write() {
      return undefined;
    },

    async remove() {
      return undefined;
    },

    async clear() {
      return undefined;
    },

    ...overrides,
  };
}

describe(
  "projects production runtime",
  () => {
    it(
      "initializes all persistence areas",
      async () => {
        const read =
          vi.fn(
            async () =>
              null,
          );

        const runtime =
          createProjectsProductionRuntime({
            remote:
              createRemoteGateway({
                read,
              }),
            local:
              createMemoryProjectsPersistenceGateway(),
            queueStorage:
              createQueueStorage(),
            isOnline:
              () => true,
          });

        const result =
          await runtime.initialize();

        expect(result.status)
          .toBe("ready");

        expect(
          result.synchronizedAreas,
        ).toBe(3);

        expect(
          runtime
            .getSnapshot()
            .initialized,
        ).toBe(true);
      },
    );

    it(
      "queues writes when remote is unavailable",
      async () => {
        const runtime =
          createProjectsProductionRuntime({
            remote:
              createRemoteGateway({
                async write() {
                  throw new ProjectsRemotePersistenceError(
                    "network",
                    "Offline",
                  );
                },
              }),
            local:
              createMemoryProjectsPersistenceGateway(),
            queueStorage:
              createQueueStorage(),
            isOnline:
              () => false,
          });

        const result =
          await runtime.write(
            createProjectsPersistenceRecord(
              "project-assets",
              {
                assets: [
                  "offline",
                ],
              },
            ),
          );

        expect(result.queued)
          .toBe(true);

        expect(
          runtime
            .getSnapshot()
            .pendingOperations,
        ).toBe(1);

        expect(
          runtime
            .getSnapshot()
            .status,
        ).toBe("degraded");
      },
    );

    it(
      "synchronizes queued operations",
      async () => {
        let online = false;

        const remoteWrite =
          vi.fn(
            async (
              _record: unknown,
            ) =>
              undefined,
          );

        const runtime =
          createProjectsProductionRuntime({
            remote:
              createRemoteGateway({
                async write(
                  record,
                ) {
                  if (!online) {
                    throw new ProjectsRemotePersistenceError(
                      "network",
                      "Offline",
                    );
                  }

                  await remoteWrite(
                    record,
                  );
                },
              }),
            local:
              createMemoryProjectsPersistenceGateway(),
            queueStorage:
              createQueueStorage(),
            isOnline:
              () => online,
          });

        await runtime.write(
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "kanban",
            },
          ),
        );

        online = true;

        const result =
          await runtime.synchronize();

        expect(result)
          .toEqual({
            processed: 1,
            succeeded: 1,
            failed: 0,
            remaining: 0,
          });

        expect(
          remoteWrite,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "resolves and persists conflicts",
      async () => {
        const runtime =
          createProjectsProductionRuntime({
            remote:
              createRemoteGateway(),
            local:
              createMemoryProjectsPersistenceGateway(),
            queueStorage:
              createQueueStorage(),
            conflictStrategy:
              "merge",
            now:
              () =>
                "2026-08-03T11:00:00.000Z",
          });

        type WorkspaceConflictValue = {
          readonly layout: string;
          readonly filters: {
            readonly status?: string;
            readonly query?: string;
          };
        };

        const local =
          createProjectsPersistenceRecord<
            WorkspaceConflictValue
          >(
            "workspace-preferences",
            {
              layout:
                "kanban",
              filters: {
                status:
                  "active",
              },
            },
            1,
            "2026-08-03T09:00:00.000Z",
          );

        const remote =
          createProjectsPersistenceRecord<
            WorkspaceConflictValue
          >(
            "workspace-preferences",
            {
              layout:
                "table",
              filters: {
                query:
                  "video",
              },
            },
            1,
            "2026-08-03T10:00:00.000Z",
          );

        const result =
          await runtime.resolveConflict(
            local,
            remote,
          );

        expect(result.conflict)
          .toBe(true);

        expect(
          result.resolution
            ?.winner,
        ).toBe("merged");

        expect(result.persisted)
          .toBe(true);
      },
    );

    it(
      "evaluates project permissions",
      () => {
        const owner:
          ProjectPrincipal = {
          id: "owner",
          type: "user",
          displayName:
            "Owner",
        };

        const policy =
          createProjectAccessPolicy(
            "project-runtime",
            owner,
          );

        const runtime =
          createProjectsProductionRuntime({
            remote:
              createRemoteGateway(),
            local:
              createMemoryProjectsPersistenceGateway(),
            queueStorage:
              createQueueStorage(),
          });

        expect(
          runtime.can(
            policy,
            owner,
            "project.delete",
          ),
        ).toBe(true);

        expect(
          runtime.evaluatePermission(
            policy,
            owner,
            "project.manage-permissions",
          ).source,
        ).toBe("owner");
      },
    );

    it(
      "reports degraded initialization while offline",
      async () => {
        const runtime =
          createProjectsProductionRuntime({
            remote:
              createRemoteGateway({
                async read() {
                  throw new ProjectsRemotePersistenceError(
                    "network",
                    "Offline",
                  );
                },
              }),
            local:
              createMemoryProjectsPersistenceGateway(),
            queueStorage:
              createQueueStorage(),
            isOnline:
              () => false,
          });

        const result =
          await runtime.initialize();

        expect(result.status)
          .toBe("degraded");

        expect(
          runtime
            .getSnapshot()
            .online,
        ).toBe(false);
      },
    );
  },
);
