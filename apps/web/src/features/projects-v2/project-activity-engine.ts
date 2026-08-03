import type {
  EnterpriseProject,
  ProjectStatus,
} from "../../enterprise-api";

export type ProjectActivityType =
  | "created"
  | "updated"
  | "status-changed"
  | "note"
  | "system";

export interface ProjectActivity {
  readonly id: string;
  readonly projectId: string;
  readonly type:
    ProjectActivityType;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly actor: string;
  readonly previousStatus?:
    ProjectStatus;
  readonly nextStatus?:
    ProjectStatus;
  readonly metadata?:
    Readonly<
      Record<
        string,
        string
      >
    >;
}

export interface ProjectTimelineGroup {
  readonly date: string;
  readonly label: string;
  readonly activities:
    readonly ProjectActivity[];
}

export interface ProjectActivitySummary {
  readonly total: number;
  readonly created: number;
  readonly updated: number;
  readonly statusChanged: number;
  readonly notes: number;
  readonly system: number;
  readonly latestActivity:
    ProjectActivity | null;
}

export interface BuildProjectTimelineOptions {
  readonly actor?: string;
  readonly includeCreated?: boolean;
  readonly includeUpdated?: boolean;
  readonly customActivities?:
    readonly ProjectActivity[];
}

function normalizeTimestamp(
  value: string,
): string {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(
      timestamp,
    )
  ) {
    return value;
  }

  return new Date(
    timestamp,
  ).toISOString();
}

function createActivityId(
  projectId: string,
  type: ProjectActivityType,
  timestamp: string,
): string {
  return [
    projectId,
    type,
    timestamp,
  ].join(":");
}

function compareActivitiesDescending(
  left: ProjectActivity,
  right: ProjectActivity,
): number {
  const leftTime =
    Date.parse(
      left.timestamp,
    );

  const rightTime =
    Date.parse(
      right.timestamp,
    );

  const safeLeft =
    Number.isFinite(leftTime)
      ? leftTime
      : 0;

  const safeRight =
    Number.isFinite(rightTime)
      ? rightTime
      : 0;

  if (
    safeLeft !== safeRight
  ) {
    return (
      safeRight -
      safeLeft
    );
  }

  return left.id.localeCompare(
    right.id,
  );
}

function getDateKey(
  timestamp: string,
): string {
  const parsed =
    Date.parse(timestamp);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return "unknown";
  }

  return new Date(parsed)
    .toISOString()
    .slice(0, 10);
}

function formatDateLabel(
  dateKey: string,
): string {
  if (
    dateKey === "unknown"
  ) {
    return "Unknown date";
  }

  const parsed =
    Date.parse(
      `${dateKey}T00:00:00.000Z`,
    );

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return dateKey;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      dateStyle: "medium",
      timeZone: "UTC",
    },
  ).format(
    new Date(parsed),
  );
}

export function createProjectCreatedActivity(
  project: EnterpriseProject,
  actor = "CreatorOS",
): ProjectActivity {
  const timestamp =
    normalizeTimestamp(
      project.createdAt,
    );

  return {
    id:
      createActivityId(
        project.id,
        "created",
        timestamp,
      ),
    projectId:
      project.id,
    type: "created",
    title:
      "Project created",
    description:
      `${project.name} was created for ${project.platform}.`,
    timestamp,
    actor,
    nextStatus:
      project.status,
    metadata: {
      platform:
        project.platform,
      status:
        project.status,
    },
  };
}

export function createProjectUpdatedActivity(
  project: EnterpriseProject,
  actor = "CreatorOS",
): ProjectActivity {
  const timestamp =
    normalizeTimestamp(
      project.updatedAt,
    );

  return {
    id:
      createActivityId(
        project.id,
        "updated",
        timestamp,
      ),
    projectId:
      project.id,
    type: "updated",
    title:
      "Project updated",
    description:
      `${project.name} received a workspace update.`,
    timestamp,
    actor,
    nextStatus:
      project.status,
    metadata: {
      platform:
        project.platform,
      status:
        project.status,
    },
  };
}

