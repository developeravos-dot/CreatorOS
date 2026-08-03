import {
  FactoryError,
} from "../domain";

import type {
  ProjectSnapshot,
  ProjectSnapshotFile,
} from "./project-intelligence-types";

export interface ProjectFileSystemEntry {
  readonly name: string;
  readonly type:
    | "file"
    | "directory"
    | "symbolic-link";
}

export interface ProjectFileSystemStat {
  readonly sizeBytes: number;
  readonly modifiedAt:
    string | null;
}

export interface ProjectFileSystemPort {
  readDirectory(
    path: string,
  ): Promise<
    readonly ProjectFileSystemEntry[]
  >;

  readFile(
    path: string,
  ): Promise<string>;

  stat(
    path: string,
  ): Promise<
    ProjectFileSystemStat
  >;
}

export interface ProjectFileSystemScanOptions {
  readonly repositoryRoot: string;

  readonly includeContent?:
    boolean;

  readonly maximumContentBytes?:
    number;

  readonly maximumFiles?:
    number;

  readonly maximumDepth?:
    number;

  readonly ignoredDirectories?:
    readonly string[];

  readonly ignoredFiles?:
    readonly string[];

  readonly allowedExtensions?:
    readonly string[];

  readonly followSymbolicLinks?:
    boolean;

  readonly capturedAt?: string;

  readonly metadata?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
}

export interface ProjectFileSystemScanReport {
  readonly snapshot:
    ProjectSnapshot;

  readonly visitedDirectories:
    number;

  readonly discoveredFiles:
    number;

  readonly includedFiles:
    number;

  readonly skippedFiles:
    number;

  readonly skippedDirectories:
    number;

  readonly contentFiles:
    number;

  readonly truncated:
    boolean;

  readonly warnings:
    readonly string[];
}

const DEFAULT_IGNORED_DIRECTORIES = [
  ".git",
  ".idea",
  ".vscode",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".cache",
] as const;

const DEFAULT_IGNORED_FILES = [
  ".DS_Store",
  "Thumbs.db",
] as const;

function normalizePath(
  value: string,
): string {
  return value
    .trim()
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

function normalizeRelativePath(
  value: string,
): string {
  return normalizePath(
    value,
  )
    .replace(
      /^\.\//,
      "",
    )
    .replace(
      /^\//,
      "",
    );
}

function joinPath(
  left: string,
  right: string,
): string {
  return normalizePath(
    `${left}/${right}`,
  );
}

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

  return Number.isFinite(parsed)
    ? new Date(parsed)
        .toISOString()
    : value;
}

function getExtension(
  path: string,
): string {
  const name =
    path
      .split("/")
      .at(-1) ??
    "";

  const index =
    name.lastIndexOf(".");

  if (
    index <= 0 ||
    index ===
      name.length - 1
  ) {
    return "";
  }

  return name
    .slice(index + 1)
    .toLowerCase();
}

function normalizeNames(
  values:
    readonly string[],
): ReadonlySet<string> {
  return new Set(
    values
      .map(
        (value) =>
          value
            .trim()
            .toLowerCase(),
      )
      .filter(Boolean),
  );
}

function shouldIgnoreDirectory(
  name: string,
  ignored:
    ReadonlySet<string>,
): boolean {
  return ignored.has(
    name.toLowerCase(),
  );
}

function shouldIgnoreFile(
  name: string,
  ignored:
    ReadonlySet<string>,
): boolean {
  return ignored.has(
    name.toLowerCase(),
  );
}

function isAllowedExtension(
  path: string,
  allowed:
    ReadonlySet<string> | null,
): boolean {
  if (!allowed) {
    return true;
  }

  return allowed.has(
    getExtension(path),
  );
}

function validateOptions(
  options:
    ProjectFileSystemScanOptions,
): void {
  if (
    !normalizePath(
      options.repositoryRoot,
    )
  ) {
    throw new FactoryError(
      "Filesystem scanner repository root is required.",
      {
        code:
          "INVALID_PACK",
      },
    );
  }

  const positiveLimits = [
    [
      "maximumContentBytes",
      options.maximumContentBytes ??
        1_000_000,
    ],
    [
      "maximumFiles",
      options.maximumFiles ??
        20_000,
    ],
    [
      "maximumDepth",
      options.maximumDepth ??
        50,
    ],
  ] as const;

  for (
    const [
      name,
      value,
    ] of positiveLimits
  ) {
    if (
      !Number.isInteger(
        value,
      ) ||
      value < 1
    ) {
      throw new FactoryError(
        `${name} must be a positive integer.`,
        {
          code:
            "INVALID_PACK",
          details: {
            name,
            value,
          },
        },
      );
    }
  }
}

export async function scanProjectFileSystem(
  port:
    ProjectFileSystemPort,
  options:
    ProjectFileSystemScanOptions,
): Promise<
  ProjectFileSystemScanReport
