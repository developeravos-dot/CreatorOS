import {
  useMemo,
} from "react";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  buildProjectActivities,
  groupProjectActivitiesByDate,
  summarizeProjectActivities,
  type ProjectActivity,
} from "./project-activity-engine";

interface ProjectActivityTimelineProps {
  project: EnterpriseProject;
  activities?:
    readonly ProjectActivity[];
}

function formatActivityTime(
  timestamp: string,
): string {
  const parsed =
    Date.parse(timestamp);

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    return timestamp;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(parsed),
  );
}

function getActivityIcon(
  type: ProjectActivity["type"],
): string {
  switch (type) {
    case "created":
      return "+";

    case "updated":
      return "↻";

    case "status-changed":
      return "→";

    case "note":
      return "✎";

    case "system":
      return "•";
  }
}

export default function ProjectActivityTimeline({
  project,
  activities = [],
}: ProjectActivityTimelineProps) {
  const timelineActivities =
    useMemo(
      () =>
        buildProjectActivities(
          project,
          {
            customActivities:
              activities,
          },
        ),
      [
        activities,
        project,
      ],
    );

  const groups =
    useMemo(
      () =>
        groupProjectActivitiesByDate(
          timelineActivities,
        ),
      [timelineActivities],
    );

  const summary =
    useMemo(
      () =>
        summarizeProjectActivities(
          timelineActivities,
        ),
      [timelineActivities],
    );

  return (
    <section
      className="projects-v2-activity"
      aria-labelledby="project-activity-title"
    >
      <header className="projects-v2-activity__header">
        <div>
          <span>
            Activity
          </span>

          <h3 id="project-activity-title">
            Project timeline
          </h3>
        </div>

        <strong>
          {summary.total}
          {" events"}
        </strong>
      </header>

      <div className="projects-v2-activity__summary">
        <article>
          <strong>
            {summary.statusChanged}
          </strong>

          <span>
            Status changes
          </span>
        </article>

        <article>
          <strong>
            {summary.notes}
          </strong>

          <span>
            Notes
          </span>
        </article>

        <article>
          <strong>
            {summary.updated}
          </strong>

          <span>
            Updates
          </span>
        </article>
      </div>

      {groups.length === 0 ? (
        <p className="projects-v2-activity__empty">
          No project activity is available.
        </p>
      ) : (
        <div className="projects-v2-activity__groups">
          {groups.map(
            (group) => (
              <section
                className="projects-v2-activity__group"
                key={group.date}
                aria-label={group.label}
              >
                <h4>
                  {group.label}
                </h4>

                <ol>
                  {group.activities.map(
                    (activity) => (
                      <li
                        key={activity.id}
                        data-activity-type={
                          activity.type
                        }
                      >
                        <span
                          className="projects-v2-activity__icon"
                          aria-hidden="true"
                        >
                          {getActivityIcon(
                            activity.type,
                          )}
                        </span>

                        <div className="projects-v2-activity__event">
                          <div>
                            <strong>
                              {activity.title}
                            </strong>

                            <time
                              dateTime={
                                activity.timestamp
                              }
                            >
                              {formatActivityTime(
                                activity.timestamp,
                              )}
                            </time>
                          </div>

                          <p>
                            {activity.description}
                          </p>

                          <small>
                            {activity.actor}
                          </small>
                        </div>
                      </li>
                    ),
                  )}
                </ol>
              </section>
            ),
          )}
        </div>
      )}
    </section>
  );
}
