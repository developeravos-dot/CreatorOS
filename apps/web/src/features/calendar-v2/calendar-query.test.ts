import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  calendarApi,
} from "../../api/services/calendar";

import {
  queryClient,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  getCachedCalendar,
  invalidateCalendar,
  loadCalendar,
} from "./calendar-query";

vi.mock(
  "../../api/services/calendar",
  () => ({
    calendarApi: {
      list: vi.fn(),
    },
  }),
);

const mockedCalendarApi =
  vi.mocked(calendarApi);

const calendarItem = {
  id: "calendar-1",
  projectId: "project-1",
  title: "Scheduled Item",
  platform: "YouTube" as const,
  status: "scheduled" as const,
  scheduledAt:
    "2026-08-03T12:00:00.000Z",
  createdAt:
    "2026-08-02T08:00:00.000Z",
};

describe(
  "calendar query",
  () => {
    beforeEach(() => {
      queryClient.clear();
      vi.clearAllMocks();
    });

    it(
      "loads and caches calendar",
      async () => {
        mockedCalendarApi.list
          .mockResolvedValue([
            calendarItem,
          ]);

        await loadCalendar();
        await loadCalendar();

        expect(
          mockedCalendarApi.list,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          getCachedCalendar(),
        ).toEqual([
          calendarItem,
        ]);
      },
    );

    it(
      "forces calendar refresh",
      async () => {
        mockedCalendarApi.list
          .mockResolvedValueOnce([
            calendarItem,
          ])
          .mockResolvedValueOnce([
            {
              ...calendarItem,
              title:
                "Updated Item",
            },
          ]);

        await loadCalendar();

        const refreshed =
          await loadCalendar(true);

        expect(
          refreshed[0]?.title,
        ).toBe(
          "Updated Item",
        );

        expect(
          mockedCalendarApi.list,
        ).toHaveBeenCalledTimes(
          2,
        );
      },
    );

    it(
      "invalidates calendar",
      async () => {
        mockedCalendarApi.list
          .mockResolvedValue([
            calendarItem,
          ]);

        await loadCalendar();

        invalidateCalendar();

        expect(
          queryClient.getSnapshot(
            apiQueryKeys.calendar,
          ).isInvalidated,
        ).toBe(true);
      },
    );
  },
);
