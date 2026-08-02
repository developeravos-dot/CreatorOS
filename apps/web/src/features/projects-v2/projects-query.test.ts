import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  projectsApi,
} from "../../api/services/projects";

import {
  queryClient,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  getCachedProjects,
  invalidateProjects,
  loadProjects,
  updateCachedProject,
} from "./projects-query";

vi.mock(
  "../../api/services/projects",
  () => ({
    projectsApi: {
      list: vi.fn(),
    },
  }),
);

const mockedProjectsApi =
  vi.mocked(projectsApi);

const projectOne = {
  id: "project-1",
  name: "Project One",
  description: "Description",
  platform: "YouTube" as const,
  status: "active" as const,
  createdAt:
    "2026-08-02T08:00:00.000Z",
  updatedAt:
    "2026-08-02T09:00:00.000Z",
};

describe(
  "projects query",
  () => {
    beforeEach(() => {
      queryClient.clear();
      vi.clearAllMocks();
    });

    it(
      "loads and caches projects",
      async () => {
        mockedProjectsApi.list
          .mockResolvedValue([
            projectOne,
          ]);

        const first =
          await loadProjects();

        const second =
          await loadProjects();

        expect(first).toEqual([
          projectOne,
        ]);

        expect(second).toEqual([
          projectOne,
        ]);

        expect(
          mockedProjectsApi.list,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          getCachedProjects(),
        ).toEqual([
          projectOne,
        ]);
      },
    );

    it(
      "forces a new request",
      async () => {
        mockedProjectsApi.list
          .mockResolvedValueOnce([
            projectOne,
          ])
          .mockResolvedValueOnce([
            {
              ...projectOne,
              name:
                "Updated Project",
            },
          ]);

        await loadProjects();

        const refreshed =
          await loadProjects(true);

        expect(
          refreshed[0]?.name,
        ).toBe(
          "Updated Project",
        );

        expect(
          mockedProjectsApi.list,
        ).toHaveBeenCalledTimes(
          2,
        );
      },
    );

    it(
      "invalidates projects cache",
      async () => {
        mockedProjectsApi.list
          .mockResolvedValue([
            projectOne,
          ]);

        await loadProjects();

        invalidateProjects();

        expect(
          queryClient.getSnapshot(
            apiQueryKeys.projects,
          ).isInvalidated,
        ).toBe(true);
      },
    );

    it(
      "updates a cached project",
      () => {
        queryClient.setQueryData(
          apiQueryKeys.projects,
          [projectOne],
        );

        updateCachedProject({
          ...projectOne,
          status: "completed",
        });

        expect(
          getCachedProjects()?.[0]
            ?.status,
        ).toBe(
          "completed",
        );
      },
    );
  },
);
