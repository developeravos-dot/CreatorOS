export type ProjectPrincipalType =
  | "user"
  | "team"
  | "service";

export type ProjectRole =
  | "owner"
  | "admin"
  | "editor"
  | "contributor"
  | "viewer";

export type ProjectPermission =
  | "project.read"
  | "project.update"
  | "project.delete"
  | "project.archive"
  | "project.manage-members"
  | "project.manage-permissions"
  | "project.move-kanban"
  | "project.bulk-update"
  | "project.view-activity"
  | "project.manage-assets"
  | "project.use-ai-assistant";

export type ProjectPermissionDecision =
  | "allow"
  | "deny"
  | "not-applicable";

export interface ProjectPrincipal {
  readonly id: string;
  readonly type:
    ProjectPrincipalType;
  readonly displayName: string;
}

export interface ProjectAclEntry {
  readonly id: string;
  readonly principal:
    ProjectPrincipal;
  readonly role:
    ProjectRole;
  readonly allowedPermissions:
    readonly ProjectPermission[];
  readonly deniedPermissions:
    readonly ProjectPermission[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProjectAccessPolicy {
  readonly projectId: string;
  readonly ownerId: string;
  readonly defaultRole:
    ProjectRole | null;
  readonly entries:
    readonly ProjectAclEntry[];
  readonly version: number;
  readonly updatedAt: string;
}

export interface ProjectPermissionEvaluation {
  readonly projectId: string;
  readonly principalId: string;
  readonly permission:
    ProjectPermission;
  readonly decision:
    ProjectPermissionDecision;
  readonly role:
    ProjectRole | null;
  readonly source:
    | "owner"
    | "explicit-deny"
    | "explicit-allow"
    | "role"
    | "default-role"
    | "none";
  readonly reason: string;
}

export interface ProjectAccessSummary {
  readonly totalEntries: number;
  readonly users: number;
  readonly teams: number;
  readonly services: number;
  readonly byRole:
    Readonly<
      Record<
        ProjectRole,
        number
      >
    >;
}

const ALL_PERMISSIONS:
  readonly ProjectPermission[] = [
  "project.read",
  "project.update",
  "project.delete",
  "project.archive",
  "project.manage-members",
  "project.manage-permissions",
  "project.move-kanban",
  "project.bulk-update",
  "project.view-activity",
  "project.manage-assets",
  "project.use-ai-assistant",
];

const ROLE_PERMISSIONS:
  Readonly<
    Record<
      ProjectRole,
      readonly ProjectPermission[]
    >
  > = {
  owner:
    ALL_PERMISSIONS,

  admin: [
    "project.read",
    "project.update",
    "project.archive",
    "project.manage-members",
    "project.manage-permissions",
    "project.move-kanban",
    "project.bulk-update",
    "project.view-activity",
    "project.manage-assets",
    "project.use-ai-assistant",
  ],

  editor: [
    "project.read",
    "project.update",
    "project.move-kanban",
    "project.bulk-update",
    "project.view-activity",
    "project.manage-assets",
    "project.use-ai-assistant",
  ],

  contributor: [
    "project.read",
    "project.update",
    "project.move-kanban",
    "project.view-activity",
    "project.manage-assets",
    "project.use-ai-assistant",
  ],

  viewer: [
    "project.read",
    "project.view-activity",
  ],
};

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

function normalizePermissions(
  permissions:
    readonly ProjectPermission[] =
      [],
): ProjectPermission[] {
  return [
    ...new Set(
      permissions,
    ),
  ];
}

function createEntryId(
  projectId: string,
  principal:
    ProjectPrincipal,
): string {
  return [
    projectId,
    principal.type,
    principal.id,
  ].join(":");
}

function findAclEntry(
  policy:
    ProjectAccessPolicy,
  principal:
    ProjectPrincipal,
): ProjectAclEntry | null {
  return (
    policy.entries.find(
      (entry) =>
        entry.principal.id ===
          principal.id &&
        entry.principal.type ===
          principal.type,
    ) ??
    null
  );
}

export function getProjectRolePermissions(
  role:
    ProjectRole,
): readonly ProjectPermission[] {
  return ROLE_PERMISSIONS[
    role
  ];
}

export function createProjectAccessPolicy(
  projectId: string,
  owner:
    ProjectPrincipal,
  updatedAt?:
    string,
): ProjectAccessPolicy {
  if (
    owner.type !==
    "user"
  ) {
    throw new Error(
      "A project owner must be a user principal.",
    );
  }

  const timestamp =
    normalizeTimestamp(
      updatedAt,
    );

  const ownerEntry:
    ProjectAclEntry = {
    id:
      createEntryId(
        projectId,
        owner,
      ),
    principal:
      owner,
    role: "owner",
    allowedPermissions: [],
    deniedPermissions: [],
    createdAt:
      timestamp,
    updatedAt:
      timestamp,
  };

  return {
    projectId,
    ownerId:
      owner.id,
    defaultRole:
      null,
    entries: [
      ownerEntry,
    ],
    version: 1,
    updatedAt:
      timestamp,
  };
}

export function upsertProjectAclEntry(
  policy:
    ProjectAccessPolicy,
  principal:
    ProjectPrincipal,
  role:
    ProjectRole,
  options: {
    readonly allowedPermissions?:
      readonly ProjectPermission[];
    readonly deniedPermissions?:
      readonly ProjectPermission[];
    readonly updatedAt?: string;
  } = {},
): ProjectAccessPolicy {
  if (
    principal.id ===
      policy.ownerId &&
    role !==
      "owner"
  ) {
    throw new Error(
      "The project owner role cannot be downgraded.",
    );
  }

  if (
    role === "owner" &&
    principal.id !==
      policy.ownerId
  ) {
    throw new Error(
      "Only the configured project owner can have the owner role.",
    );
  }

  const timestamp =
    normalizeTimestamp(
      options.updatedAt,
    );

  const existing =
    findAclEntry(
      policy,
      principal,
    );

  const entry:
    ProjectAclEntry = {
    id:
      existing?.id ??
      createEntryId(
        policy.projectId,
        principal,
      ),
    principal,
    role,
    allowedPermissions:
      normalizePermissions(
        options.allowedPermissions ??
        existing
          ?.allowedPermissions ??
        [],
      ),
    deniedPermissions:
      normalizePermissions(
        options.deniedPermissions ??
        existing
          ?.deniedPermissions ??
        [],
      ),
    createdAt:
      existing?.createdAt ??
      timestamp,
    updatedAt:
      timestamp,
  };

  const entries =
    existing
      ? policy.entries.map(
          (current) =>
            current.id ===
            existing.id
              ? entry
              : current,
        )
      : [
          ...policy.entries,
          entry,
        ];

  return {
    ...policy,
    entries,
    version:
      policy.version + 1,
    updatedAt:
      timestamp,
  };
}

export function removeProjectAclEntry(
  policy:
    ProjectAccessPolicy,
  principalId: string,
  updatedAt?:
    string,
): ProjectAccessPolicy {
  if (
    principalId ===
    policy.ownerId
  ) {
    throw new Error(
      "The project owner cannot be removed from the access policy.",
    );
  }

  const entries =
    policy.entries.filter(
      (entry) =>
        entry.principal.id !==
        principalId,
    );

  if (
    entries.length ===
    policy.entries.length
  ) {
    return policy;
  }

  return {
    ...policy,
    entries,
    version:
      policy.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function setProjectDefaultRole(
  policy:
    ProjectAccessPolicy,
  defaultRole:
    ProjectRole | null,
  updatedAt?:
    string,
): ProjectAccessPolicy {
  if (
    defaultRole ===
    "owner"
  ) {
    throw new Error(
      "The owner role cannot be used as the default project role.",
    );
  }

  if (
    policy.defaultRole ===
    defaultRole
  ) {
    return policy;
  }

  return {
    ...policy,
    defaultRole,
    version:
      policy.version + 1,
    updatedAt:
      normalizeTimestamp(
        updatedAt,
      ),
  };
}

export function evaluateProjectPermission(
  policy:
    ProjectAccessPolicy,
  principal:
    ProjectPrincipal,
  permission:
    ProjectPermission,
): ProjectPermissionEvaluation {
  if (
    principal.id ===
    policy.ownerId
  ) {
    return {
      projectId:
        policy.projectId,
      principalId:
        principal.id,
      permission,
      decision: "allow",
      role: "owner",
      source: "owner",
      reason:
        "The project owner has full access.",
    };
  }

  const entry =
    findAclEntry(
      policy,
      principal,
    );

  if (
    entry
      ?.deniedPermissions
      .includes(
        permission,
      )
  ) {
    return {
      projectId:
        policy.projectId,
      principalId:
        principal.id,
      permission,
      decision: "deny",
      role:
        entry.role,
      source:
        "explicit-deny",
      reason:
        "The permission is explicitly denied by the project ACL.",
    };
  }

  if (
    entry
      ?.allowedPermissions
      .includes(
        permission,
      )
  ) {
    return {
      projectId:
        policy.projectId,
      principalId:
        principal.id,
      permission,
      decision: "allow",
      role:
        entry.role,
      source:
        "explicit-allow",
      reason:
        "The permission is explicitly allowed by the project ACL.",
    };
  }

  if (
    entry &&
    ROLE_PERMISSIONS[
      entry.role
    ].includes(
      permission,
    )
  ) {
    return {
      projectId:
        policy.projectId,
      principalId:
        principal.id,
      permission,
      decision: "allow",
      role:
        entry.role,
      source: "role",
      reason:
        `The ${entry.role} role grants this permission.`,
    };
  }

  if (entry) {
    return {
      projectId:
        policy.projectId,
      principalId:
        principal.id,
      permission,
      decision: "deny",
      role:
        entry.role,
      source: "role",
      reason:
        `The ${entry.role} role does not grant this permission.`,
    };
  }

  if (
    policy.defaultRole
  ) {
    const allowed =
      ROLE_PERMISSIONS[
        policy.defaultRole
      ].includes(
        permission,
      );

    return {
      projectId:
        policy.projectId,
      principalId:
        principal.id,
      permission,
      decision:
        allowed
          ? "allow"
          : "deny",
      role:
        policy.defaultRole,
      source:
        "default-role",
      reason:
        allowed
          ? `The default ${policy.defaultRole} role grants this permission.`
          : `The default ${policy.defaultRole} role does not grant this permission.`,
    };
  }

  return {
    projectId:
      policy.projectId,
    principalId:
      principal.id,
    permission,
    decision:
      "not-applicable",
    role: null,
    source: "none",
    reason:
      "The principal has no project ACL entry or default role.",
  };
}

export function canAccessProject(
  policy:
    ProjectAccessPolicy,
  principal:
    ProjectPrincipal,
  permission:
    ProjectPermission,
): boolean {
  return (
    evaluateProjectPermission(
      policy,
      principal,
      permission,
    ).decision ===
    "allow"
  );
}

export function evaluateProjectPermissions(
  policy:
    ProjectAccessPolicy,
  principal:
    ProjectPrincipal,
  permissions:
    readonly ProjectPermission[],
): readonly ProjectPermissionEvaluation[] {
  return permissions.map(
    (permission) =>
      evaluateProjectPermission(
        policy,
        principal,
        permission,
      ),
  );
}

export function summarizeProjectAccess(
  policy:
    ProjectAccessPolicy,
): ProjectAccessSummary {
  const byRole:
    Record<
      ProjectRole,
      number
    > = {
    owner: 0,
    admin: 0,
    editor: 0,
    contributor: 0,
    viewer: 0,
  };

  let users = 0;
  let teams = 0;
  let services = 0;

  for (
    const entry of
    policy.entries
  ) {
    byRole[
      entry.role
    ] += 1;

    switch (
      entry.principal.type
    ) {
      case "user":
        users += 1;
        break;

      case "team":
        teams += 1;
        break;

      case "service":
        services += 1;
        break;
    }
  }

  return {
    totalEntries:
      policy.entries.length,
    users,
    teams,
    services,
    byRole,
  };
}
