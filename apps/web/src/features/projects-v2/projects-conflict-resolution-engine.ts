import type {
  ProjectsPersistenceArea,
  ProjectsPersistenceRecord,
} from "./projects-persistence-gateway";

export type ProjectsConflictStrategy =
  | "local-wins"
  | "remote-wins"
  | "newest-wins"
  | "merge";

export type ProjectsConflictWinner =
  | "local"
  | "remote"
  | "merged"
  | "equal";

export type ProjectsConflictType =
  | "none"
  | "version"
  | "timestamp"
  | "value"
  | "compound";

export interface ProjectsConflictField {
  readonly path: string;
  readonly localValue: unknown;
  readonly remoteValue: unknown;
}

export interface ProjectsConflictAnalysis<
  TValue,
> {
  readonly area:
    ProjectsPersistenceArea;
  readonly conflict: boolean;
  readonly conflictType:
    ProjectsConflictType;
  readonly local:
    ProjectsPersistenceRecord<TValue>;
  readonly remote:
    ProjectsPersistenceRecord<TValue>;
  readonly localIsNewer: boolean;
  readonly remoteIsNewer: boolean;
  readonly sameVersion: boolean;
  readonly sameTimestamp: boolean;
  readonly sameValue: boolean;
  readonly changedFields:
    readonly ProjectsConflictField[];
}

export interface ProjectsConflictResolution<
  TValue,
> {
  readonly area:
    ProjectsPersistenceArea;
  readonly strategy:
    ProjectsConflictStrategy;
  readonly winner:
    ProjectsConflictWinner;
  readonly record:
    ProjectsPersistenceRecord<TValue>;
  readonly conflictType:
    ProjectsConflictType;
  readonly changedFields:
    readonly ProjectsConflictField[];
  readonly resolvedAt: string;
  readonly reason: string;
}

export interface ResolveProjectsConflictOptions {
  readonly strategy:
    ProjectsConflictStrategy;
  readonly protectedPaths?:
    readonly string[];
  readonly resolvedAt?: string;
}

type JsonObject =
  Record<string, unknown>;

function normalizeTimestamp(
  value:
    string | undefined,
): string {
  if (!value) {
    return new Date()
      .toISOString();
  }

  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(
      timestamp,
    )
  ) {
    return value;
  }

  return new Date(
    timestamp,
  ).toISOString();
}

function parseTimestamp(
  value: string,
): number {
  const timestamp =
    Date.parse(value);

  return Number.isFinite(
    timestamp,
  )
    ? timestamp
    : 0;
}

function isObject(
  value: unknown,
): value is JsonObject {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stableSerialize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return `[${value
      .map(
        stableSerialize,
      )
      .join(",")}]`;
  }

  if (isObject(value)) {
    const keys =
      Object.keys(value)
        .sort();

    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(
            key,
          )}:${stableSerialize(
            value[key],
          )}`,
      )
      .join(",")}}`;
  }

  return JSON.stringify(
    value,
  );
}

function valuesEqual(
  left: unknown,
  right: unknown,
): boolean {
  return (
    stableSerialize(left) ===
    stableSerialize(right)
  );
}

function joinPath(
  parent: string,
  key: string,
): string {
  return parent
    ? `${parent}.${key}`
    : key;
}

function collectChangedFields(
  localValue: unknown,
  remoteValue: unknown,
  path = "",
): ProjectsConflictField[] {
  if (
    valuesEqual(
      localValue,
      remoteValue,
    )
  ) {
    return [];
  }

  if (
    isObject(localValue) &&
    isObject(remoteValue)
  ) {
    const keys =
      new Set([
        ...Object.keys(
          localValue,
        ),
        ...Object.keys(
          remoteValue,
        ),
      ]);

    return [
      ...keys,
    ]
      .sort()
      .flatMap(
        (key) =>
          collectChangedFields(
            localValue[key],
            remoteValue[key],
            joinPath(
              path,
              key,
            ),
          ),
      );
  }

  return [
    {
      path:
        path || "$",
      localValue,
      remoteValue,
    },
  ];
}

