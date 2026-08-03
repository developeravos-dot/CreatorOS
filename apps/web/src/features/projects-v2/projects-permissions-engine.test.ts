import {
  describe,
  expect,
  it,
} from "vitest";

import {
  canAccessProject,
  createProjectAccessPolicy,
  evaluateProjectPermission,
  evaluateProjectPermissions,
  getProjectRolePermissions,
  removeProjectAclEntry,
  setProjectDefaultRole,
  summarizeProjectAccess,
  upsertProjectAclEntry,
  type ProjectPrincipal,
} from "./projects-permissions-engine";

const owner:
  ProjectPrincipal = {
  id: "owner-user",
  type: "user",
  displayName:
    "Project Owner",
};

const editor:
  ProjectPrincipal = {
  id: "editor-user",
  type: "user",
  displayName:
    "Project Editor",
};

const team:
  ProjectPrincipal = {
  id: "content-team",
  type: "team",
  displayName:
    "Content Team",
};

describe(
  "projects permissions engine",
  () => {
    it(
      "creates an owner policy",
      () => {
        const policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
            "2026-08-03T10:30:00.000Z",
          );

        expect(policy.ownerId)
          .toBe(owner.id);

        expect(policy.entries)
          .toHaveLength(1);

        expect(
          policy.entries[0]
            ?.role,
        ).toBe("owner");
      },
    );

    it(
      "requires a user owner",
      () => {
        expect(
          () =>
            createProjectAccessPolicy(
              "project-acl",
              team,
            ),
        ).toThrow(
          "A project owner must be a user principal.",
        );
      },
    );

    it(
      "gives the owner full access",
      () => {
        const policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        expect(
          canAccessProject(
            policy,
            owner,
            "project.delete",
          ),
        ).toBe(true);

        expect(
          evaluateProjectPermission(
            policy,
            owner,
            "project.manage-permissions",
          ).source,
        ).toBe("owner");
      },
    );

    it(
      "adds and updates ACL entries",
      () => {
        let policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        policy =
          upsertProjectAclEntry(
            policy,
            editor,
            "editor",
            {
              allowedPermissions: [
                "project.archive",
              ],
            },
          );

        expect(policy.entries)
          .toHaveLength(2);

        expect(
          canAccessProject(
            policy,
            editor,
            "project.update",
          ),
        ).toBe(true);

        expect(
          evaluateProjectPermission(
            policy,
            editor,
            "project.archive",
          ).source,
        ).toBe(
          "explicit-allow",
        );
      },
    );

    it(
      "applies explicit deny before role permissions",
      () => {
        let policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        policy =
          upsertProjectAclEntry(
            policy,
            editor,
            "editor",
            {
              deniedPermissions: [
                "project.update",
              ],
            },
          );

        const evaluation =
          evaluateProjectPermission(
            policy,
            editor,
            "project.update",
          );

        expect(
          evaluation.decision,
        ).toBe("deny");

        expect(
          evaluation.source,
        ).toBe(
          "explicit-deny",
        );
      },
    );

    it(
      "prevents owner downgrade and removal",
      () => {
        const policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        expect(
          () =>
            upsertProjectAclEntry(
              policy,
              owner,
              "viewer",
            ),
        ).toThrow(
          "The project owner role cannot be downgraded.",
        );

        expect(
          () =>
            removeProjectAclEntry(
              policy,
              owner.id,
            ),
        ).toThrow(
          "The project owner cannot be removed from the access policy.",
        );
      },
    );

    it(
      "uses a default project role",
      () => {
        let policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        policy =
          setProjectDefaultRole(
            policy,
            "viewer",
          );

        const guest:
          ProjectPrincipal = {
          id: "guest-user",
          type: "user",
          displayName:
            "Guest User",
        };

        expect(
          canAccessProject(
            policy,
            guest,
            "project.read",
          ),
        ).toBe(true);

        expect(
          canAccessProject(
            policy,
            guest,
            "project.update",
          ),
        ).toBe(false);
      },
    );

    it(
      "does not allow owner as default role",
      () => {
        const policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        expect(
          () =>
            setProjectDefaultRole(
              policy,
              "owner",
            ),
        ).toThrow(
          "The owner role cannot be used as the default project role.",
        );
      },
    );

    it(
      "returns not-applicable without entry or default role",
      () => {
        const policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        const evaluation =
          evaluateProjectPermission(
            policy,
            editor,
            "project.read",
          );

        expect(
          evaluation.decision,
        ).toBe(
          "not-applicable",
        );

        expect(
          evaluation.source,
        ).toBe("none");
      },
    );

    it(
      "evaluates several permissions",
      () => {
        let policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        policy =
          upsertProjectAclEntry(
            policy,
            editor,
            "editor",
          );

        const results =
          evaluateProjectPermissions(
            policy,
            editor,
            [
              "project.read",
              "project.update",
              "project.delete",
            ],
          );

        expect(
          results.map(
            (result) =>
              result.decision,
          ),
        ).toEqual([
          "allow",
          "allow",
          "deny",
        ]);
      },
    );

    it(
      "removes non-owner entries",
      () => {
        let policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        policy =
          upsertProjectAclEntry(
            policy,
            editor,
            "editor",
          );

        policy =
          removeProjectAclEntry(
            policy,
            editor.id,
          );

        expect(policy.entries)
          .toHaveLength(1);
      },
    );

    it(
      "summarizes the ACL",
      () => {
        let policy =
          createProjectAccessPolicy(
            "project-acl",
            owner,
          );

        policy =
          upsertProjectAclEntry(
            policy,
            editor,
            "editor",
          );

        policy =
          upsertProjectAclEntry(
            policy,
            team,
            "contributor",
          );

        const summary =
          summarizeProjectAccess(
            policy,
          );

        expect(summary)
          .toEqual({
            totalEntries: 3,
            users: 2,
            teams: 1,
            services: 0,
            byRole: {
              owner: 1,
              admin: 0,
              editor: 1,
              contributor: 1,
              viewer: 0,
            },
          });
      },
    );

    it(
      "exposes role capability definitions",
      () => {
        expect(
          getProjectRolePermissions(
            "viewer",
          ),
        ).toEqual([
          "project.read",
          "project.view-activity",
        ]);

        expect(
          getProjectRolePermissions(
            "owner",
          ),
        ).toContain(
          "project.delete",
        );
      },
    );
  },
);
