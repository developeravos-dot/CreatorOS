import type {
  ProjectInventory,
} from "./project-intelligence-types";

import type {
  ProjectSourceAnalysis,
} from "./project-source-analysis-types";

export type ProjectRouteKind =
  | "react-router"
  | "next-page"
  | "next-app"
  | "api-route"
  | "custom"
  | "unknown";

export interface ProjectRouteDiscovery {
  readonly id: string;
  readonly path: string;
  readonly sourcePath: string;
  readonly component:
    string | null;
  readonly kind:
    ProjectRouteKind;
  readonly dynamic: boolean;
  readonly nested: boolean;
}

export type ProjectProviderKind =
  | "react-context"
  | "redux"
  | "query-client"
  | "theme"
  | "router"
  | "authentication"
  | "custom";

export interface ProjectProviderDiscovery {
  readonly id: string;
  readonly name: string;
  readonly sourcePath: string;
  readonly kind:
    ProjectProviderKind;
  readonly exported: boolean;
}

export interface ProjectWorkspaceDiscovery {
  readonly id: string;
  readonly name: string;
  readonly rootPath: string;
  readonly sourceFiles:
    readonly string[];
  readonly testFiles:
    readonly string[];
  readonly styleFiles:
    readonly string[];
  readonly indexFiles:
    readonly string[];
}

export type ProjectEntryPointKind =
  | "application"
  | "server"
  | "library"
  | "package"
  | "test"
  | "unknown";

export interface ProjectEntryPointDiscovery {
  readonly path: string;
  readonly kind:
    ProjectEntryPointKind;
  readonly defaultExport: boolean;
  readonly exportedSymbols:
    readonly string[];
}

export interface ProjectApplicationDiscovery {
  readonly schema:
    "creatoros.factory.project-application-discovery";
  readonly version:
    "1.0.0";
  readonly routes:
    readonly ProjectRouteDiscovery[];
  readonly providers:
    readonly ProjectProviderDiscovery[];
  readonly workspaces:
    readonly ProjectWorkspaceDiscovery[];
  readonly entryPoints:
    readonly ProjectEntryPointDiscovery[];
  readonly summary: {
    readonly routes: number;
    readonly dynamicRoutes: number;
    readonly providers: number;
    readonly workspaces: number;
    readonly entryPoints: number;
  };
}

export interface DiscoverProjectApplicationInput {
  readonly inventory:
    ProjectInventory;
  readonly analysis:
    ProjectSourceAnalysis;
  readonly contents:
    Readonly<
      Record<
        string,
        string
      >
    >;
}
