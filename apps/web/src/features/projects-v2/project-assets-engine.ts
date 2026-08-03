export type ProjectAssetKind =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other";

export type ProjectAssetStatus =
  | "active"
  | "archived"
  | "deleted";

export type ProjectAssetSortField =
  | "name"
  | "size"
  | "createdAt"
  | "updatedAt"
  | "kind";

export type ProjectAssetSortDirection =
  | "asc"
  | "desc";

export interface ProjectAsset {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly extension: string;
  readonly mimeType: string;
  readonly kind:
    ProjectAssetKind;
  readonly sizeBytes: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly status:
    ProjectAssetStatus;
  readonly pinned: boolean;
  readonly description: string;
  readonly tags:
    readonly string[];
  readonly source:
    "upload"
    | "generated"
    | "external";
}

export interface CreateProjectAssetInput {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly mimeType?: string;
  readonly sizeBytes?: number;
  readonly createdAt?: string;
  readonly description?: string;
  readonly tags?:
    readonly string[];
  readonly source?:
    ProjectAsset["source"];
}

export interface ProjectAssetFilters {
  readonly query?: string;
  readonly kinds?:
    readonly ProjectAssetKind[];
  readonly statuses?:
    readonly ProjectAssetStatus[];
  readonly pinnedOnly?: boolean;
  readonly tags?:
    readonly string[];
}

export interface ProjectAssetSort {
  readonly field:
    ProjectAssetSortField;
  readonly direction:
    ProjectAssetSortDirection;
}

export interface ProjectAssetsSummary {
  readonly total: number;
  readonly active: number;
  readonly archived: number;
  readonly deleted: number;
  readonly pinned: number;
  readonly totalSizeBytes: number;
  readonly byKind:
    Readonly<
      Record<
        ProjectAssetKind,
        number
      >
    >;
}

const MIME_KIND_MAP:
  readonly [
    string,
    ProjectAssetKind,
  ][] = [
  ["image/", "image"],
  ["video/", "video"],
  ["audio/", "audio"],
  ["application/pdf", "document"],
  ["text/", "document"],
  ["application/msword", "document"],
  [
    "application/vnd.openxmlformats-officedocument",
    "document",
  ],
  ["application/zip", "archive"],
  ["application/x-rar", "archive"],
  ["application/x-7z", "archive"],
];

const ARCHIVE_EXTENSIONS =
  new Set([
    "zip",
    "rar",
    "7z",
    "tar",
    "gz",
  ]);

const DOCUMENT_EXTENSIONS =
  new Set([
    "pdf",
    "doc",
    "docx",
    "txt",
    "md",
    "csv",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ]);

const IMAGE_EXTENSIONS =
  new Set([
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "avif",
  ]);

const VIDEO_EXTENSIONS =
  new Set([
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
  ]);

const AUDIO_EXTENSIONS =
  new Set([
    "mp3",
    "wav",
    "aac",
    "flac",
    "ogg",
    "m4a",
  ]);

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase();
}

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

function normalizeTags(
  tags:
    readonly string[] = [],
): string[] {
  return [
    ...new Set(
      tags
        .map(
          (tag) =>
            normalizeText(tag),
        )
        .filter(Boolean),
    ),
  ];
}

export function getProjectAssetExtension(
  name: string,
): string {
  const normalized =
    name.trim();

  const lastDot =
    normalized.lastIndexOf(".");

  if (
    lastDot <= 0 ||
    lastDot ===
      normalized.length - 1
  ) {
    return "";
  }

  return normalized
    .slice(lastDot + 1)
    .toLocaleLowerCase();
}