export function createProjectStatusActivity(
  project: EnterpriseProject,
  previousStatus:
    ProjectStatus,
  nextStatus:
    ProjectStatus,
  timestamp:
    string = new Date().toISOString(),
  actor = "CreatorOS",
): ProjectActivity {
  const normalizedTimestamp =
    normalizeTimestamp(
      timestamp,
    );

  return {
    id:
      createActivityId(
        project.id,
        "status-changed",
        normalizedTimestamp,
      ),
    projectId:
      project.id,
    type:
      "status-changed",
    title:
      "Project status changed",
    description:
      `${project.name} moved from ${previousStatus} to ${nextStatus}.`,
    timestamp:
      normalizedTimestamp,
    actor,
    previousStatus,
    nextStatus,
    metadata: {
      platform:
        project.platform,
    },
  };
}

export function createProjectNoteActivity(
  project: EnterpriseProject,
  note: string,
  timestamp:
    string = new Date().toISOString(),
  actor = "CreatorOS",
): ProjectActivity {
  const normalizedNote =
    note.trim();

  const normalizedTimestamp =
    normalizeTimestamp(
      timestamp,
    );

  return {
    id:
      createActivityId(
        project.id,
        "note",
        normalizedTimestamp,
      ),
    projectId:
      project.id,
    type: "note",
    title:
      "Project note",
    description:
      normalizedNote ||
      "Empty project note.",
    timestamp:
      normalizedTimestamp,
    actor,
  };
}

export function sortProjectActivities(
  activities:
    readonly ProjectActivity[],
): ProjectActivity[] {
  return [
    ...activities,
  ].sort(
    compareActivitiesDescending,
  );
}

export function mergeProjectActivities(
  ...activityCollections:
    readonly (
      readonly ProjectActivity[]
    )[]
): ProjectActivity[] {
  const activitiesById =
    new Map<
      string,
      ProjectActivity
    >();

  for (
    const collection of
    activityCollections
  ) {
    for (
      const activity of
      collection
    ) {
      activitiesById.set(
        activity.id,
        activity,
      );
    }
  }

  return sortProjectActivities(
    [
      ...activitiesById.values(),
    ],
  );
}

export function buildProjectActivities(
  project: EnterpriseProject,
  options:
    BuildProjectTimelineOptions = {},
): ProjectActivity[] {
  const {
    actor = "CreatorOS",
    includeCreated = true,
    includeUpdated = true,
    customActivities = [],
  } = options;

  const activities:
    ProjectActivity[] = [];

  if (includeCreated) {
    activities.push(
      createProjectCreatedActivity(
        project,
        actor,
      ),
    );
  }

  if (
    includeUpdated &&
    project.updatedAt !==
      project.createdAt
  ) {
    activities.push(
      createProjectUpdatedActivity(
        project,
        actor,
      ),
    );
  }

  activities.push(
    ...customActivities.filter(
      (activity) =>
        activity.projectId ===
        project.id,
    ),
  );

  return mergeProjectActivities(
    activities,
  );
}

export function groupProjectActivitiesByDate(
  activities:
    readonly ProjectActivity[],
): ProjectTimelineGroup[] {
  const groups =
    new Map<
      string,
      ProjectActivity[]
    >();

  for (
    const activity of
    sortProjectActivities(
      activities,
    )
  ) {
    const dateKey =
      getDateKey(
        activity.timestamp,
      );

    const current =
      groups.get(dateKey) ??
      [];

    current.push(
      activity,
    );

    groups.set(
      dateKey,
      current,
    );
  }

  return [
    ...groups.entries(),
  ].map(
    ([
      date,
      groupActivities,
    ]) => ({
      date,
      label:
        formatDateLabel(
          date,
        ),
      activities:
        groupActivities,
    }),
  );
}

export function summarizeProjectActivities(
  activities:
    readonly ProjectActivity[],
): ProjectActivitySummary {
  const sorted =
    sortProjectActivities(
      activities,
    );

  return {
    total:
      sorted.length,
    created:
      sorted.filter(
        (activity) =>
          activity.type ===
          "created",
      ).length,
    updated:
      sorted.filter(
        (activity) =>
          activity.type ===
          "updated",
      ).length,
    statusChanged:
      sorted.filter(
        (activity) =>
          activity.type ===
          "status-changed",
      ).length,
    notes:
      sorted.filter(
        (activity) =>
          activity.type ===
          "note",
      ).length,
    system:
      sorted.filter(
        (activity) =>
          activity.type ===
          "system",
      ).length,
    latestActivity:
      sorted[0] ??
      null,
  };
}
