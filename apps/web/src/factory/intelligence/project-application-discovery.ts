import type {
  DiscoverProjectApplicationInput,
  ProjectApplicationDiscovery,
  ProjectEntryPointDiscovery,
  ProjectEntryPointKind,
  ProjectProviderDiscovery,
  ProjectProviderKind,
  ProjectRouteDiscovery,
  ProjectRouteKind,
  ProjectWorkspaceDiscovery,
} from "./project-application-discovery-types";

function normalizePath(
  value: string,
): string {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\.\//, "")
    .replace(/\/$/, "");
}

function getName(
  path: string,
): string {
  return (
    path
      .split("/")
      .at(-1) ??
    path
  );
}

function withoutExtension(
  value: string,
): string {
  return value.replace(
    /\.[^.]+$/,
    "",
  );
}

function createId(
  prefix: string,
  value: string,
): string {
  return `${prefix}:${normalizePath(value)}`;
}

function detectRouteKind(
  sourcePath: string,
  content: string,
): ProjectRouteKind {
  const normalized =
    sourcePath.toLowerCase();

  if (
    /<Route\b|createBrowserRouter|createRoutesFromElements/
      .test(content)
  ) {
    return "react-router";
  }

  if (
    normalized.includes(
      "/pages/api/",
    )
  ) {
    return "api-route";
  }

  if (
    normalized.includes(
      "/pages/",
    )
  ) {
    return "next-page";
  }

  if (
    normalized.includes(
      "/app/",
    ) &&
    /\/(page|route)\.[^.]+$/
      .test(normalized)
  ) {
    return normalized.includes(
      "/route."
    )
      ? "api-route"
      : "next-app";
  }

  if (
    normalized.includes(
      "route",
    ) ||
    normalized.includes(
      "router",
    )
  ) {
    return "custom";
  }

  return "unknown";
}

function routePathFromFile(
  sourcePath: string,
): string {
  const normalized =
    normalizePath(
      sourcePath,
    );

  const pagesIndex =
    normalized.indexOf(
      "/pages/",
    );

  if (pagesIndex >= 0) {
    const relative =
      normalized.slice(
        pagesIndex +
          "/pages/".length,
      );

    let route =
      withoutExtension(
        relative,
      );

    if (
      route === "index"
    ) {
      route = "";
    }
    else {
      route =
        route.replace(
          /\/index$/,
          "",
        );
    }

    if (
      route === "api"
    ) {
      route = "";
    }
    else if (
      route.startsWith(
        "api/",
      )
    ) {
      route =
        route.slice(
          "api/".length,
        );
    }

    route =
      route
        .replace(
          /\[\.\.\.([^\]]+)\]/g,
          "*$1",
        )
        .replace(
          /\[([^\]]+)\]/g,
          ":$1",
        );

    return route
      ? `/${route}`
      : "/";
  }

  const appIndex =
    normalized.indexOf(
      "/app/",
    );

  if (appIndex >= 0) {
    const relative =
      normalized.slice(
        appIndex +
          "/app/".length,
      );

    const route =
      relative
        .replace(
          /\/(page|route)\.[^.]+$/,
          "",
        )
        .replace(
          /^(page|route)\.[^.]+$/,
          "",
        )
        .replace(
          /\[([^\]]+)\]/g,
          ":$1",
        );

    return route
      ? `/${route}`
      : "/";
  }

  return "/";
}