> {
  validateOptions(
    options,
  );

  const repositoryRoot =
    normalizePath(
      options.repositoryRoot,
    );

  const includeContent =
    options.includeContent ??
    false;

  const maximumContentBytes =
    options.maximumContentBytes ??
    1_000_000;

  const maximumFiles =
    options.maximumFiles ??
    20_000;

  const maximumDepth =
    options.maximumDepth ??
    50;

  const ignoredDirectories =
    normalizeNames([
      ...DEFAULT_IGNORED_DIRECTORIES,
      ...options
        .ignoredDirectories ??
        [],
    ]);

  const ignoredFiles =
    normalizeNames([
      ...DEFAULT_IGNORED_FILES,
      ...options
        .ignoredFiles ??
        [],
    ]);

  const allowedExtensions =
    options.allowedExtensions
      ? normalizeNames(
          options.allowedExtensions.map(
            (extension) =>
              extension.replace(
                /^\./,
                "",
              ),
          ),
        )
      : null;

  const files:
    ProjectSnapshotFile[] = [];

  const warnings:
    string[] = [];

  let visitedDirectories = 0;
  let discoveredFiles = 0;
  let skippedFiles = 0;
  let skippedDirectories = 0;
  let contentFiles = 0;
  let truncated = false;

  async function visitDirectory(
    absolutePath: string,
    relativePath: string,
    depth: number,
  ): Promise<void> {
    if (
      files.length >=
      maximumFiles
    ) {
      truncated = true;
      return;
    }

    if (
      depth >
      maximumDepth
    ) {
      skippedDirectories += 1;

      warnings.push(
        `Maximum directory depth exceeded: ${relativePath || "."}.`,
      );

      return;
    }

    visitedDirectories += 1;

    let entries:
      readonly ProjectFileSystemEntry[];

    try {
      entries =
        await port.readDirectory(
          absolutePath,
        );
    }
    catch (error: unknown) {
      warnings.push(
        `Could not read directory ${relativePath || "."}: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      );

      return;
    }

    const orderedEntries = [
      ...entries,
    ].sort(
      (left, right) =>
        left.name.localeCompare(
          right.name,
        ),
    );

    for (
      const entry of
      orderedEntries
    ) {
      if (
        files.length >=
        maximumFiles
      ) {
        truncated = true;
        break;
      }

      const childAbsolutePath =
        joinPath(
          absolutePath,
          entry.name,
        );

      const childRelativePath =
        normalizeRelativePath(
          relativePath
            ? `${relativePath}/${entry.name}`
            : entry.name,
        );

      if (
        entry.type ===
        "directory"
      ) {
        if (
          shouldIgnoreDirectory(
            entry.name,
            ignoredDirectories,
          )
        ) {
          skippedDirectories += 1;
          continue;
        }

        await visitDirectory(
          childAbsolutePath,
          childRelativePath,
          depth + 1,
        );

        continue;
      }

      if (
        entry.type ===
        "symbolic-link" &&
        !options
          .followSymbolicLinks
      ) {
        skippedFiles += 1;
        continue;
      }

      discoveredFiles += 1;

      if (
        shouldIgnoreFile(
          entry.name,
          ignoredFiles,
        ) ||
        !isAllowedExtension(
          childRelativePath,
          allowedExtensions,
        )
      ) {
        skippedFiles += 1;
        continue;
      }

      let stat:
        ProjectFileSystemStat;

      try {
        stat =
          await port.stat(
            childAbsolutePath,
          );
      }
      catch (error: unknown) {
        skippedFiles += 1;

        warnings.push(
          `Could not stat file ${childRelativePath}: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`,
        );

        continue;
      }

      let content:
        string | null =
        null;

      if (
        includeContent &&
        stat.sizeBytes <=
          maximumContentBytes
      ) {
        try {
          content =
            await port.readFile(
              childAbsolutePath,
            );

          contentFiles += 1;
        }
        catch (error: unknown) {
          warnings.push(
            `Could not read file ${childRelativePath}: ${
              error instanceof Error
                ? error.message
                : String(error)
            }`,
          );
        }
      }

      files.push({
        path:
          childRelativePath,
        content,
        sizeBytes:
          stat.sizeBytes,
        modifiedAt:
          stat.modifiedAt,
        generated:
          false,
      });
    }
  }

  await visitDirectory(
    repositoryRoot,
    "",
    0,
  );

  return {
    snapshot: {
      repositoryRoot,
      files,
      capturedAt:
        normalizeTimestamp(
          options.capturedAt,
        ),
      metadata: {
        ...options.metadata,
        scanner:
          "portable-filesystem",
        includeContent,
        maximumContentBytes,
        maximumFiles,
        maximumDepth,
      },
    },
    visitedDirectories,
    discoveredFiles,
    includedFiles:
      files.length,
    skippedFiles,
    skippedDirectories,
    contentFiles,
    truncated,
    warnings,
  };
}
