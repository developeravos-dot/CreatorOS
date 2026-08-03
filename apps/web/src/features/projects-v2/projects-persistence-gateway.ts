export type ProjectsPersistenceArea =
  | "workspace-preferences"
  | "project-assets"
  | "assistant-conversations";

export interface ProjectsPersistenceRecord<TValue> {
  readonly area:
    ProjectsPersistenceArea;
  readonly version: number;
  readonly value: TValue;
  readonly updatedAt: string;
}

export interface ProjectsPersistenceGateway {
  readonly kind:
    "local"
    | "remote"
    | "memory";

  read<TValue>(
    area:
      ProjectsPersistenceArea,
  ): Promise<
    ProjectsPersistenceRecord<TValue> |
    null
  >;

  write<TValue>(
    record:
      ProjectsPersistenceRecord<TValue>,
  ): Promise<void>;

  remove(
    area:
      ProjectsPersistenceArea,
  ): Promise<void>;

  clear(): Promise<void>;
}

export interface ProjectsPersistenceSerializer {
  stringify(
    value: unknown,
  ): string;

  parse(
    value: string,
  ): unknown;
}

export interface CreateLocalProjectsPersistenceGatewayOptions {
  readonly storage:
    Pick<
      Storage,
      | "getItem"
      | "setItem"
      | "removeItem"
    >;
  readonly keyPrefix?: string;
  readonly serializer?:
    ProjectsPersistenceSerializer;
}

const DEFAULT_KEY_PREFIX =
  "creatoros.projects.persistence";

const defaultSerializer:
  ProjectsPersistenceSerializer = {
  stringify(
    value: unknown,
  ): string {
    return JSON.stringify(
      value,
    );
  },

  parse(
    value: string,
  ): unknown {
    return JSON.parse(
      value,
    ) as unknown;
  },
};

function createStorageKey(
  prefix: string,
  area:
    ProjectsPersistenceArea,
): string {
  return `${prefix}.${area}`;
}

function isPersistenceArea(
  value: unknown,
): value is ProjectsPersistenceArea {
  return (
    value ===
      "workspace-preferences" ||
    value ===
      "project-assets" ||
    value ===
      "assistant-conversations"
  );
}

function isPersistenceRecord(
  value: unknown,
  expectedArea:
    ProjectsPersistenceArea,
): value is
  ProjectsPersistenceRecord<unknown> {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<
        ProjectsPersistenceRecord<
          unknown
        >
      >;

  return (
    candidate.area ===
      expectedArea &&
    isPersistenceArea(
      candidate.area,
    ) &&
    typeof candidate.version ===
      "number" &&
    Number.isInteger(
      candidate.version,
    ) &&
    candidate.version >= 1 &&
    typeof candidate.updatedAt ===
      "string" &&
    "value" in candidate
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

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return value;
  }

  return new Date(
    parsed,
  ).toISOString();
}

export function createProjectsPersistenceRecord<
  TValue,
>(
  area:
    ProjectsPersistenceArea,
  value: TValue,
  version = 1,
  updatedAt?:
    string,
): ProjectsPersistenceRecord<TValue> {
  if (
    !Number.isInteger(
      version,
    ) ||
    version < 1
  ) {
    throw new Error(
      "Persistence version must be a positive integer.",
    );
  }

  return {
    area,
    version,
    value,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function createLocalProjectsPersistenceGateway(
  options:
    CreateLocalProjectsPersistenceGatewayOptions,
): ProjectsPersistenceGateway {
  const {
    storage,
    keyPrefix =
      DEFAULT_KEY_PREFIX,
    serializer =
      defaultSerializer,
  } = options;

  return {
    kind: "local",

    async read<TValue>(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceRecord<TValue> |
      null
    > {
      try {
        const raw =
          storage.getItem(
            createStorageKey(
              keyPrefix,
              area,
            ),
          );

        if (!raw) {
          return null;
        }

        const parsed =
          serializer.parse(
            raw,
          );

        if (
          !isPersistenceRecord(
            parsed,
            area,
          )
        ) {
          return null;
        }

        return parsed as
          ProjectsPersistenceRecord<TValue>;
      }
      catch {
        return null;
      }
    },

    async write<TValue>(
      record:
        ProjectsPersistenceRecord<TValue>,
    ): Promise<void> {
      if (
        !isPersistenceRecord(
          record,
          record.area,
        )
      ) {
        throw new Error(
          "Invalid projects persistence record.",
        );
      }

      storage.setItem(
        createStorageKey(
          keyPrefix,
          record.area,
        ),
        serializer.stringify(
          record,
        ),
      );
    },

    async remove(
      area:
        ProjectsPersistenceArea,
    ): Promise<void> {
      storage.removeItem(
        createStorageKey(
          keyPrefix,
          area,
        ),
      );
    },

    async clear(): Promise<void> {
      const areas:
        readonly ProjectsPersistenceArea[] = [
        "workspace-preferences",
        "project-assets",
        "assistant-conversations",
      ];

      for (
        const area of areas
      ) {
        storage.removeItem(
          createStorageKey(
            keyPrefix,
            area,
          ),
        );
      }
    },
  };
}

export function createMemoryProjectsPersistenceGateway():
  ProjectsPersistenceGateway {
  const records =
    new Map<
      ProjectsPersistenceArea,
      ProjectsPersistenceRecord<
        unknown
      >
    >();

  return {
    kind: "memory",

    async read<TValue>(
      area:
        ProjectsPersistenceArea,
    ): Promise<
      ProjectsPersistenceRecord<TValue> |
      null
    > {
      return (
        records.get(
          area,
        ) as
          ProjectsPersistenceRecord<TValue> |
          undefined
      ) ?? null;
    },

    async write<TValue>(
      record:
        ProjectsPersistenceRecord<TValue>,
    ): Promise<void> {
      records.set(
        record.area,
        record,
      );
    },

    async remove(
      area:
        ProjectsPersistenceArea,
    ): Promise<void> {
      records.delete(
        area,
      );
    },

    async clear(): Promise<void> {
      records.clear();
    },
  };
}

export async function migrateProjectsPersistenceRecord<
  TCurrent,
  TNext,
>(
  gateway:
    ProjectsPersistenceGateway,
  area:
    ProjectsPersistenceArea,
  targetVersion: number,
  migrate: (
    current:
      ProjectsPersistenceRecord<TCurrent>,
  ) => TNext,
): Promise<
  ProjectsPersistenceRecord<TNext> |
  null
> {
  const current =
    await gateway.read<TCurrent>(
      area,
    );

  if (!current) {
    return null;
  }

  if (
    current.version ===
    targetVersion
  ) {
    return current as unknown as
      ProjectsPersistenceRecord<TNext>;
  }

  if (
    current.version >
    targetVersion
  ) {
    throw new Error(
      "Stored projects data uses a newer schema version.",
    );
  }

  const migrated =
    createProjectsPersistenceRecord(
      area,
      migrate(current),
      targetVersion,
    );

  await gateway.write(
    migrated,
  );

  return migrated;
}
