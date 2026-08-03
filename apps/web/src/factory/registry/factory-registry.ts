import {
  FactoryError,
} from "../domain";

import type {
  CreateFactoryRegistryEntryInput,
  FactoryRegistry,
  FactoryRegistryDependencyIssue,
  FactoryRegistryEntry,
  FactoryRegistryEntryId,
  FactoryRegistryEntryStatus,
  FactoryRegistryQuery,
  FactoryRegistrySummary,
  FactoryRegistryValidationResult,
} from "./factory-registry-types";

function normalizeText(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new FactoryError(
      `${fieldName} is required.`,
      {
        code:
          "INVALID_PACK",
        details: {
          fieldName,
        },
      },
    );
  }

  return normalized;
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

function normalizeVersion(
  value:
    string | undefined,
): string {
  return value
    ?.trim() ||
    "1.0.0";
}

function compareVersions(
  left: string,
  right: string,
): number {
  const leftParts =
    left
      .split(".")
      .map(
        (part) =>
          Number.parseInt(
            part,
            10,
          ) || 0,
      );

  const rightParts =
    right
      .split(".")
      .map(
        (part) =>
          Number.parseInt(
            part,
            10,
          ) || 0,
      );

  const length =
    Math.max(
      leftParts.length,
      rightParts.length,
    );

  for (
    let index = 0;
    index < length;
    index += 1
  ) {
    const leftValue =
      leftParts[index] ??
      0;

    const rightValue =
      rightParts[index] ??
      0;

    if (
      leftValue !==
      rightValue
    ) {
      return (
        leftValue -
        rightValue
      );
    }
  }

  return 0;
}

export function createFactoryRegistryEntryId(
  value: string,
): FactoryRegistryEntryId {
  return normalizeText(
    value,
    "Registry entry id",
  ) as FactoryRegistryEntryId;
}

