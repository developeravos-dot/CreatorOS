import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  EnterpriseProject,
  EnterprisePlatform,
  ProjectStatus,
} from "../../enterprise-api";

import type {
  ProjectSortDirection,
  ProjectSortField,
  ProjectsViewMode,
} from "./projects-workspace-types";

export interface ProjectsWorkspaceFilters {
  search: string;
  platform:
    | EnterprisePlatform
    | "all";
  status:
    | ProjectStatus
    | "all";
}

export interface ProjectsWorkspaceState {
  filters: ProjectsWorkspaceFilters;
  sortField: ProjectSortField;
  sortDirection:
    ProjectSortDirection;
  page: number;
  pageSize: number;
  viewMode: ProjectsViewMode;
  selectedIds:
    ReadonlySet<string>;
  currentProject:
    EnterpriseProject | null;
}

export interface ProjectsWorkspaceActions {
  setSearch: (
    value: string,
  ) => void;

  setPlatform: (
    value:
      | EnterprisePlatform
      | "all",
  ) => void;

  setStatus: (
    value:
      | ProjectStatus
      | "all",
  ) => void;

  setSortField: (
    value: ProjectSortField,
  ) => void;

  setSortDirection: (
    value:
      ProjectSortDirection,
  ) => void;

  toggleSort: (
    value: ProjectSortField,
  ) => void;

  setPage: (
    value: number,
  ) => void;

  setPageSize: (
    value: number,
  ) => void;

  setViewMode: (
    value: ProjectsViewMode,
  ) => void;

  setCurrentProject: (
    value:
      EnterpriseProject | null,
  ) => void;

  toggleSelectedId: (
    projectId: string,
  ) => void;

  selectIds: (
    projectIds:
      readonly string[],
  ) => void;

  deselectIds: (
    projectIds:
      readonly string[],
  ) => void;

  replaceSelectedIds: (
    projectIds:
      Iterable<string>,
  ) => void;

  clearSelection: () => void;
  resetFilters: () => void;
  resetWorkspace: () => void;
}

export interface ProjectsWorkspaceContextValue {
  state: ProjectsWorkspaceState;
  actions:
    ProjectsWorkspaceActions;
}

export interface ProjectsWorkspaceProviderProps {
  initialState?:
    Partial<ProjectsWorkspaceState>;
}

const DEFAULT_FILTERS:
  ProjectsWorkspaceFilters = {
  search: "",
  platform: "all",
  status: "all",
};

const DEFAULT_STATE:
  ProjectsWorkspaceState = {
  filters: DEFAULT_FILTERS,
  sortField: "updatedAt",
  sortDirection: "desc",
  page: 1,
  pageSize: 10,
  viewMode: "table",
  selectedIds:
    new Set<string>(),
  currentProject: null,
};

const ProjectsWorkspaceContext =
  createContext<
    ProjectsWorkspaceContextValue
    | null
  >(null);

function normalizePage(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor(value),
  );
}

function normalizePageSize(
  value: number,
): number {
  const supportedSizes =
    [10, 20, 50];

  return supportedSizes.includes(
    value,
  )
    ? value
    : 10;
}

function createInitialState(
  initialState:
    Partial<ProjectsWorkspaceState>
    | undefined,
): ProjectsWorkspaceState {
  return {
    ...DEFAULT_STATE,
    ...initialState,

    filters: {
      ...DEFAULT_FILTERS,
      ...initialState?.filters,
    },

    page: normalizePage(
      initialState?.page ??
        DEFAULT_STATE.page,
    ),

    pageSize:
      normalizePageSize(
        initialState?.pageSize ??
          DEFAULT_STATE.pageSize,
      ),

    selectedIds:
      new Set(
        initialState?.selectedIds ??
          [],
      ),
  };
}

