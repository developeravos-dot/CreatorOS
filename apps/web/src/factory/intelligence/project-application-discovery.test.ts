import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildProjectInventory,
} from "./project-inventory-engine";

import {
  analyzeProjectSources,
} from "./typescript-source-analyzer";

import {
  discoverProjectApplication,
} from "./project-application-discovery";

function createFixture() {
  const files = [
    {
      path:
        "apps/web/src/main.tsx",
    },
    {
      path:
        "apps/web/src/router.tsx",
    },
    {
      path:
        "apps/web/src/providers/AuthProvider.tsx",
    },
    {
      path:
        "apps/web/src/providers/ThemeProvider.tsx",
    },
    {
      path:
        "apps/web/src/features/projects-v2/index.ts",
    },
    {
      path:
        "apps/web/src/features/projects-v2/ProjectsWorkspace.tsx",
    },
    {
      path:
        "apps/web/src/features/projects-v2/ProjectsWorkspace.test.tsx",
    },
    {
      path:
        "apps/web/src/features/projects-v2/projects.css",
    },
    {
      path:
        "apps/web/src/features/scripts-v2/index.ts",
    },
    {
      path:
        "apps/web/src/features/scripts-v2/ScriptsWorkspace.tsx",
    },
  ];

  const contents = {
    "apps/web/src/main.tsx": `
      import {
        App,
      } from "./App";

      export function bootstrap() {
        return App;
      }
    `,

    "apps/web/src/router.tsx": `
      import {
        Route,
      } from "react-router-dom";

      export function Router() {
        return (
          <>
            <Route
              path="/projects"
              element={<ProjectsWorkspace />}
            />

            <Route
              path="/projects/:projectId"
              element={<ProjectDetails />}
            />
          </>
        );
      }
    `,

    "apps/web/src/providers/AuthProvider.tsx": `
      import {
        createContext,
      } from "react";

      export const AuthContext =
        createContext(null);

      export function AuthProvider() {
        return null;
      }
    `,

    "apps/web/src/providers/ThemeProvider.tsx": `
      export function ThemeProvider() {
        return null;
      }
    `,

    "apps/web/src/features/projects-v2/index.ts":
      'export * from "./ProjectsWorkspace";',

    "apps/web/src/features/projects-v2/ProjectsWorkspace.tsx":
      "export function ProjectsWorkspace() {}",

    "apps/web/src/features/projects-v2/ProjectsWorkspace.test.tsx":
      "export const testValue = true;",

    "apps/web/src/features/projects-v2/projects.css":
      ".root {}",

    "apps/web/src/features/scripts-v2/index.ts":
      'export * from "./ScriptsWorkspace";',

    "apps/web/src/features/scripts-v2/ScriptsWorkspace.tsx":
      "export default function ScriptsWorkspace() {}",
  };

  const inventory =
    buildProjectInventory({
      repositoryRoot:
        ".",
      files,
    });

  const analysis =
    analyzeProjectSources(
      inventory,
      contents,
    );

  return {
    inventory,
    analysis,
    contents,
  };
}

describe(
  "project application discovery",
  () => {
    it(
      "discovers React Router routes",
      () => {
        const discovery =
          discoverProjectApplication(
            createFixture(),
          );

        expect(
          discovery.routes.map(
            (route) =>
              route.path,
          ),
        ).toEqual([
          "/projects",
          "/projects/:projectId",
        ]);

        expect(
          discovery.routes[1],
        ).toEqual(
          expect.objectContaining({
            dynamic: true,
            nested: true,
            kind:
              "react-router",
          }),
        );
      },
    );

    it(
      "discovers providers",
      () => {
        const discovery =
          discoverProjectApplication(
            createFixture(),
          );

        expect(
          discovery.providers.map(
            (provider) =>
              provider.name,
          ),
        ).toContain(
          "AuthProvider",
        );

        expect(
          discovery.providers,
        ).toContainEqual(
          expect.objectContaining({
            name:
              "ThemeProvider",
            kind: "theme",
          }),
        );

        expect(
          discovery.providers,
        ).toContainEqual(
          expect.objectContaining({
            name:
              "AuthProvider",
            kind:
              "authentication",
          }),
        );
      },
    );

    it(
      "discovers feature workspaces",
      () => {
        const discovery =
          discoverProjectApplication(
            createFixture(),
          );

        expect(
          discovery.workspaces,
        ).toHaveLength(2);

        const projects =
          discovery.workspaces.find(
            (workspace) =>
              workspace.name ===
              "projects-v2",
          );

        expect(projects)
          .toEqual(
            expect.objectContaining({
              rootPath:
                "apps/web/src/features/projects-v2",
            }),
          );

        expect(
          projects?.testFiles,
        ).toEqual([
          "apps/web/src/features/projects-v2/ProjectsWorkspace.test.tsx",
        ]);

        expect(
          projects?.styleFiles,
        ).toEqual([
          "apps/web/src/features/projects-v2/projects.css",
        ]);
      },
    );

    it(
      "discovers application and library entry points",
      () => {
        const discovery =
          discoverProjectApplication(
            createFixture(),
          );

        expect(
          discovery.entryPoints,
        ).toContainEqual(
          expect.objectContaining({
            path:
              "apps/web/src/main.tsx",
            kind:
              "application",
          }),
        );

        expect(
          discovery.entryPoints,
        ).toContainEqual(
          expect.objectContaining({
            path:
              "apps/web/src/features/projects-v2/index.ts",
            kind:
              "library",
          }),
        );
      },
    );

    it(
      "creates an application summary",
      () => {
        const discovery =
          discoverProjectApplication(
            createFixture(),
          );

        expect(
          discovery.summary,
        ).toEqual({
          routes: 2,
          dynamicRoutes: 1,
          providers:
            discovery.providers
              .length,
          workspaces: 2,
          entryPoints:
            discovery.entryPoints
              .length,
        });
      },
    );

    it(
      "discovers file-system routes",
      () => {
        const files = [
          {
            path:
              "apps/web/src/pages/index.tsx",
          },
          {
            path:
              "apps/web/src/pages/projects/[projectId].tsx",
          },
          {
            path:
              "apps/web/src/app/dashboard/page.tsx",
          },
          {
            path:
              "apps/web/src/pages/api/health.ts",
          },
        ];

        const contents = {
          "apps/web/src/pages/index.tsx":
            "export default function Home() {}",
          "apps/web/src/pages/projects/[projectId].tsx":
            "export default function Project() {}",
          "apps/web/src/app/dashboard/page.tsx":
            "export default function Dashboard() {}",
          "apps/web/src/pages/api/health.ts":
            "export default function health() {}",
        };

        const inventory =
          buildProjectInventory({
            repositoryRoot:
              ".",
            files,
          });

        const analysis =
          analyzeProjectSources(
            inventory,
            contents,
          );

        const discovery =
          discoverProjectApplication({
            inventory,
            analysis,
            contents,
          });

        expect(
          discovery.routes.map(
            (route) => [
              route.path,
              route.kind,
            ],
          ),
        ).toEqual([
          [
            "/",
            "next-page",
          ],
          [
            "/dashboard",
            "next-app",
          ],
          [
            "/health",
            "api-route",
          ],
          [
            "/projects/:projectId",
            "next-page",
          ],
        ]);
      },
    );
  },
);