export function createFactoryRegistry(
  updatedAt?:
    string,
): FactoryRegistry {
  return {
    entries: [],
    version: 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function createFactoryRegistryEntry(
  input:
    CreateFactoryRegistryEntryInput,
): FactoryRegistryEntry {
  if (
    !Number.isInteger(
      input.priority ??
      100,
    )
  ) {
    throw new FactoryError(
      "Registry entry priority must be an integer.",
      {
        code:
          "INVALID_PACK",
        details: {
          id:
            input.id,
          priority:
            input.priority,
        },
      },
    );
  }

  const timestamp =
    normalizeTimestamp(
      input.createdAt,
    );

  return {
    id:
      createFactoryRegistryEntryId(
        input.id,
      ),
    registryType:
      input.registryType,
    name:
      normalizeText(
        input.name,
        "Registry entry name",
      ),
    description:
      input.description
        ?.trim() ??
      "",
    version:
      normalizeVersion(
        input.version,
      ),
    status:
      input.status ??
      "active",
    capabilities: [
      ...new Set(
        input.capabilities ??
        [],
      ),
    ],
    dependencies: [
      ...input.dependencies ??
      [],
    ],
    priority:
      input.priority ??
      100,
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
    metadata:
      input.metadata ??
      {},
  };
}

export function registerFactoryEntry(
  registry:
    FactoryRegistry,
  input:
    CreateFactoryRegistryEntryInput,
  updatedAt?:
    string,
): FactoryRegistry {
  const entry =
    createFactoryRegistryEntry(
      input,
    );

  if (
    registry.entries.some(
      (current) =>
        current.id ===
        entry.id,
    )
  ) {
    throw new FactoryError(
      `Factory registry entry already exists: ${entry.id}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          entryId:
            entry.id,
          registryType:
            entry.registryType,
        },
      },
    );
  }

  return {
    entries: [
      ...registry.entries,
      entry,
    ].sort(
      (left, right) =>
        left.priority -
        right.priority ||
        left.name.localeCompare(
          right.name,
        ),
    ),
    version:
      registry.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function updateFactoryRegistryEntry(
  registry:
    FactoryRegistry,
  entryId:
    FactoryRegistryEntryId,
  patch:
    Partial<
      Pick<
        FactoryRegistryEntry,
        | "name"
        | "description"
        | "version"
        | "status"
        | "capabilities"
        | "dependencies"
        | "priority"
        | "metadata"
      >
    >,
  updatedAt?:
    string,
): FactoryRegistry {
  const existing =
    registry.entries.find(
      (entry) =>
        entry.id ===
        entryId,
    );

  if (!existing) {
    throw new FactoryError(
      `Factory registry entry was not found: ${entryId}.`,
      {
        code:
          "INVALID_PACK",
        details: {
          entryId,
        },
      },
    );
  }

  const timestamp =
    normalizeTimestamp(
      updatedAt,
    );

  const updated:
    FactoryRegistryEntry = {
    ...existing,
    name:
      patch.name !== undefined
        ? normalizeText(
            patch.name,
            "Registry entry name",
          )
        : existing.name,
    description:
      patch.description
        ?.trim() ??
      existing.description,
    version:
      patch.version !== undefined
        ? normalizeVersion(
            patch.version,
          )
        : existing.version,
    status:
      patch.status ??
      existing.status,
    capabilities:
      patch.capabilities
        ? [
            ...new Set(
              patch.capabilities,
            ),
          ]
        : existing.capabilities,
    dependencies:
      patch.dependencies ??
      existing.dependencies,
    priority:
      patch.priority ??
      existing.priority,
    metadata:
      patch.metadata ??
      existing.metadata,
    updatedAt:
      timestamp,
  };

  return {
    entries:
      registry.entries
        .map(
          (entry) =>
            entry.id ===
            entryId
              ? updated
              : entry,
        )
        .sort(
          (left, right) =>
            left.priority -
            right.priority ||
            left.name.localeCompare(
              right.name,
            ),
        ),
    version:
      registry.version + 1,
    updatedAt:
      timestamp,
  };
}

export function setFactoryRegistryEntryStatus(
  registry:
    FactoryRegistry,
  entryId:
    FactoryRegistryEntryId,
  status:
    FactoryRegistryEntryStatus,
  updatedAt?:
    string,
): FactoryRegistry {
  return updateFactoryRegistryEntry(
    registry,
    entryId,
    {
      status,
    },
    updatedAt,
  );
}

export function unregisterFactoryEntry(
  registry:
    FactoryRegistry,
  entryId:
    FactoryRegistryEntryId,
  updatedAt?:
    string,
): FactoryRegistry {
  const entries =
    registry.entries.filter(
      (entry) =>
        entry.id !==
        entryId,
    );

  if (
    entries.length ===
    registry.entries.length
  ) {
    return registry;
  }

  return {
    entries,
    version:
      registry.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function findFactoryRegistryEntry(
  registry:
    FactoryRegistry,
  entryId:
    FactoryRegistryEntryId,
): FactoryRegistryEntry | null {
  return (
    registry.entries.find(
      (entry) =>
        entry.id ===
        entryId,
    ) ??
    null
  );
}

export function queryFactoryRegistry(
  registry:
    FactoryRegistry,
  query:
    FactoryRegistryQuery,
): readonly FactoryRegistryEntry[] {
  const search =
    query.search
      ?.trim()
      .toLowerCase() ??
    "";

  return registry.entries.filter(
    (entry) => {
      if (
        query.registryType &&
        entry.registryType !==
          query.registryType
      ) {
        return false;
      }

      if (
        query.status &&
        entry.status !==
          query.status
      ) {
        return false;
      }

      if (
        query.capability &&
        !entry.capabilities.includes(
          query.capability,
        )
      ) {
        return false;
      }

      if (
        search &&
        ![
          entry.id,
          entry.name,
          entry.description,
          ...entry.capabilities,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }

      return true;
    },
  );
}

export function validateFactoryRegistry(
  registry:
    FactoryRegistry,
): FactoryRegistryValidationResult {
  const issues:
    FactoryRegistryDependencyIssue[] = [];

  for (
    const entry of
    registry.entries
  ) {
    for (
      const dependency of
      entry.dependencies
    ) {
      const target =
        findFactoryRegistryEntry(
          registry,
          dependency.id,
        );

      if (!target) {
        if (
          dependency.required
        ) {
          issues.push({
            entryId:
              entry.id,
            dependencyId:
              dependency.id,
            code:
              "MISSING_DEPENDENCY",
            message:
              `Required registry dependency is missing: ${dependency.id}.`,
          });
        }

        continue;
      }

      if (
        target.status !==
        "active"
      ) {
        issues.push({
          entryId:
            entry.id,
          dependencyId:
            dependency.id,
          code:
            "DISABLED_DEPENDENCY",
          message:
            `Registry dependency is not active: ${dependency.id}.`,
        });
      }

      if (
        dependency.minimumVersion &&
        compareVersions(
          target.version,
          dependency.minimumVersion,
        ) < 0
      ) {
        issues.push({
          entryId:
            entry.id,
          dependencyId:
            dependency.id,
          code:
            "VERSION_MISMATCH",
          message:
            `Registry dependency ${dependency.id} requires version ${dependency.minimumVersion} or newer.`,
        });
      }
    }
  }

  return {
    valid:
      issues.length === 0,
    issues,
  };
}

export function getFactoryRegistryExecutionOrder(
  registry:
    FactoryRegistry,
): readonly FactoryRegistryEntry[] {
  const activeEntries =
    registry.entries.filter(
      (entry) =>
        entry.status ===
        "active",
    );

  const result:
    FactoryRegistryEntry[] = [];

  const visited =
    new Set<
      FactoryRegistryEntryId
    >();

  const visiting =
    new Set<
      FactoryRegistryEntryId
    >();

  function visit(
    entry:
      FactoryRegistryEntry,
  ): void {
    if (
      visited.has(
        entry.id,
      )
    ) {
      return;
    }

    if (
      visiting.has(
        entry.id,
      )
    ) {
      throw new FactoryError(
        `Circular Factory registry dependency detected at ${entry.id}.`,
        {
          code:
            "INVALID_PACK",
          details: {
            entryId:
              entry.id,
          },
        },
      );
    }

    visiting.add(
      entry.id,
    );

    for (
      const dependency of
      entry.dependencies
    ) {
      const target =
        activeEntries.find(
          (candidate) =>
            candidate.id ===
            dependency.id,
        );

      if (target) {
        visit(target);
      }
    }

    visiting.delete(
      entry.id,
    );

    visited.add(
      entry.id,
    );

    result.push(entry);
  }

  for (
    const entry of
    activeEntries
  ) {
    visit(entry);
  }

  return result;
}

export function summarizeFactoryRegistry(
  registry:
    FactoryRegistry,
): FactoryRegistrySummary {
  const summary:
    FactoryRegistrySummary = {
    total:
      registry.entries.length,
    active: 0,
    disabled: 0,
    deprecated: 0,
    generators: 0,
    validators: 0,
    templates: 0,
    runtimes: 0,
  };

  const mutable =
    summary as {
      -readonly [
        Key in keyof FactoryRegistrySummary
      ]: FactoryRegistrySummary[Key];
    };

  for (
    const entry of
    registry.entries
  ) {
    mutable[
      entry.status
    ] += 1;

    switch (
      entry.registryType
    ) {
      case "generator":
        mutable.generators += 1;
        break;

      case "validator":
        mutable.validators += 1;
        break;

      case "template":
        mutable.templates += 1;
        break;

      case "runtime":
        mutable.runtimes += 1;
        break;
    }
  }

  return summary;
}
