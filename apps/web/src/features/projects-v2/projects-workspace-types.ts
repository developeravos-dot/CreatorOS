import type {
  EnterpriseProject,
} from "../../enterprise-api";

export type ProjectSortField =
  | "name"
  | "platform"
  | "status"
  | "createdAt"
  | "updatedAt";

export type ProjectSortDirection =
  | "asc"
  | "desc";

export type ProjectsViewMode =
  | "table"
  | "kanban";

export interface ProjectsWorkspacePreferences {
  sortField: ProjectSortField;
  sortDirection: ProjectSortDirection;
  pageSize: number;
  viewMode: ProjectsViewMode;
}

export interface ProjectsWorkspaceQuery {
  search: string;
  platform: string;
  status: string;
  page: number;
}

export interface ProjectsWorkspaceResult {
  projects: EnterpriseProject[];
  totalProjects: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export const PROJECTS_PAGE_SIZES =
  [10, 20, 50] as const;

export const DEFAULT_PROJECTS_WORKSPACE_PREFERENCES:
  ProjectsWorkspacePreferences = {
  sortField: "updatedAt",
  sortDirection: "desc",
  pageSize: 10,
  viewMode: "table",
};

export const DEFAULT_PROJECTS_WORKSPACE_QUERY:
  ProjectsWorkspaceQuery = {
  search: "",
  platform: "all",
  status: "all",
  page: 1,
};
