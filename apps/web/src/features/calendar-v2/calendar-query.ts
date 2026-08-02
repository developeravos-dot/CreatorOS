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
  queryPolicies,
} from "../../api/data-engine/queryPolicies";

import type {
  EnterpriseCalendarItem,
} from "../../enterprise-api";

export function loadCalendar(
  force = false,
): Promise<EnterpriseCalendarItem[]> {
  return queryClient.fetch(
    apiQueryKeys.calendar,
    () => calendarApi.list(),
    {
      staleTime:
        queryPolicies.workspace.staleTime,
      force,
    },
  );
}

export function invalidateCalendar(): void {
  queryClient.invalidate(
    apiQueryKeys.calendar,
  );
}

export function getCachedCalendar():
  | EnterpriseCalendarItem[]
  | undefined {
  return queryClient.getQueryData<
    EnterpriseCalendarItem[]
  >(apiQueryKeys.calendar);
}
