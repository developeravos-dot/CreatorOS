import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  PROJECT_AI_ASSISTANT_STORAGE_KEY,
} from "./project-ai-assistant-storage";

import {
  PROJECT_ASSETS_STORAGE_KEY,
} from "./project-assets-storage";

import {
  PROJECTS_WORKSPACE_STORAGE_KEY,
} from "./projects-workspace-storage";

import {
  createMemoryProjectsPersistenceGateway,
  createProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

import {
  getLegacyProjectsStorageKeys,
  migrateLegacyProjectsPersistence,
  readProjectsPersistenceWithLegacyFallback,
  removeLegacyProjectsPersistence,
} from "./projects-persistence-migration";

describe(
  "projects persistence migration",
  () => {
    it(
      "exposes all legacy storage keys",
      () => {
        expect(
          getLegacyProjectsStorageKeys(),
        ).toEqual([
          PROJECTS_WORKSPACE_STORAGE_KEY,
          PROJECT_ASSETS_STORAGE_KEY,
          PROJECT_AI_ASSISTANT_STORAGE_KEY,
        ]);
      },
    );

    it(
      "migrates all available legacy records",
      async () => {
        const gateway =
          createMemoryProjectsPersistenceGateway();

        const values =
          new Map<
            string,
            string
          >([
            [
              PROJECTS_WORKSPACE_STORAGE_KEY,
              JSON.stringify({
                viewMode:
                  "kanban",
              }),
            ],
            [
              PROJECT_ASSETS_STORAGE_KEY,
              JSON.stringify({
                version: 1,
                assets: [],
              }),
            ],
            [
              PROJECT_AI_ASSISTANT_STORAGE_KEY,
              JSON.stringify({
                version: 1,
                conversations: [],
              }),
            ],
          ]);

        const result =
          await migrateLegacyProjectsPersistence(
            gateway,
            {
              getItem:
                (
                  key: string,
                ) =>
                  values.get(key) ??
                  null,
            },
          );

        expect(
          result.completed,
        ).toBe(true);

        expect(
          result.migratedCount,
        ).toBe(3);

        expect(
          result.skippedCount,
        ).toBe(0);

        await expect(
          gateway.read(
            "workspace-preferences",
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            area:
              "workspace-preferences",
            version: 1,
          }),
        );
      },
    );

    it(
      "skips missing legacy values",
      async () => {
        const result =
          await migrateLegacyProjectsPersistence(
            createMemoryProjectsPersistenceGateway(),
            {
              getItem:
                () => null,
            },
          );

        expect(
          result.migratedCount,
        ).toBe(0);

        expect(
          result.skippedCount,
        ).toBe(3);

        expect(
          result.items.every(
            (item) =>
              item.reason ===
              "missing",
          ),
        ).toBe(true);
      },
    );

    it(
      "does not overwrite existing gateway records",
      async () => {
        const gateway =
          createMemoryProjectsPersistenceGateway();

        await gateway.write(
          createProjectsPersistenceRecord(
            "project-assets",
            {
              version: 2,
              assets: [
                "current",
              ],
            },
            2,
          ),
        );

        const result =
          await migrateLegacyProjectsPersistence(
            gateway,
            {
              getItem:
                (
                  key: string,
                ) =>
                  key ===
                  PROJECT_ASSETS_STORAGE_KEY
                    ? JSON.stringify({
                        version: 1,
                        assets: [
                          "legacy",
                        ],
                      })
                    : null,
            },
          );

        const assetItem =
          result.items.find(
            (item) =>
              item.area ===
              "project-assets",
          );

        expect(
          assetItem?.reason,
        ).toBe(
          "already-migrated",
        );

        await expect(
          gateway.read(
            "project-assets",
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            version: 2,
            value: {
              version: 2,
              assets: [
                "current",
              ],
            },
          }),
        );
      },
    );

    it(
      "marks malformed legacy JSON",
      async () => {
        const result =
          await migrateLegacyProjectsPersistence(
            createMemoryProjectsPersistenceGateway(),
            {
              getItem:
                (
                  key: string,
                ) =>
                  key ===
                  PROJECT_ASSETS_STORAGE_KEY
                    ? "{broken"
                    : null,
            },
          );

        expect(
          result.items.find(
            (item) =>
              item.area ===
              "project-assets",
          )?.reason,
        ).toBe("malformed");
      },
    );

    it(
      "reads gateway values before legacy fallback",
      async () => {
        const gateway =
          createMemoryProjectsPersistenceGateway();

        await gateway.write(
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "table",
            },
          ),
        );

        const value =
          await readProjectsPersistenceWithLegacyFallback<{
            readonly viewMode:
              string;
          }>(
            gateway,
            "workspace-preferences",
            {
              getItem:
                () =>
                  JSON.stringify({
                    viewMode:
                      "kanban",
                  }),
            },
          );

        expect(value)
          .toEqual({
            viewMode:
              "table",
          });
      },
    );

    it(
      "uses legacy fallback when gateway is empty",
      async () => {
        const value =
          await readProjectsPersistenceWithLegacyFallback<{
            readonly viewMode:
              string;
          }>(
            createMemoryProjectsPersistenceGateway(),
            "workspace-preferences",
            {
              getItem:
                (
                  key: string,
                ) =>
                  key ===
                  PROJECTS_WORKSPACE_STORAGE_KEY
                    ? JSON.stringify({
                        viewMode:
                          "kanban",
                      })
                    : null,
            },
          );

        expect(value)
          .toEqual({
            viewMode:
              "kanban",
          });
      },
    );

    it(
      "removes all legacy records",
      async () => {
        const removeItem =
          vi.fn();

        await removeLegacyProjectsPersistence({
          getItem:
            () => null,
          removeItem,
        });

        expect(
          removeItem,
        ).toHaveBeenCalledTimes(
          3,
        );

        expect(
          removeItem,
        ).toHaveBeenCalledWith(
          PROJECTS_WORKSPACE_STORAGE_KEY,
        );

        expect(
          removeItem,
        ).toHaveBeenCalledWith(
          PROJECT_ASSETS_STORAGE_KEY,
        );

        expect(
          removeItem,
        ).toHaveBeenCalledWith(
          PROJECT_AI_ASSISTANT_STORAGE_KEY,
        );
      },
    );
  },
);
