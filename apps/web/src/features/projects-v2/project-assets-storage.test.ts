import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createProjectAsset,
} from "./project-assets-engine";

import {
  loadAssetsForProject,
  loadProjectAssets,
  PROJECT_ASSETS_STORAGE_KEY,
  replaceAssetsForProject,
  saveProjectAssets,
} from "./project-assets-storage";

const asset =
  createProjectAsset({
    id: "asset-storage",
    projectId:
      "project-storage",
    name: "file.pdf",
    mimeType:
      "application/pdf",
    createdAt:
      "2026-08-01T08:00:00.000Z",
  });

describe(
  "project assets storage",
  () => {
    it(
      "returns empty assets for missing storage",
      () => {
        expect(
          loadProjectAssets({
            getItem:
              () => null,
          }),
        ).toEqual([]);
      },
    );

    it(
      "saves and loads assets",
      () => {
        let stored:
          string | null = null;

        const storage = {
          getItem:
            () => stored,
          setItem:
            (
              key: string,
              value: string,
            ) => {
              expect(key)
                .toBe(
                  PROJECT_ASSETS_STORAGE_KEY,
                );

              stored = value;
            },
        };

        saveProjectAssets(
          [asset],
          storage,
        );

        expect(
          loadProjectAssets(
            storage,
          ),
        ).toEqual([
          asset,
        ]);
      },
    );

    it(
      "filters assets by project",
      () => {
        const other = {
          ...asset,
          id: "other",
          projectId: "other",
        };

        const storage = {
          getItem: () =>
            JSON.stringify({
              version: 1,
              assets: [
                asset,
                other,
              ],
            }),
        };

        expect(
          loadAssetsForProject(
            "project-storage",
            storage,
          ),
        ).toEqual([
          asset,
        ]);
      },
    );

    it(
      "replaces only one project assets",
      () => {
        const other = {
          ...asset,
          id: "other",
          projectId: "other",
        };

        let stored =
          JSON.stringify({
            version: 1,
            assets: [
              asset,
              other,
            ],
          });

        const storage = {
          getItem:
            () => stored,
          setItem:
            vi.fn(
              (
                _key: string,
                value: string,
              ) => {
                stored = value;
              },
            ),
        };

        const replacement = {
          ...asset,
          id: "replacement",
        };

        replaceAssetsForProject(
          "project-storage",
          [replacement],
          storage,
        );

        expect(
          loadProjectAssets(
            storage,
          ).map(
            (item) =>
              item.id,
          ),
        ).toEqual([
          "other",
          "replacement",
        ]);
      },
    );

    it(
      "handles malformed JSON",
      () => {
        expect(
          loadProjectAssets({
            getItem:
              () => "{broken",
          }),
        ).toEqual([]);
      },
    );
  },
);
