import {
  useMemo,
  useState,
} from "react";

import type {
  IntelligenceActivity,
} from "./enterprise-intelligence-types";

type ActivityFilter =
  | "all"
  | IntelligenceActivity["category"];

interface UnifiedActivityFeedProps {
  activities: IntelligenceActivity[];
}

const filters: Array<{
  id: ActivityFilter;
  label: string;
}> = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "project",
    label: "Projects",
  },
  {
    id: "script",
    label: "Scripts",
  },
  {
    id: "calendar",
    label: "Calendar",
  },
  {
    id: "prompt",
    label: "Prompts",
  },
  {
    id: "system",
    label: "System",
  },
];

function activityIcon(
  category: IntelligenceActivity["category"],
): string {
  if (category === "project") {
    return "▦";
  }

  if (category === "script") {
    return "✎";
  }

  if (category === "calendar") {
    return "◫";
  }

  if (category === "prompt") {
    return "✦";
  }

  return "●";
}

export default function UnifiedActivityFeed({
  activities,
}: UnifiedActivityFeedProps) {
  const [
    filter,
    setFilter,
  ] = useState<ActivityFilter>(
    "all",
  );

  const filteredActivities =
    useMemo(
      () =>
        filter === "all"
          ? activities
          : activities.filter(
              (activity) =>
                activity.category ===
                filter,
            ),
      [
        activities,
        filter,
      ],
    );

  return (
    <article className="enterprise-intelligence-panel">
      <header className="enterprise-intelligence-panel__header">
        <div>
          <span>
            UNIFIED ACTIVITY
          </span>

          <h3>
            Enterprise activity stream
          </h3>
        </div>

        <strong>
          {filteredActivities.length}
        </strong>
      </header>

      <div className="enterprise-activity-filters">
        {filters.map(
          (item) => (
            <button
              type="button"
              key={item.id}
              className={
                filter === item.id
                  ? "enterprise-activity-filter--active"
                  : ""
              }
              onClick={() =>
                setFilter(item.id)
              }
            >
              {item.label}
            </button>
          ),
        )}
      </div>

      <div className="enterprise-activity-list">
        {filteredActivities.length ===
        0 ? (
          <div className="enterprise-intelligence-empty">
            No activity matches
            the current filter.
          </div>
        ) : (
          filteredActivities.map(
            (activity) => (
              <article
                className={[
                  "enterprise-activity-item",
                  `enterprise-activity-item--${activity.severity}`,
                ].join(" ")}
                key={activity.id}
              >
                <span className="enterprise-activity-item__icon">
                  {activityIcon(
                    activity.category,
                  )}
                </span>

                <section>
                  <header>
                    <strong>
                      {activity.title}
                    </strong>

                    <span>
                      {
                        activity.category
                      }
                    </span>
                  </header>

                  <p>
                    {
                      activity.description
                    }
                  </p>

                  <time>
                    {new Date(
                      activity.timestamp,
                    ).toLocaleString()}
                  </time>
                </section>
              </article>
            ),
          )
        )}
      </div>
    </article>
  );
}
