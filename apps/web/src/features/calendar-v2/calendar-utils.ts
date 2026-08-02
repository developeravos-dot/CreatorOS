import type {
  EnterpriseCalendarItem,
  EnterpriseProject,
} from "../../enterprise-api";

type GenericRecord = Record<string, unknown>;

export type CalendarViewMode = "month" | "week" | "day" | "timeline";

export interface CalendarDisplayItem {
  source: EnterpriseCalendarItem;
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: string;
  platform: string;
  date: Date | null;
  rawDate: string;
}

function asRecord(value: unknown): GenericRecord {
  if (typeof value === "object" && value !== null) {
    return value as GenericRecord;
  }

  return {};
}

function readString(
  source: GenericRecord,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }
  }

  return fallback;
}

export function normalizeCalendarItem(
  item: EnterpriseCalendarItem,
  projects: EnterpriseProject[],
  index: number,
): CalendarDisplayItem {
  const source = asRecord(item);

  const id = readString(
    source,
    ["id", "calendarId", "contentId"],
    `calendar-${index}`,
  );

  const title = readString(
    source,
    ["title", "name", "contentTitle", "caption"],
    `Content item ${index + 1}`,
  );

  const projectId = readString(
    source,
    ["projectId", "project_id"],
  );

  const matchingProject = projects.find(
    (project) => String(project.id) === projectId,
  );

  const projectName =
    matchingProject?.name ??
    readString(source, ["projectName"], "Unassigned project");

  const status = readString(
    source,
    ["status", "state"],
    "scheduled",
  );

  const platform = readString(
    source,
    ["platform", "channel"],
    "unspecified",
  );

  const rawDate = readString(
    source,
    [
      "scheduledAt",
      "scheduledDate",
      "publishAt",
      "publishDate",
      "date",
      "startsAt",
      "createdAt",
    ],
  );

  const parsedDate = rawDate ? new Date(rawDate) : null;

  return {
    source: item,
    id,
    title,
    projectId,
    projectName,
    status,
    platform,
    date:
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate
        : null,
    rawDate,
  };
}

export function formatCalendarDate(
  date: Date | null,
): string {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