export function ProjectsWorkspaceProvider({
  initialState,
  children,
}: PropsWithChildren<
  ProjectsWorkspaceProviderProps
>) {
  const [
    state,
    setState,
  ] = useState<
    ProjectsWorkspaceState
  >(
    () =>
      createInitialState(
        initialState,
      ),
  );

  const setSearch =
    useCallback(
      (
        value: string,
      ): void => {
        setState(
          (current) => ({
            ...current,

            filters: {
              ...current.filters,
              search: value,
            },

            page: 1,
          }),
        );
      },
      [],
    );

  const setPlatform =
    useCallback(
      (
        value:
          | EnterprisePlatform
          | "all",
      ): void => {
        setState(
          (current) => ({
            ...current,

            filters: {
              ...current.filters,
              platform: value,
            },

            page: 1,
          }),
        );
      },
      [],
    );

  const setStatus =
    useCallback(
      (
        value:
          | ProjectStatus
          | "all",
      ): void => {
        setState(
          (current) => ({
            ...current,

            filters: {
              ...current.filters,
              status: value,
            },

            page: 1,
          }),
        );
      },
      [],
    );

  const setSortField =
    useCallback(
      (
        value:
          ProjectSortField,
      ): void => {
        setState(
          (current) => ({
            ...current,
            sortField: value,
            page: 1,
          }),
        );
      },
      [],
    );

  const setSortDirection =
    useCallback(
      (
        value:
          ProjectSortDirection,
      ): void => {
        setState(
          (current) => ({
            ...current,
            sortDirection: value,
            page: 1,
          }),
        );
      },
      [],
    );

  const toggleSort =
    useCallback(
      (
        value:
          ProjectSortField,
      ): void => {
        setState(
          (current) => {
            if (
              current.sortField ===
              value
            ) {
              return {
                ...current,

                sortDirection:
                  current.sortDirection ===
                  "asc"
                    ? "desc"
                    : "asc",

                page: 1,
              };
            }

            return {
              ...current,
              sortField: value,
              sortDirection: "asc",
              page: 1,
            };
          },
        );
      },
      [],
    );

  const setPage =
    useCallback(
      (
        value: number,
      ): void => {
        setState(
          (current) => ({
            ...current,

            page:
              normalizePage(
                value,
              ),
          }),
        );
      },
      [],
    );

  const setPageSize =
    useCallback(
      (
        value: number,
      ): void => {
        setState(
          (current) => ({
            ...current,

            pageSize:
              normalizePageSize(
                value,
              ),

            page: 1,
          }),
        );
      },
      [],
    );

  const setViewMode =
    useCallback(
      (
        value:
          ProjectsViewMode,
      ): void => {
        setState(
          (current) => ({
            ...current,
            viewMode: value,
          }),
        );
      },
      [],
    );

  const setCurrentProject =
    useCallback(
      (
        value:
          EnterpriseProject | null,
      ): void => {
        setState(
          (current) => ({
            ...current,
            currentProject: value,
          }),
        );
      },
      [],
    );

  const toggleSelectedId =
    useCallback(
      (
        projectId: string,
      ): void => {
        setState(
          (current) => {
            const selectedIds =
              new Set(
                current.selectedIds,
              );

            if (
              selectedIds.has(
                projectId,
              )
            ) {
              selectedIds.delete(
                projectId,
              );
            } else {
              selectedIds.add(
                projectId,
              );
            }

            return {
              ...current,
              selectedIds,
            };
          },
        );
      },
      [],
    );

  const selectIds =
    useCallback(
      (
        projectIds:
          readonly string[],
      ): void => {
        setState(
          (current) => {
            const selectedIds =
              new Set(
                current.selectedIds,
              );

            for (
              const projectId of
              projectIds
            ) {
              selectedIds.add(
                projectId,
              );
            }

            return {
              ...current,
              selectedIds,
            };
          },
        );
      },
      [],
    );

  const deselectIds =
    useCallback(
      (
        projectIds:
          readonly string[],
      ): void => {
        setState(
          (current) => {
            const selectedIds =
              new Set(
                current.selectedIds,
              );

            for (
              const projectId of
              projectIds
            ) {
              selectedIds.delete(
                projectId,
              );
            }

            return {
              ...current,
              selectedIds,
            };
          },
        );
      },
      [],
    );

  const replaceSelectedIds =
    useCallback(
      (
        projectIds:
          Iterable<string>,
      ): void => {
        setState(
          (current) => ({
            ...current,

            selectedIds:
              new Set(
                projectIds,
              ),
          }),
        );
      },
      [],
    );

  const clearSelection =
    useCallback(
      (): void => {
        setState(
          (current) => ({
            ...current,

            selectedIds:
              new Set<string>(),
          }),
        );
      },
      [],
    );

  const resetFilters =
    useCallback(
      (): void => {
        setState(
          (current) => ({
            ...current,

            filters: {
              ...DEFAULT_FILTERS,
            },

            page: 1,
          }),
        );
      },
      [],
    );

  const resetWorkspace =
    useCallback(
      (): void => {
        setState(
          createInitialState(
            initialState,
          ),
        );
      },
      [initialState],
    );

  const actions =
    useMemo<
      ProjectsWorkspaceActions
    >(
      () => ({
        setSearch,
        setPlatform,
        setStatus,
        setSortField,
        setSortDirection,
        toggleSort,
        setPage,
        setPageSize,
        setViewMode,
        setCurrentProject,
        toggleSelectedId,
        selectIds,
        deselectIds,
        replaceSelectedIds,
        clearSelection,
        resetFilters,
        resetWorkspace,
      }),
      [
        clearSelection,
        deselectIds,
        replaceSelectedIds,
        resetFilters,
        resetWorkspace,
        selectIds,
        setCurrentProject,
        setPage,
        setPageSize,
        setPlatform,
        setSearch,
        setSortDirection,
        setSortField,
        setStatus,
        setViewMode,
        toggleSelectedId,
        toggleSort,
      ],
    );

  const value =
    useMemo<
      ProjectsWorkspaceContextValue
    >(
      () => ({
        state,
        actions,
      }),
      [
        actions,
        state,
      ],
    );

  return (
    <ProjectsWorkspaceContext.Provider
      value={value}
    >
      {children}
    </ProjectsWorkspaceContext.Provider>
  );
}

export function useProjectsWorkspace():
  ProjectsWorkspaceContextValue {
  const context =
    useContext(
      ProjectsWorkspaceContext,
    );

  if (!context) {
    throw new Error(
      "ProjectsWorkspaceProvider is missing.",
    );
  }

  return context;
}

export function useProjectsWorkspaceState():
  ProjectsWorkspaceState {
  return useProjectsWorkspace()
    .state;
}

export function useProjectsWorkspaceActions():
  ProjectsWorkspaceActions {
  return useProjectsWorkspace()
    .actions;
}
