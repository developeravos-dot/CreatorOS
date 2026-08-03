import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  ProjectFileSystemEntry,
  ProjectFileSystemPort,
  ProjectFileSystemStat,
} from "./project-filesystem-scanner";

import {
  scanProjectFileSystem,
} from "./project-filesystem-scanner";

interface MemoryFile {
  readonly content: string;
  readonly modifiedAt?:
    string | null;
}

function normalizePath(
  value: string,
): string {
  return value
    .replace(
      /\\/g,
      "/",
    )
    .replace(
      /\/+/g,
      "/",
    )
    .replace(
      /\/$/g,
      "",
    );
}

function createMemoryPort(
  files:
    Readonly<
      Record<
        string,
        MemoryFile
      >
    >,
): ProjectFileSystemPort {
  const normalizedFiles =
    new Map(
      Object.entries(
        files,
      ).map(
        ([
          path,
          file,
        ]) => [
          normalizePath(
            path,
          ),
          file,
        ],
      ),
    );

  function directoryEntries(
    directory: string,
  ): readonly ProjectFileSystemEntry[] {
    const prefix =
      `${normalizePath(directory)}/`;

    const entries =
      new Map<
        string,
        ProjectFileSystemEntry
      >();

    for (
      const path of
      normalizedFiles.keys()
    ) {
      if (
        !path.startsWith(
          prefix,
        )
      ) {
        continue;
      }

      const remainder =
        path.slice(
          prefix.length,
        );

      const [
        name,
        ...rest
      ] =
        remainder.split("/");

      if (!name) {
        continue;
      }

      entries.set(
        name,
        {
          name,
          type:
            rest.length > 0
              ? "directory"
              : "file",
        },
      );
    }

    return [
      ...entries.values(),
    ];
  }

  return {
    async readDirectory(
      path,
    ) {
      return directoryEntries(
        path,
      );
    },

    async readFile(
      path,
    ) {
      const file =
        normalizedFiles.get(
          normalizePath(path),
        );

      if (!file) {
        throw new Error(
          `File not found: ${path}`,
        );
      }

      return file.content;
    },

    async stat(
      path,
    ): Promise<
      ProjectFileSystemStat
    > {
      const file =
        normalizedFiles.get(
          normalizePath(path),
        );

      if (!file) {
        throw new Error(
          `File not found: ${path}`,
        );
      }

      return {
        sizeBytes:
          new TextEncoder()
            .encode(
              file.content,
            )
            .length,
        modifiedAt:
          file.modifiedAt ??
          null,
      };
    },
  };
}

describe(
  "project filesystem scanner",
  () => {
    it(
      "scans a repository recursively",
      async () => {
        const port =
          createMemoryPort({
            "/repo/package.json": {
              content: "{}",
            },
            "/repo/apps/web/src/App.tsx": {
              content:
                "export function App() {}",
              modifiedAt:
                "2026-08-03T08:00:00.000Z",
            },
            "/repo/apps/web/src/App.test.tsx": {
              content:
                "it('works', () => {})",
            },
          });

        const report =
          await scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
              includeContent:
                true,
              capturedAt:
                "2026-08-03T12:00:00+04:00",
            },
          );

        expect(
          report.includedFiles,
        ).toBe(3);

        expect(
          report.contentFiles,
        ).toBe(3);

        expect(
          report.snapshot.files.map(
            (file) =>
              file.path,
          ),
        ).toEqual([
          "apps/web/src/App.test.tsx",
          "apps/web/src/App.tsx",
          "package.json",
        ]);

        expect(
          report.snapshot
            .capturedAt,
        ).toBe(
          "2026-08-03T08:00:00.000Z",
        );
      },
    );

    it(
      "ignores dependency and build directories",
      async () => {
        const port =
          createMemoryPort({
            "/repo/src/index.ts": {
              content: "source",
            },
            "/repo/node_modules/pkg/index.js": {
              content:
                "dependency",
            },
            "/repo/dist/index.js": {
              content: "build",
            },
          });

        const report =
          await scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
            },
          );

        expect(
          report.snapshot.files.map(
            (file) =>
              file.path,
          ),
        ).toEqual([
          "src/index.ts",
        ]);

        expect(
          report.skippedDirectories,
        ).toBe(2);
      },
    );

    it(
      "filters allowed extensions",
      async () => {
        const port =
          createMemoryPort({
            "/repo/src/index.ts": {
              content:
                "typescript",
            },
            "/repo/src/style.css": {
              content: "css",
            },
            "/repo/README.md": {
              content:
                "documentation",
            },
          });

        const report =
          await scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
              allowedExtensions: [
                ".ts",
                "tsx",
              ],
            },
          );

        expect(
          report.snapshot.files.map(
            (file) =>
              file.path,
          ),
        ).toEqual([
          "src/index.ts",
        ]);

        expect(
          report.skippedFiles,
        ).toBe(2);
      },
    );

    it(
      "does not read oversized content",
      async () => {
        const port =
          createMemoryPort({
            "/repo/src/small.ts": {
              content: "small",
            },
            "/repo/src/large.ts": {
              content:
                "1234567890",
            },
          });

        const report =
          await scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
              includeContent:
                true,
              maximumContentBytes:
                5,
            },
          );

        expect(
          report.snapshot.files.find(
            (file) =>
              file.path ===
              "src/small.ts",
          )?.content,
        ).toBe("small");

        expect(
          report.snapshot.files.find(
            (file) =>
              file.path ===
              "src/large.ts",
          )?.content,
        ).toBeNull();

        expect(
          report.contentFiles,
        ).toBe(1);
      },
    );

    it(
      "stops at the maximum file count",
      async () => {
        const port =
          createMemoryPort({
            "/repo/a.ts": {
              content: "a",
            },
            "/repo/b.ts": {
              content: "b",
            },
            "/repo/c.ts": {
              content: "c",
            },
          });

        const report =
          await scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
              maximumFiles: 2,
            },
          );

        expect(
          report.includedFiles,
        ).toBe(2);

        expect(report.truncated)
          .toBe(true);
      },
    );

    it(
      "records inaccessible directories as warnings",
      async () => {
        const port:
          ProjectFileSystemPort = {
          async readDirectory(
            path,
          ) {
            if (
              path ===
              "/repo/private"
            ) {
              throw new Error(
                "Access denied",
              );
            }

            return [
              {
                name:
                  "private",
                type:
                  "directory",
              },
            ];
          },

          async readFile() {
            return "";
          },

          async stat() {
            return {
              sizeBytes: 0,
              modifiedAt: null,
            };
          },
        };

        const report =
          await scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
            },
          );

        expect(
          report.warnings,
        ).toContain(
          "Could not read directory private: Access denied",
        );
      },
    );

    it(
      "rejects invalid limits",
      async () => {
        const port =
          createMemoryPort({});

        await expect(
          scanProjectFileSystem(
            port,
            {
              repositoryRoot:
                "/repo",
              maximumFiles: 0,
            },
          ),
        ).rejects.toThrow(
          "maximumFiles must be a positive integer.",
        );
      },
    );
  },
);