export function detectProjectAssetKind(
  name: string,
  mimeType = "",
): ProjectAssetKind {
  const normalizedMime =
    normalizeText(mimeType);

  for (
    const [
      prefix,
      kind,
    ] of MIME_KIND_MAP
  ) {
    if (
      normalizedMime.startsWith(
        prefix,
      )
    ) {
      return kind;
    }
  }

  const extension =
    getProjectAssetExtension(
      name,
    );

  if (
    IMAGE_EXTENSIONS.has(
      extension,
    )
  ) {
    return "image";
  }

  if (
    VIDEO_EXTENSIONS.has(
      extension,
    )
  ) {
    return "video";
  }

  if (
    AUDIO_EXTENSIONS.has(
      extension,
    )
  ) {
    return "audio";
  }

  if (
    DOCUMENT_EXTENSIONS.has(
      extension,
    )
  ) {
    return "document";
  }

  if (
    ARCHIVE_EXTENSIONS.has(
      extension,
    )
  ) {
    return "archive";
  }

  return "other";
}

export function createProjectAsset(
  input:
    CreateProjectAssetInput,
): ProjectAsset {
  const createdAt =
    normalizeTimestamp(
      input.createdAt,
    );

  const name =
    input.name.trim();

  const mimeType =
    input.mimeType
      ?.trim() ??
    "";

  return {
    id:
      input.id.trim(),
    projectId:
      input.projectId.trim(),
    name,
    extension:
      getProjectAssetExtension(
        name,
      ),
    mimeType,
    kind:
      detectProjectAssetKind(
        name,
        mimeType,
      ),
    sizeBytes:
      Math.max(
        0,
        Math.trunc(
          input.sizeBytes ??
          0,
        ),
      ),
    createdAt,
    updatedAt:
      createdAt,
    status: "active",
    pinned: false,
    description:
      input.description
        ?.trim() ??
      "",
    tags:
      normalizeTags(
        input.tags,
      ),
    source:
      input.source ??
      "upload",
  };
}

