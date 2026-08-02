import { enterpriseClient } from "../core/client";
import type {
  EnterpriseCalendarItem,
  EnterprisePlatform,
} from "../../enterprise-api";

export interface ScheduleContentInput {
  projectId: string;
  title: string;
  scheduledAt: string;
  platform: EnterprisePlatform;
}

export const calendarApi = {
  schedule(input: ScheduleContentInput) {
    return enterpriseClient.post<EnterpriseCalendarItem>(
      "/calendar",
      input,
    );
  },
};