function discoverRoutes(
  input:
    DiscoverProjectApplicationInput,
): readonly ProjectRouteDiscovery[] {
  const routes:
    ProjectRouteDiscovery[] = [];

  for (
    const file of
    input.analysis.files
  ) {
    const content =
      input.contents[
        file.path
      ] ??
      "";

    const kind =
      detectRouteKind(
        file.path,
        content,
      );

    if (
      kind === "unknown"
    ) {
      continue;
    }

    if (
      kind ===
      "react-router"
    ) {
      const routePattern =
        /<Route\b[^>]*\bpath\s*=\s*["']([^"']+)["'][^>]*(?:element\s*=\s*\{?\s*<([A-Za-z_$][\w$]*)|component\s*=\s*\{([A-Za-z_$][\w$]*))?/g;

      let match:
        RegExpExecArray | null;

      while (
        (
          match =
            routePattern.exec(
              content,
            )
        )
      ) {
        const path =
          match[1] ??
          "/";

        routes.push({
          id:
            createId(
              "route",
              `${file.path}:${path}`,
            ),
          path,
          sourcePath:
            file.path,
          component:
            match[2] ??
            match[3] ??
            null,
          kind,
          dynamic:
            path.includes(":") ||
            path.includes("*"),
          nested:
            path
              .split("/")
              .filter(Boolean)
              .length > 1,
        });
      }

      const objectRoutePattern =
        /\bpath\s*:\s*["']([^"']+)["'][\s\S]{0,250}?\b(?:element|Component|component)\s*:/g;

      while (
        (
          match =
            objectRoutePattern.exec(
              content,
            )
        )
      ) {
        const path =
          match[1] ??
          "/";

        if (
          routes.some(
            (route) =>
              route.sourcePath ===
                file.path &&
              route.path ===
                path,
          )
        ) {
          continue;
        }

        routes.push({
          id:
            createId(
              "route",
              `${file.path}:${path}`,
            ),
          path,
          sourcePath:
            file.path,
          component: null,
          kind,
          dynamic:
            path.includes(":") ||
            path.includes("*"),
          nested:
            path
              .split("/")
              .filter(Boolean)
              .length > 1,
        });
      }

      continue;
    }

    const path =
      routePathFromFile(
        file.path,
      );

    routes.push({
      id:
        createId(
          "route",
          file.path,
        ),
      path,
      sourcePath:
        file.path,
      component:
        file.hasDefaultExport
          ? "default"
          : file.exports[0]
              ?.name ??
            null,
      kind,
      dynamic:
        path.includes(":") ||
        path.includes("*"),
      nested:
        path
          .split("/")
          .filter(Boolean)
          .length > 1,
    });
  }

  return routes.sort(
    (left, right) =>
      left.path.localeCompare(
        right.path,
      ) ||
      left.sourcePath.localeCompare(
        right.sourcePath,
      ),
  );
}

function detectProviderKind(
  name: string,
  content: string,
): ProjectProviderKind {
  const value =
    `${name} ${content}`
      .toLowerCase();

  if (
    value.includes(
      "queryclientprovider",
    )
  ) {
    return "query-client";
  }

  if (
    value.includes(
      "redux"
    ) ||
    value.includes(
      "storeprovider",
    )
  ) {
    return "redux";
  }

  if (
    value.includes(
      "themeprovider",
    )
  ) {
    return "theme";
  }

  if (
    value.includes(
      "routerprovider",
    ) ||
    value.includes(
      "browserrouter",
    )
  ) {
    return "router";
  }

  if (
    value.includes(
      "authprovider",
    ) ||
    value.includes(
      "authenticationprovider",
    )
  ) {
    return "authentication";
  }

  if (
    value.includes(
      "createcontext",
    ) ||
    value.includes(
      "context.provider",
    )
  ) {
    return "react-context";
  }

  return "custom";
}

function discoverProviders(
  input:
    DiscoverProjectApplicationInput,
): readonly ProjectProviderDiscovery[] {
  const providers:
    ProjectProviderDiscovery[] = [];

  for (
    const file of
    input.analysis.files
  ) {
    const content =
      input.contents[
        file.path
      ] ??
      "";

    const names =
      new Set<string>();

    const patterns = [
      /(?:export\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*Provider)\b/g,
      /createContext\s*(?:<[^>]*>)?\s*\(/g,
      /\b(QueryClientProvider|RouterProvider|BrowserRouter|ThemeProvider|Provider)\b/g,
    ];

    for (
      const pattern of
      patterns
    ) {
      let match:
        RegExpExecArray | null;

      while (
        (
          match =
            pattern.exec(
              content,
            )
        )
      ) {
        names.add(
          match[1] ??
          `${withoutExtension(
            getName(
              file.path,
            ),
          )}Context`,
        );
      }
    }

    for (const name of names) {
      providers.push({
        id:
          createId(
            "provider",
            `${file.path}:${name}`,
          ),
        name,
        sourcePath:
          file.path,
        kind:
          detectProviderKind(
            name,
            content,
          ),
        exported:
          file.exports.some(
            (item) =>
              item.name ===
                name ||
              item.name ===
                "default",
          ),
      });
    }
  }

  return providers.sort(
    (left, right) =>
      left.name.localeCompare(
        right.name,
      ),
  );
}

function getWorkspaceRoot(
  path: string,
): string | null {
  const normalized =
    normalizePath(
      path,
    );

  const featureMatch =
    normalized.match(
      /^(.*?\/(?:features|workspaces|modules)\/[^/]+)(?:\/|$)/,
    );

  if (
    featureMatch?.[1]
  ) {
    return featureMatch[1];
  }

  return null;
}

function discoverWorkspaces(
  input:
    DiscoverProjectApplicationInput,
): readonly ProjectWorkspaceDiscovery[] {
  const groups =
    new Map<
      string,
      {
        sourceFiles:
          string[];
        testFiles:
          string[];
        styleFiles:
          string[];
        indexFiles:
          string[];
      }
    >();

  for (
    const node of
    input.inventory.nodes
  ) {
    if (
      node.type !== "file"
    ) {
      continue;
    }

    const root =
      getWorkspaceRoot(
        node.path,
      );

    if (!root) {
      continue;
    }

    const current =
      groups.get(
        root,
      ) ?? {
        sourceFiles: [],
        testFiles: [],
        styleFiles: [],
        indexFiles: [],
      };

    if (
      node.role === "test"
    ) {
      current.testFiles.push(
        node.path,
      );
    }
    else if (
      node.role === "style"
    ) {
      current.styleFiles.push(
        node.path,
      );
    }
    else if (
      /(^|\/)index\.[^.]+$/
        .test(
          node.path,
        )
    ) {
      current.indexFiles.push(
        node.path,
      );

      current.sourceFiles.push(
        node.path,
      );
    }
    else if (
      node.role === "source"
    ) {
      current.sourceFiles.push(
        node.path,
      );
    }

    groups.set(
      root,
      current,
    );
  }

  return [
    ...groups.entries(),
  ]
    .map(
      (
        [
          rootPath,
          value,
        ],
      ): ProjectWorkspaceDiscovery => ({
        id:
          createId(
            "workspace",
            rootPath,
          ),
        name:
          getName(
            rootPath,
          ),
        rootPath,
        sourceFiles:
          value.sourceFiles
            .sort(),
        testFiles:
          value.testFiles
            .sort(),
        styleFiles:
          value.styleFiles
            .sort(),
        indexFiles:
          value.indexFiles
            .sort(),
      }),
    )
    .sort(
      (left, right) =>
        left.rootPath.localeCompare(
          right.rootPath,
        ),
    );
}

function detectEntryPointKind(
  path: string,
): ProjectEntryPointKind {
  const normalized =
    path.toLowerCase();

  if (
    /\.(test|spec)\.[^.]+$/
      .test(normalized)
  ) {
    return "test";
  }

  if (
    /(^|\/)(main|app)\.(tsx?|jsx?)$/
      .test(normalized)
  ) {
    return "application";
  }

  if (
    /(^|\/)(server|bootstrap)\.(tsx?|jsx?)$/
      .test(normalized)
  ) {
    return "server";
  }

  if (
    normalized.endsWith(
      "package.json",
    )
  ) {
    return "package";
  }

  if (
    /(^|\/)index\.(tsx?|jsx?)$/
      .test(normalized)
  ) {
    return "library";
  }

  return "unknown";
}

function discoverEntryPoints(
  input:
    DiscoverProjectApplicationInput,
): readonly ProjectEntryPointDiscovery[] {
  return input.analysis.files
    .map(
      (
        file,
      ): ProjectEntryPointDiscovery => ({
        path:
          file.path,
        kind:
          detectEntryPointKind(
            file.path,
          ),
        defaultExport:
          file.hasDefaultExport,
        exportedSymbols:
          file.exports.map(
            (item) =>
              item.name,
          ),
      }),
    )
    .filter(
      (entry) =>
        entry.kind !==
        "unknown",
    )
    .sort(
      (left, right) =>
        left.path.localeCompare(
          right.path,
        ),
    );
}

export function discoverProjectApplication(
  input:
    DiscoverProjectApplicationInput,
): ProjectApplicationDiscovery {
  const routes =
    discoverRoutes(
      input,
    );

  const providers =
    discoverProviders(
      input,
    );

  const workspaces =
    discoverWorkspaces(
      input,
    );

  const entryPoints =
    discoverEntryPoints(
      input,
    );

  return {
    schema:
      "creatoros.factory.project-application-discovery",
    version:
      "1.0.0",
    routes,
    providers,
    workspaces,
    entryPoints,
    summary: {
      routes:
        routes.length,
      dynamicRoutes:
        routes.filter(
          (route) =>
            route.dynamic,
        ).length,
      providers:
        providers.length,
      workspaces:
        workspaces.length,
      entryPoints:
        entryPoints.length,
    },
  };
}
