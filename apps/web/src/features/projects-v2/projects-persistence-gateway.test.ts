import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createLocalProjectsPersistenceGateway,
  createMemoryProjectsPersistenceGateway,
  createProjectsPersistenceRecord,
  migrateProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

describe(
  "projects persistence gateway",
  () => {
    it(
      "creates normalized records",
      () => {
        const record =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [],
            },
            2,
            "2026-08-03T10:05:00+04:00",
          );

        expect(record.version)
          .toBe(2);

        expect(record.area)
          .toBe(
            "project-assets",
          );

        expect(record.updatedAt)
          .toBe(
            "2026-08-03T06:05:00.000Z",
          );
      },
    );

    it(
      "rejects invalid versions",
      () => {
        expect(
          () =>
            createProjectsPersistenceRecord(
              "project-assets",
              [],
              0,
            ),
        ).toThrow(
          "Persistence version must be a positive integer.",
        );
      },
    );

    it(
      "writes and reads local records",
      async () => {
        const values =
          new Map<
            string,
            string
          >();

        const storage = {
          getItem:
            (
              key: string,
            ) =>
              values.get(key) ??
              null,

          setItem:
            (
              key: string,
              value: string,
            ) => {
              values.set(
                key,
                value,
              );
            },

          removeItem:
            (
              key: string,
            ) => {
              values.delete(
                key,
              );
            },
        };

        const gateway =
          createLocalProjectsPersistenceGateway({
            storage,
            keyPrefix:
              "test.projects",
          });

        const record =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "kanban",
            },
          );

        await gateway.write(
          record,
        );

        await expect(
          gateway.read(
            "workspace-preferences",
          ),
        ).resolves.toEqual(
          record,
        );
      },
    );

    it(
      "returns null for malformed local data",
      async () => {
        const gateway =
          createLocalProjectsPersistenceGateway({
            storage: {
              getItem:
                () =>
                  "{broken",
              setItem:
                vi.fn(),
              removeItem:
                vi.fn(),
            },
          });

        await expect(
          gateway.read(
            "project-assets",
          ),
        ).resolves.toBeNull();
      },
    );

    it(
      "removes and clears local records",
      async () => {
        const removeItem =
          vi.fn();

        const gateway =
          createLocalProjectsPersistenceGateway({
            storage: {
              getItem:
                () => null,
              setItem:
                vi.fn(),
              removeItem,
            },
          });

        await gateway.remove(
          "project-assets",
        );

        expect(
          removeItem,
        ).toHaveBeenCalledTimes(
          1,
        );

        await gateway.clear();

        expect(
          removeItem,
        ).toHaveBeenCalledTimes(
          4,
        );
      },
    );

    it(
      "stores records in memory",
      async () => {
        const gateway =
          createMemoryProjectsPersistenceGateway();

        const record =
          createProjectsPersistenceRecord(
            "assistant-conversations",
            {
              messages: [
                "hello",
              ],
            },
          );

        await gateway.write(
          record,
        );

        await expect(
          gateway.read(
            "assistant-conversations",
          ),
        ).resolves.toEqual(
          record,
        );

        await gateway.clear();

        await expect(
          gateway.read(
            "assistant-conversations",
          ),
        ).resolves.toBeNull();
      },
    );

    it(
      "migrates older records",
      async () => {
        const gateway =
          createMemoryProjectsPersistenceGateway();

        await gateway.write(
          createProjectsPersistenceRecord(
            "project-assets",
            {
              items: [
                "old",
              ],
            },
            1,
          ),
        );

        const migrated =
          await migrateProjectsPersistenceRecord<
            {
              readonly items:
                readonly string[];
            },
            {
              readonly assets:
                readonly string[];
            }
          >(
            gateway,
            "project-assets",
            2,
            (
              current,
            ) => ({
              assets:
                current.value.items,
            }),
          );

        expect(
          migrated?.version,
        ).toBe(2);

        expect(
          migrated?.value,
        ).toEqual({
          assets: [
            "old",
          ],
        });
      },
    );

    it(
      "rejects downgrade migrations",
      async () => {
        const gateway =
          createMemoryProjectsPersistenceGateway();

        await gateway.write(
          createProjectsPersistenceRecord(
            "project-assets",
            [],
            3,
          ),
        );

        await expect(
          migrateProjectsPersistenceRecord(
            gateway,
            "project-assets",
            2,
            () => [],
          ),
        ).rejects.toThrow(
          "Stored projects data uses a newer schema version.",
        );
      },
    );
  },
);
