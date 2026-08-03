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
  type ProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

import {
  createProjectsPersistenceOrchestrator,
} from "./projects-persistence-orchestrator";

import {
  ProjectsRemotePersistenceError,
} from "./projects-remote-persistence-adapter";

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
  "projects persistence orchestrator",
  () => {
    it(
      "requires remote and fallback gateway roles",
      () => {
        const memory =
          createMemoryProjectsPersistenceGateway();

        expect(
          () =>
            createProjectsPersistenceOrchestrator({
              remote:
                memory,
              local:
                memory,
            }),
        ).toThrow(
          "Projects persistence orchestrator requires a remote gateway.",
        );

        expect(
          () =>
            createProjectsPersistenceOrchestrator({
              remote:
                createRemoteGateway(),
              local:
                createRemoteGateway(),
            }),
        ).toThrow(
          "Projects persistence fallback gateway must be local or memory.",
        );
      },
    );

    it(
      "reads remote records and mirrors them locally",
      async () => {
        const record =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "kanban",
            },
            1,
            "2026-08-03T10:00:00.000Z",
          );

        const local =
          createMemoryProjectsPersistenceGateway();

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                async read<TValue>() {
                  return record as unknown as
                    ProjectsPersistenceRecord<TValue>;
                },
              }),
            local,
          });

        const result =
          await orchestrator.read(
            "workspace-preferences",
          );

        expect(result)
          .toEqual({
            record,
            source: "remote",
            syncState:
              "synchronized",
            remoteError:
              null,
          });

        await expect(
          local.read(
            "workspace-preferences",
          ),
        ).resolves.toEqual(
          record,
        );
      },
    );

    it(
      "falls back to local records when remote fails",
      async () => {
        const record =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [
                "local",
              ],
            },
          );

        const local =
          createMemoryProjectsPersistenceGateway();

        await local.write(
          record,
        );

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                async read() {
                  throw new ProjectsRemotePersistenceError(
                    "network",
                    "Offline",
                  );
                },
              }),
            local,
          });

        const result =
          await orchestrator.read(
            "project-assets",
          );

        expect(
          result.record,
        ).toEqual(record);

        expect(
          result.source,
        ).toBe("local");

        expect(
          result.syncState,
        ).toBe(
          "local-only",
        );

        expect(
          result.remoteError
            ?.message,
        ).toBe("Offline");
      },
    );

    it(
      "writes locally before remote",
      async () => {
        const calls:
          string[] = [];

        const record =
          createProjectsPersistenceRecord(
            "assistant-conversations",
            {
              messages: [],
            },
          );

        const local:
          ProjectsPersistenceGateway = {
          kind: "memory",

          async read() {
            return null;
          },

          async write() {
            calls.push(
              "local",
            );
          },

          async remove() {
            return undefined;
          },

          async clear() {
            return undefined;
          },
        };

        const remote =
          createRemoteGateway({
            async write() {
              calls.push(
                "remote",
              );
            },
          });

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote,
            local,
          });

        const result =
          await orchestrator.write(
            record,
          );

        expect(calls)
          .toEqual([
            "local",
            "remote",
          ]);

        expect(
          result.synchronized,
        ).toBe(true);
      },
    );

    it(
      "keeps local writes pending when remote is offline",
      async () => {
        const local =
          createMemoryProjectsPersistenceGateway();

        const record =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [
                "offline",
              ],
            },
          );

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                async write() {
                  throw new ProjectsRemotePersistenceError(
                    "network",
                    "Offline",
                  );
                },
              }),
            local,
          });

        const result =
          await orchestrator.write(
            record,
          );

        expect(
          result.localSaved,
        ).toBe(true);

        expect(
          result.remoteSaved,
        ).toBe(false);

        expect(
          result.syncState,
        ).toBe("pending");

        await expect(
          local.read(
            "project-assets",
          ),
        ).resolves.toEqual(
          record,
        );
      },
    );

    it(
      "does not swallow non-recoverable remote errors",
      async () => {
        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                async write() {
                  throw new ProjectsRemotePersistenceError(
                    "invalid-record",
                    "Invalid",
                  );
                },
              }),
            local:
              createMemoryProjectsPersistenceGateway(),
          });

        await expect(
          orchestrator.write(
            createProjectsPersistenceRecord(
              "project-assets",
              [],
            ),
          ),
        ).rejects.toMatchObject({
          code:
            "invalid-record",
        });
      },
    );

    it(
      "removes locally and remotely",
      async () => {
        const localRemove =
          vi.fn(
            async () =>
              undefined,
          );

        const remoteRemove =
          vi.fn(
            async () =>
              undefined,
          );

        const local:
          ProjectsPersistenceGateway = {
          kind: "memory",

          async read() {
            return null;
          },

          async write() {
            return undefined;
          },

          remove:
            localRemove,

          async clear() {
            return undefined;
          },
        };

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                remove:
                  remoteRemove,
              }),
            local,
          });

        const result =
          await orchestrator.remove(
            "workspace-preferences",
          );

        expect(
          localRemove,
        ).toHaveBeenCalledWith(
          "workspace-preferences",
        );

        expect(
          remoteRemove,
        ).toHaveBeenCalledWith(
          "workspace-preferences",
        );

        expect(
          result.synchronized,
        ).toBe(true);
      },
    );

    it(
      "synchronizes a pending local record",
      async () => {
        const record =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [
                "pending",
              ],
            },
          );

        const local =
          createMemoryProjectsPersistenceGateway();

        await local.write(
          record,
        );

        const remoteWrite =
          vi.fn(
            async () =>
              undefined,
          );

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                write:
                  remoteWrite,
              }),
            local,
          });

        const result =
          await orchestrator.synchronizeArea(
            "project-assets",
          );

        expect(
          remoteWrite,
        ).toHaveBeenCalledWith(
          record,
        );

        expect(
          result.synchronized,
        ).toBe(true);
      },
    );

    it(
      "keeps a newer remote record during synchronization",
      async () => {
        const localRecord =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              value:
                "local",
            },
            1,
            "2026-08-03T08:00:00.000Z",
          );

        const remoteRecord =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              value:
                "remote",
            },
            1,
            "2026-08-03T09:00:00.000Z",
          );

        const local =
          createMemoryProjectsPersistenceGateway();

        await local.write(
          localRecord,
        );

        const remoteWrite =
          vi.fn();

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway({
                async read<TValue>() {
                  return remoteRecord as unknown as
                    ProjectsPersistenceRecord<TValue>;
                },
                write:
                  remoteWrite,
              }),
            local,
          });

        await orchestrator.synchronizeArea(
          "workspace-preferences",
        );

        await expect(
          local.read(
            "workspace-preferences",
          ),
        ).resolves.toEqual(
          remoteRecord,
        );

        expect(
          remoteWrite,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "synchronizes all persistence areas",
      async () => {
        const local =
          createMemoryProjectsPersistenceGateway();

        await local.write(
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {},
          ),
        );

        const orchestrator =
          createProjectsPersistenceOrchestrator({
            remote:
              createRemoteGateway(),
            local,
          });

        const results =
          await orchestrator.synchronizeAll();

        expect(results)
          .toHaveLength(3);

        expect(
          results[0]
            ?.syncState,
        ).toBe(
          "synchronized",
        );

        expect(
          results[1]
            ?.syncState,
        ).toBe("missing");
      },
    );
  },
);
