import {
  describe,
  expect,
  it,
} from "vitest";

import {
  archiveProjectAsset,
  createProjectAsset,
  deleteProjectAsset,
  detectProjectAssetKind,
  filterProjectAssets,
  formatProjectAssetSize,
  queryProjectAssets,
  restoreProjectAsset,
  summarizeProjectAssets,
  toggleProjectAssetPinned,
  updateProjectAsset,
} from "./project-assets-engine";

const image =
  createProjectAsset({
    id: "asset-image",
    projectId:
      "project-assets",
    name: "Thumbnail.PNG",
    mimeType: "image/png",
    sizeBytes: 2048,
    createdAt:
      "2026-08-01T08:00:00.000Z",
    description:
      "Primary thumbnail",
    tags: [
      "Thumbnail",
      "YouTube",
    ],
  });

const video =
  createProjectAsset({
    id: "asset-video",
    projectId:
      "project-assets",
    name: "episode.mp4",
    mimeType: "video/mp4",
    sizeBytes: 5_000_000,
    createdAt:
      "2026-08-02T08:00:00.000Z",
  });

describe(
  "project assets engine",
  () => {
    it(
      "detects asset kinds",
      () => {
        expect(
          detectProjectAssetKind(
            "cover.jpg",
          ),
        ).toBe("image");

        expect(
          detectProjectAssetKind(
            "episode.mp4",
          ),
        ).toBe("video");

        expect(
          detectProjectAssetKind(
            "brief.pdf",
          ),
        ).toBe("document");

        expect(
          detectProjectAssetKind(
            "bundle.zip",
          ),
        ).toBe("archive");
      },
    );

    it(
      "creates normalized assets",
      () => {
        expect(image.extension)
          .toBe("png");

        expect(image.kind)
          .toBe("image");

        expect(image.tags)
          .toEqual([
            "thumbnail",
            "youtube",
          ]);

        expect(image.status)
          .toBe("active");
      },
    );

    it(
      "updates asset metadata",
      () => {
        const updated =
          updateProjectAsset(
            image,
            {
              name:
                "New Cover.webp",
              description:
                "Updated",
              tags: [
                "Cover",
              ],
            },
            "2026-08-03T08:00:00.000Z",
          );

        expect(updated.kind)
          .toBe("image");

        expect(updated.extension)
          .toBe("webp");

        expect(updated.tags)
          .toEqual([
            "cover",
          ]);
      },
    );

    it(
      "pins archives deletes and restores",
      () => {
        const pinned =
          toggleProjectAssetPinned(
            image,
          );

        expect(pinned.pinned)
          .toBe(true);

        expect(
          archiveProjectAsset(
            pinned,
          ).status,
        ).toBe("archived");

        expect(
          deleteProjectAsset(
            pinned,
          ).status,
        ).toBe("deleted");

        expect(
          restoreProjectAsset(
            deleteProjectAsset(
              pinned,
            ),
          ).status,
        ).toBe("active");
      },
    );

    it(
      "filters assets",
      () => {
        expect(
          filterProjectAssets(
            [
              image,
              video,
            ],
            {
              query:
                "thumbnail",
            },
          ),
        ).toEqual([
          image,
        ]);

        expect(
          filterProjectAssets(
            [
              image,
              video,
            ],
            {
              kinds: [
                "video",
              ],
            },
          ),
        ).toEqual([
          video,
        ]);
      },
    );

    it(
      "sorts pinned assets first",
      () => {
        const result =
          queryProjectAssets(
            [
              image,
              toggleProjectAssetPinned(
                video,
              ),
            ],
          );

        expect(
          result[0]?.id,
        ).toBe(
          "asset-video",
        );
      },
    );

    it(
      "summarizes assets",
      () => {
        const summary =
          summarizeProjectAssets([
            image,
            toggleProjectAssetPinned(
              video,
            ),
          ]);

        expect(summary.total)
          .toBe(2);

        expect(summary.active)
          .toBe(2);

        expect(summary.pinned)
          .toBe(1);

        expect(
          summary.byKind.image,
        ).toBe(1);

        expect(
          summary.byKind.video,
        ).toBe(1);
      },
    );

    it(
      "formats file sizes",
      () => {
        expect(
          formatProjectAssetSize(
            512,
          ),
        ).toBe("512 B");

        expect(
          formatProjectAssetSize(
            2048,
          ),
        ).toBe("2.00 KB");

        expect(
          formatProjectAssetSize(
            5_242_880,
          ),
        ).toBe("5.00 MB");
      },
    );
  },
);