function determineConflictType(
  sameVersion: boolean,
  sameTimestamp: boolean,
  sameValue: boolean,
): ProjectsConflictType {
  if (sameValue) {
    return "none";
  }

  const dimensions = [
    !sameVersion,
    !sameTimestamp,
    !sameValue,
  ].filter(Boolean).length;

  if (dimensions > 1) {
    return "compound";
  }

  if (!sameVersion) {
    return "version";
  }

  if (!sameTimestamp) {
    return "timestamp";
  }

  return "value";
}

function isProtectedPath(
  path: string,
  protectedPaths:
    readonly string[],
): boolean {
  return protectedPaths.some(
    (protectedPath) =>
      path === protectedPath ||
      path.startsWith(
        `${protectedPath}.`,
      ),
  );
}

function mergeValues(
  localValue: unknown,
  remoteValue: unknown,
  protectedPaths:
    readonly string[],
  path = "",
): unknown {
  if (
    isProtectedPath(
      path,
      protectedPaths,
    )
  ) {
    return remoteValue;
  }

  if (
    isObject(localValue) &&
    isObject(remoteValue)
  ) {
    const result:
      JsonObject = {
      ...remoteValue,
    };

    const keys =
      new Set([
        ...Object.keys(
          remoteValue,
        ),
        ...Object.keys(
          localValue,
        ),
      ]);

    for (
      const key of keys
    ) {
      const nextPath =
        joinPath(
          path,
          key,
        );

      const hasLocal =
        Object.prototype
          .hasOwnProperty.call(
            localValue,
            key,
          );

      const hasRemote =
        Object.prototype
          .hasOwnProperty.call(
            remoteValue,
            key,
          );

      if (
        hasLocal &&
        hasRemote
      ) {
        result[key] =
          mergeValues(
            localValue[key],
            remoteValue[key],
            protectedPaths,
            nextPath,
          );

        continue;
      }

      if (hasLocal) {
        result[key] =
          localValue[key];
      }
    }

    return result;
  }

  if (
    Array.isArray(localValue) &&
    Array.isArray(remoteValue)
  ) {
    const serialized =
      new Set<string>();

    const merged:
      unknown[] = [];

    for (
      const item of [
        ...remoteValue,
        ...localValue,
      ]
    ) {
      const signature =
        stableSerialize(
          item,
        );

      if (
        serialized.has(
          signature,
        )
      ) {
        continue;
      }

      serialized.add(
        signature,
      );

      merged.push(item);
    }

    return merged;
  }

  return localValue;
}

function createResolvedRecord<
  TValue,
>(
  source:
    ProjectsPersistenceRecord<TValue>,
  value: TValue,
  resolvedAt: string,
  version: number,
): ProjectsPersistenceRecord<TValue> {
  return {
    area:
      source.area,
    version,
    value,
    updatedAt:
      normalizeTimestamp(
        resolvedAt,
      ),
  };
}

export function analyzeProjectsConflict<
  TValue,
>(
  local:
    ProjectsPersistenceRecord<TValue>,
  remote:
    ProjectsPersistenceRecord<TValue>,
): ProjectsConflictAnalysis<TValue> {
  if (
    local.area !==
    remote.area
  ) {
    throw new Error(
      "Cannot compare persistence records from different areas.",
    );
  }

  const localTimestamp =
    parseTimestamp(
      local.updatedAt,
    );

  const remoteTimestamp =
    parseTimestamp(
      remote.updatedAt,
    );

  const sameVersion =
    local.version ===
    remote.version;

  const sameTimestamp =
    localTimestamp ===
    remoteTimestamp;

  const sameValue =
    valuesEqual(
      local.value,
      remote.value,
    );

  const changedFields =
    collectChangedFields(
      local.value,
      remote.value,
    );

  return {
    area:
      local.area,
    conflict:
      !sameValue,
    conflictType:
      determineConflictType(
        sameVersion,
        sameTimestamp,
        sameValue,
      ),
    local,
    remote,
    localIsNewer:
      local.version >
        remote.version ||
      (
        local.version ===
          remote.version &&
        localTimestamp >
          remoteTimestamp
      ),
    remoteIsNewer:
      remote.version >
        local.version ||
      (
        remote.version ===
          local.version &&
        remoteTimestamp >
          localTimestamp
      ),
    sameVersion,
    sameTimestamp,
    sameValue,
    changedFields,
  };
}

