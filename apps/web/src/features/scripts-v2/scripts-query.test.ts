import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  scriptsApi,
} from "../../api/services/scripts";

import {
  queryClient,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  getCachedScripts,
  invalidateScripts,
  loadScripts,
  updateCachedScript,
} from "./scripts-query";

vi.mock(
  "../../api/services/scripts",
  () => ({
    scriptsApi: {
      list: vi.fn(),
    },
  }),
);

const mockedScriptsApi =
  vi.mocked(scriptsApi);

const scriptOne = {
  id: "script-1",
  projectId: "project-1",
  title: "Script One",
  content: "Content",
  status: "draft" as const,
  createdAt:
    "2026-08-02T08:00:00.000Z",
  updatedAt:
    "2026-08-02T09:00:00.000Z",
};

describe(
  "scripts query",
  () => {
    beforeEach(() => {
      queryClient.clear();
      vi.clearAllMocks();
    });

    it(
      "loads and caches scripts",
      async () => {
        mockedScriptsApi.list
          .mockResolvedValue([
            scriptOne,
          ]);

        await loadScripts();
        await loadScripts();

        expect(
          mockedScriptsApi.list,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          getCachedScripts(),
        ).toEqual([
          scriptOne,
        ]);
      },
    );

    it(
      "forces script refresh",
      async () => {
        mockedScriptsApi.list
          .mockResolvedValueOnce([
            scriptOne,
          ])
          .mockResolvedValueOnce([
            {
              ...scriptOne,
              status:
                "approved",
            },
          ]);

        await loadScripts();

        const refreshed =
          await loadScripts(true);

        expect(
          refreshed[0]?.status,
        ).toBe(
          "approved",
        );

        expect(
          mockedScriptsApi.list,
        ).toHaveBeenCalledTimes(
          2,
        );
      },
    );

    it(
      "invalidates scripts",
      async () => {
        mockedScriptsApi.list
          .mockResolvedValue([
            scriptOne,
          ]);

        await loadScripts();

        invalidateScripts();

        expect(
          queryClient.getSnapshot(
            apiQueryKeys.scripts,
          ).isInvalidated,
        ).toBe(true);
      },
    );

    it(
      "adds a missing script to cache",
      () => {
        queryClient.setQueryData(
          apiQueryKeys.scripts,
          [scriptOne],
        );

        const secondScript = {
          ...scriptOne,
          id: "script-2",
          title: "Script Two",
        };

        updateCachedScript(
          secondScript,
        );

        expect(
          getCachedScripts(),
        ).toHaveLength(2);

        expect(
          getCachedScripts()?.[0]
            ?.id,
        ).toBe(
          "script-2",
        );
      },
    );

    it(
      "updates an existing cached script",
      () => {
        queryClient.setQueryData(
          apiQueryKeys.scripts,
          [scriptOne],
        );

        updateCachedScript({
          ...scriptOne,
          title:
            "Updated Script",
        });

        expect(
          getCachedScripts()?.[0]
            ?.title,
        ).toBe(
          "Updated Script",
        );
      },
    );
  },
);
