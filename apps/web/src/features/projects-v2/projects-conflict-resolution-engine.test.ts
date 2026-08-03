import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

import {
  analyzeProjectsConflict,
  resolveProjectsConflict,
  resolveProjectsPersistenceRecords,
} from "./projects-conflict-resolution-engine";

describe(
  "projects conflict resolution engine",
  () => {
    it(
      "rejects records from different areas",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "project-assets",
            {},
          );

        const remote =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {},
          );

        expect(
          () =>
            analyzeProjectsConflict(
              local,
              remote,
            ),
        ).toThrow(
          "Cannot compare persistence records from different areas.",
        );
      },
    );

    it(
      "recognizes equivalent values regardless of object key order",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              viewMode:
                "kanban",
              density:
                "compact",
            },
            1,
            "2026-08-03T10:00:00.000Z",
          );

        const remote =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              density:
                "compact",
              viewMode:
                "kanban",
            },
            1,
            "2026-08-03T10:00:00.000Z",
          );

        const analysis =
          analyzeProjectsConflict(
            local,
            remote,
          );

        expect(
          analysis.conflict,
        ).toBe(false);

        expect(
          analysis.conflictType,
        ).toBe("none");

        expect(
          analysis.changedFields,
        ).toEqual([]);
      },
    );

    it(
      "detects changed nested fields",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              filters: {
                status:
                  "active",
                query:
                  "video",
              },
            },
          );

        const remote =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              filters: {
                status:
                  "paused",
                query:
                  "video",
              },
            },
          );

        const analysis =
          analyzeProjectsConflict(
            local,
            remote,
          );

        expect(
          analysis.conflict,
        ).toBe(true);

        expect(
          analysis.changedFields,
        ).toEqual([
          {
            path:
              "filters.status",
            localValue:
              "active",
            remoteValue:
              "paused",
          },
        ]);
      },
    );

    it(
      "selects the local record",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [
                "local",
              ],
            },
            1,
            "2026-08-03T10:00:00.000Z",
          );

        const remote =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [
                "remote",
              ],
            },
            1,
            "2026-08-03T10:01:00.000Z",
          );

        const resolution =
          resolveProjectsPersistenceRecords(
            local,
            remote,
            {
              strategy:
                "local-wins",
              resolvedAt:
                "2026-08-03T10:02:00.000Z",
            },
          );

        expect(
          resolution.winner,
        ).toBe("local");

        expect(
          resolution.record.value,
        ).toEqual({
          assets: [
            "local",
          ],
        });

        expect(
          resolution.record.version,
        ).toBe(2);
      },
    );

    it(
      "selects the remote record",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "assistant-conversations",
            {
              messages: [
                "local",
              ],
            },
          );

        const remote =
          createProjectsPersistenceRecord(
            "assistant-conversations",
            {
              messages: [
                "remote",
              ],
            },
          );

        const resolution =
          resolveProjectsPersistenceRecords(
            local,
            remote,
            {
              strategy:
                "remote-wins",
            },
          );

        expect(
          resolution.winner,
        ).toBe("remote");

        expect(
          resolution.record.value,
        ).toEqual({
          messages: [
            "remote",
          ],
        });
      },
    );

    it(
      "uses the highest version for newest-wins",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              value:
                "local",
            },
            3,
            "2026-08-03T08:00:00.000Z",
          );

        const remote =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              value:
                "remote",
            },
            2,
            "2026-08-03T11:00:00.000Z",
          );

        const resolution =
          resolveProjectsPersistenceRecords(
            local,
            remote,
            {
              strategy:
                "newest-wins",
            },
          );

        expect(
          resolution.winner,
        ).toBe("local");

        expect(
          resolution.record.version,
        ).toBe(4);
      },
    );

    it(
      "uses the newest timestamp when versions match",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              value:
                "local",
            },
            2,
            "2026-08-03T08:00:00.000Z",
          );

        const remote =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              value:
                "remote",
            },
            2,
            "2026-08-03T09:00:00.000Z",
          );

        const resolution =
          resolveProjectsPersistenceRecords(
            local,
            remote,
            {
              strategy:
                "newest-wins",
            },
          );

        expect(
          resolution.winner,
        ).toBe("remote");

        expect(
          resolution.record.value,
        ).toEqual({
          value:
            "remote",
        });
      },
    );

    it(
      "merges nested objects and unique arrays",
      () => {
        type AssetMergeValue = {
          readonly settings: {
            readonly layout:
              string;
            readonly sort?:
              string;
            readonly density?:
              string;
          };
          readonly tags:
            readonly string[];
        };

        const local =
          createProjectsPersistenceRecord<
            AssetMergeValue
          >(
            "project-assets",
            {
              settings: {
                layout:
                  "grid",
                sort:
                  "name",
              },
              tags: [
                "local",
                "shared",
              ],
            },
          );

        const remote =
          createProjectsPersistenceRecord<
            AssetMergeValue
          >(
            "project-assets",
            {
              settings: {
                layout:
                  "list",
                density:
                  "compact",
              },
              tags: [
                "remote",
                "shared",
              ],
            },
          );

        const resolution =
          resolveProjectsPersistenceRecords(
            local,
            remote,
            {
              strategy:
                "merge",
            },
          );

        expect(
          resolution.winner,
        ).toBe("merged");

        expect(
          resolution.record.value,
        ).toEqual({
          settings: {
            layout:
              "grid",
            density:
              "compact",
            sort:
              "name",
          },
          tags: [
            "remote",
            "shared",
            "local",
          ],
        });
      },
    );

    it(
      "preserves remote values for protected paths",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              permissions: {
                owner:
                  "local-owner",
                role:
                  "admin",
              },
              layout:
                "kanban",
            },
          );

        const remote =
          createProjectsPersistenceRecord(
            "workspace-preferences",
            {
              permissions: {
                owner:
                  "remote-owner",
                role:
                  "viewer",
              },
              layout:
                "table",
            },
          );

        const resolution =
          resolveProjectsPersistenceRecords(
            local,
            remote,
            {
              strategy:
                "merge",
              protectedPaths: [
                "permissions",
              ],
            },
          );

        expect(
          resolution.record.value,
        ).toEqual({
          permissions: {
            owner:
              "remote-owner",
            role:
              "viewer",
          },
          layout:
            "kanban",
        });
      },
    );

    it(
      "returns an equal resolution for equivalent values",
      () => {
        const local =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [],
            },
            1,
            "2026-08-03T08:00:00.000Z",
          );

        const remote =
          createProjectsPersistenceRecord(
            "project-assets",
            {
              assets: [],
            },
            2,
            "2026-08-03T09:00:00.000Z",
          );

        const analysis =
          analyzeProjectsConflict(
            local,
            remote,
          );

        const resolution =
          resolveProjectsConflict(
            analysis,
            {
              strategy:
                "merge",
              resolvedAt:
                "2026-08-03T10:00:00.000Z",
            },
          );

        expect(
          resolution.winner,
        ).toBe("equal");

        expect(
          resolution.record.version,
        ).toBe(2);

        expect(
          resolution.conflictType,
        ).toBe("none");
      },
    );
  },
);