export function resolveProjectsConflict<
  TValue,
>(
  analysis:
    ProjectsConflictAnalysis<TValue>,
  options:
    ResolveProjectsConflictOptions,
): ProjectsConflictResolution<TValue> {
  const resolvedAt =
    normalizeTimestamp(
      options.resolvedAt,
    );

  const nextVersion =
    Math.max(
      analysis.local.version,
      analysis.remote.version,
    ) + 1;

  if (
    !analysis.conflict
  ) {
    const freshest =
      analysis.remoteIsNewer
        ? analysis.remote
        : analysis.local;

    return {
      area:
        analysis.area,
      strategy:
        options.strategy,
      winner: "equal",
      record:
        createResolvedRecord(
          freshest,
          freshest.value,
          resolvedAt,
          Math.max(
            analysis.local.version,
            analysis.remote.version,
          ),
        ),
      conflictType:
        "none",
      changedFields: [],
      resolvedAt,
      reason:
        "The local and remote values are equivalent.",
    };
  }

  switch (
    options.strategy
  ) {
    case "local-wins":
      return {
        area:
          analysis.area,
        strategy:
          options.strategy,
        winner: "local",
        record:
          createResolvedRecord(
            analysis.local,
            analysis.local.value,
            resolvedAt,
            nextVersion,
          ),
        conflictType:
          analysis.conflictType,
        changedFields:
          analysis.changedFields,
        resolvedAt,
        reason:
          "The local record was selected explicitly.",
      };

    case "remote-wins":
      return {
        area:
          analysis.area,
        strategy:
          options.strategy,
        winner: "remote",
        record:
          createResolvedRecord(
            analysis.remote,
            analysis.remote.value,
            resolvedAt,
            nextVersion,
          ),
        conflictType:
          analysis.conflictType,
        changedFields:
          analysis.changedFields,
        resolvedAt,
        reason:
          "The remote record was selected explicitly.",
      };

    case "newest-wins": {
      const remoteWins =
        analysis.remoteIsNewer;

      const selected =
        remoteWins
          ? analysis.remote
          : analysis.local;

      return {
        area:
          analysis.area,
        strategy:
          options.strategy,
        winner:
          remoteWins
            ? "remote"
            : "local",
        record:
          createResolvedRecord(
            selected,
            selected.value,
            resolvedAt,
            nextVersion,
          ),
        conflictType:
          analysis.conflictType,
        changedFields:
          analysis.changedFields,
        resolvedAt,
        reason:
          remoteWins
            ? "The remote record has the newest version or timestamp."
            : "The local record has the newest version or timestamp.",
      };
    }

    case "merge": {
      const mergedValue =
        mergeValues(
          analysis.local.value,
          analysis.remote.value,
          options.protectedPaths ??
            [],
        ) as TValue;

      return {
        area:
          analysis.area,
        strategy:
          options.strategy,
        winner: "merged",
        record:
          createResolvedRecord(
            analysis.local,
            mergedValue,
            resolvedAt,
            nextVersion,
          ),
        conflictType:
          analysis.conflictType,
        changedFields:
          analysis.changedFields,
        resolvedAt,
        reason:
          "Local and remote values were merged using protected-field rules.",
      };
    }
  }
}

export function resolveProjectsPersistenceRecords<
  TValue,
>(
  local:
    ProjectsPersistenceRecord<TValue>,
  remote:
    ProjectsPersistenceRecord<TValue>,
  options:
    ResolveProjectsConflictOptions,
): ProjectsConflictResolution<TValue> {
  return resolveProjectsConflict(
    analyzeProjectsConflict(
      local,
      remote,
    ),
    options,
  );
}
