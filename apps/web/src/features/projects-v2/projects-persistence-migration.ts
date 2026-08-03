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
  createProjectsPersistenceRecord,
  type ProjectsPersistenceArea,
  type ProjectsPersistenceGateway,
} from "./projects-persistence-gateway";

export interface ProjectsLegacyStorage {
  readonly getItem: (
    key: string,
  ) => string | null;

  readonly removeItem?: (
    key: string,
  ) => void;
}

export interface ProjectsPersistenceMigrationItem {
  readonly area:
    ProjectsPersistenceArea;
  readonly legacyKey: string;
  readonly migrated: boolean;
  readonly skipped: boolean;
  readonly reason:
    | "migrated"
    | "missing"
    | "already-migrated"
    | "malformed";
}

export interface ProjectsPersistenceMigrationResult {
  readonly completed: boolean;
  readonly migratedCount: number;
  readonly skippedCount: number;
  readonly items:
    readonly ProjectsPersistenceMigrationItem[];
}

interface LegacyStorageDefinition {
  readonly area:
    ProjectsPersistenceArea;
  readonly key: string;
}

const LEGACY_STORAGE_DEFINITIONS:
  readonly LegacyStorageDefinition[] = [
  {
    area:
      "workspace-preferences",
    key:
      PROJECTS_WORKSPACE_STORAGE_KEY,
  },
  {
    area:
      "project-assets",
    key:
      PROJECT_ASSETS_STORAGE_KEY,
  },
  {
    area:
      "assistant-conversations",
    key:
      PROJECT_AI_ASSISTANT_STORAGE_KEY,
  },
];

function parseLegacyValue(
  raw: string,
): unknown {
  return JSON.parse(
    raw,
  ) as unknown;
}

export async function migrateLegacyProjectsPersistence(
  gateway:
    ProjectsPersistenceGateway,
  storage:
    ProjectsLegacyStorage = window.localStorage,
): Promise<
  ProjectsPersistenceMigrationResult
> {
  const items:
    ProjectsPersistenceMigrationItem[] = [];

  for (
    const definition of
    LEGACY_STORAGE_DEFINITIONS
  ) {
    const existing =
      await gateway.read(
        definition.area,
      );

    if (existing) {
      items.push({
        area:
          definition.area,
        legacyKey:
          definition.key,
        migrated: false,
        skipped: true,
        reason:
          "already-migrated",
      });

      continue;
    }

    const raw =
      storage.getItem(
        definition.key,
      );

    if (!raw) {
      items.push({
        area:
          definition.area,
        legacyKey:
          definition.key,
        migrated: false,
        skipped: true,
        reason: "missing",
      });

      continue;
    }

    try {
      const value =
        parseLegacyValue(
          raw,
        );

      await gateway.write(
        createProjectsPersistenceRecord(
          definition.area,
          value,
          1,
        ),
      );

      items.push({
        area:
          definition.area,
        legacyKey:
          definition.key,
        migrated: true,
        skipped: false,
        reason: "migrated",
      });
    }
    catch {
      items.push({
        area:
          definition.area,
        legacyKey:
          definition.key,
        migrated: false,
        skipped: true,
        reason: "malformed",
      });
    }
  }

  const migratedCount =
    items.filter(
      (item) =>
        item.migrated,
    ).length;

  const skippedCount =
    items.length -
    migratedCount;

  return {
    completed:
      items.every(
        (item) =>
          item.migrated ||
          item.skipped,
      ),
    migratedCount,
    skippedCount,
    items,
  };
}

export async function readProjectsPersistenceWithLegacyFallback<
  TValue,
>(
  gateway:
    ProjectsPersistenceGateway,
  area:
    ProjectsPersistenceArea,
  storage:
    ProjectsLegacyStorage = window.localStorage,
): Promise<TValue | null> {
  const current =
    await gateway.read<TValue>(
      area,
    );

  if (current) {
    return current.value;
  }

  const definition =
    LEGACY_STORAGE_DEFINITIONS.find(
      (item) =>
        item.area === area,
    );

  if (!definition) {
    return null;
  }

  const raw =
    storage.getItem(
      definition.key,
    );

  if (!raw) {
    return null;
  }

  try {
    return parseLegacyValue(
      raw,
    ) as TValue;
  }
  catch {
    return null;
  }
}

export async function removeLegacyProjectsPersistence(
  storage:
    ProjectsLegacyStorage = window.localStorage,
): Promise<void> {
  if (!storage.removeItem) {
    return;
  }

  for (
    const definition of
    LEGACY_STORAGE_DEFINITIONS
  ) {
    storage.removeItem(
      definition.key,
    );
  }
}

export function getLegacyProjectsStorageKeys():
  readonly string[] {
  return LEGACY_STORAGE_DEFINITIONS.map(
    (definition) =>
      definition.key,
  );
}
