import type {
  ProjectAsset,
} from "./project-assets-engine";

export const PROJECT_ASSETS_STORAGE_KEY =
  "creatoros.projects.assets.v1";

interface ProjectAssetsStorageShape {
  readonly version: 1;
  readonly assets:
    readonly ProjectAsset[];
}

function isProjectAsset(
  value: unknown,
): value is ProjectAsset {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<ProjectAsset>;

  return (
    typeof candidate.id ===
      "string" &&
    typeof candidate.projectId ===
      "string" &&
    typeof candidate.name ===
      "string" &&
    typeof candidate.kind ===
      "string" &&
    typeof candidate.status ===
      "string" &&
    typeof candidate.sizeBytes ===
      "number" &&
    Array.isArray(
      candidate.tags,
    )
  );
}

export function loadProjectAssets(
  storage:
    Pick<
      Storage,
      "getItem"
    > = window.localStorage,
): ProjectAsset[] {
  try {
    const raw =
      storage.getItem(
        PROJECT_ASSETS_STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(
        raw,
      ) as
        Partial<
          ProjectAssetsStorageShape
        >;

    if (
      parsed.version !== 1 ||
      !Array.isArray(
        parsed.assets,
      )
    ) {
      return [];
    }

    return parsed.assets.filter(
      isProjectAsset,
    );
  }
  catch {
    return [];
  }
}

export function saveProjectAssets(
  assets:
    readonly ProjectAsset[],
  storage:
    Pick<
      Storage,
      "setItem"
    > = window.localStorage,
): void {
  const payload:
    ProjectAssetsStorageShape = {
    version: 1,
    assets,
  };

  storage.setItem(
    PROJECT_ASSETS_STORAGE_KEY,
    JSON.stringify(
      payload,
    ),
  );
}

export function loadAssetsForProject(
  projectId: string,
  storage?:
    Pick<
      Storage,
      "getItem"
    >,
): ProjectAsset[] {
  return loadProjectAssets(
    storage,
  ).filter(
    (asset) =>
      asset.projectId ===
      projectId,
  );
}

export function replaceAssetsForProject(
  projectId: string,
  projectAssets:
    readonly ProjectAsset[],
  storage:
    Pick<
      Storage,
      "getItem" |
      "setItem"
    > = window.localStorage,
): void {
  const existing =
    loadProjectAssets(
      storage,
    );

  const otherAssets =
    existing.filter(
      (asset) =>
        asset.projectId !==
        projectId,
    );

  saveProjectAssets(
    [
      ...otherAssets,
      ...projectAssets,
    ],
    storage,
  );
}