export function updateProjectAsset(
  asset: ProjectAsset,
  changes:
    Partial<
      Pick<
        ProjectAsset,
        | "name"
        | "mimeType"
        | "description"
        | "tags"
        | "status"
        | "pinned"
        | "source"
      >
    >,
  updatedAt:
    string = new Date()
      .toISOString(),
): ProjectAsset {
  const name =
    changes.name
      ?.trim() ??
    asset.name;

  const mimeType =
    changes.mimeType
      ?.trim() ??
    asset.mimeType;

  return {
    ...asset,
    ...changes,
    name,
    mimeType,
    extension:
      getProjectAssetExtension(
        name,
      ),
    kind:
      detectProjectAssetKind(
        name,
        mimeType,
      ),
    description:
      changes.description
        ?.trim() ??
      asset.description,
    tags:
      changes.tags
        ? normalizeTags(
            changes.tags,
          )
        : asset.tags,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function toggleProjectAssetPinned(
  asset: ProjectAsset,
  updatedAt?:
    string,
): ProjectAsset {
  return updateProjectAsset(
    asset,
    {
      pinned:
        !asset.pinned,
    },
    updatedAt,
  );
}

export function archiveProjectAsset(
  asset: ProjectAsset,
  updatedAt?:
    string,
): ProjectAsset {
  return updateProjectAsset(
    asset,
    {
      status: "archived",
    },
    updatedAt,
  );
}

export function deleteProjectAsset(
  asset: ProjectAsset,
  updatedAt?:
    string,
): ProjectAsset {
  return updateProjectAsset(
    asset,
    {
      status: "deleted",
    },
    updatedAt,
  );
}

export function restoreProjectAsset(
  asset: ProjectAsset,
  updatedAt?:
    string,
): ProjectAsset {
  return updateProjectAsset(
    asset,
    {
      status: "active",
    },
    updatedAt,
  );
}

export function filterProjectAssets(
  assets:
    readonly ProjectAsset[],
  filters:
    ProjectAssetFilters = {},
): ProjectAsset[] {
  const query =
    normalizeText(
      filters.query ??
      "",
    );

  const kinds =
    new Set(
      filters.kinds ??
      [],
    );

  const statuses =
    new Set(
      filters.statuses ??
      [],
    );

  const tags =
    new Set(
      normalizeTags(
        filters.tags,
      ),
    );

  return assets.filter(
    (asset) => {
      if (
        query &&
        ![
          asset.name,
          asset.description,
          asset.extension,
          ...asset.tags,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)
      ) {
        return false;
      }

      if (
        kinds.size > 0 &&
        !kinds.has(
          asset.kind,
        )
      ) {
        return false;
      }

      if (
        statuses.size > 0 &&
        !statuses.has(
          asset.status,
        )
      ) {
        return false;
      }

      if (
        filters.pinnedOnly &&
        !asset.pinned
      ) {
        return false;
      }

      if (
        tags.size > 0 &&
        ![
          ...tags,
        ].every(
          (tag) =>
            asset.tags.includes(
              tag,
            ),
        )
      ) {
        return false;
      }

      return true;
    },
  );
}

function compareProjectAssets(
  left: ProjectAsset,
  right: ProjectAsset,
  field:
    ProjectAssetSortField,
): number {
  switch (field) {
    case "name":
      return left.name.localeCompare(
        right.name,
      );

    case "kind":
      return left.kind.localeCompare(
        right.kind,
      );

    case "size":
      return (
        left.sizeBytes -
        right.sizeBytes
      );

    case "createdAt":
      return (
        Date.parse(
          left.createdAt,
        ) -
        Date.parse(
          right.createdAt,
        )
      );

    case "updatedAt":
      return (
        Date.parse(
          left.updatedAt,
        ) -
        Date.parse(
          right.updatedAt,
        )
      );
  }
}

export function sortProjectAssets(
  assets:
    readonly ProjectAsset[],
  sort:
    ProjectAssetSort = {
      field: "updatedAt",
      direction: "desc",
    },
): ProjectAsset[] {
  const direction =
    sort.direction ===
    "asc"
      ? 1
      : -1;

  return [
    ...assets,
  ].sort(
    (left, right) => {
      if (
        left.pinned !==
        right.pinned
      ) {
        return left.pinned
          ? -1
          : 1;
      }

      const result =
        compareProjectAssets(
          left,
          right,
          sort.field,
        );

      if (result !== 0) {
        return (
          result *
          direction
        );
      }

      return left.id.localeCompare(
        right.id,
      );
    },
  );
}

export function queryProjectAssets(
  assets:
    readonly ProjectAsset[],
  filters:
    ProjectAssetFilters = {},
  sort?:
    ProjectAssetSort,
): ProjectAsset[] {
  return sortProjectAssets(
    filterProjectAssets(
      assets,
      filters,
    ),
    sort,
  );
}

export function summarizeProjectAssets(
  assets:
    readonly ProjectAsset[],
): ProjectAssetsSummary {
  const byKind:
    Record<
      ProjectAssetKind,
      number
    > = {
    image: 0,
    video: 0,
    audio: 0,
    document: 0,
    archive: 0,
    other: 0,
  };

  let active = 0;
  let archived = 0;
  let deleted = 0;
  let pinned = 0;
  let totalSizeBytes = 0;

  for (
    const asset of assets
  ) {
    byKind[asset.kind] += 1;
    totalSizeBytes +=
      asset.sizeBytes;

    if (asset.pinned) {
      pinned += 1;
    }

    switch (asset.status) {
      case "active":
        active += 1;
        break;

      case "archived":
        archived += 1;
        break;

      case "deleted":
        deleted += 1;
        break;
    }
  }

  return {
    total:
      assets.length,
    active,
    archived,
    deleted,
    pinned,
    totalSizeBytes,
    byKind,
  };
}

export function formatProjectAssetSize(
  sizeBytes: number,
): string {
  const normalized =
    Math.max(
      0,
      sizeBytes,
    );

  if (normalized < 1024) {
    return `${normalized} B`;
  }

  const units = [
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  let size =
    normalized / 1024;

  let unitIndex = 0;

  while (
    size >= 1024 &&
    unitIndex <
      units.length - 1
  ) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(
    size >= 10
      ? 1
      : 2,
  )} ${units[unitIndex]}`;
}
