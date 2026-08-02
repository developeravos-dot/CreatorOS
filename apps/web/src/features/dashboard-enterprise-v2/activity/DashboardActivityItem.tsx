import type {
  DashboardLiveActivity,
} from "../command-center/dashboard-command-center-types";

interface DashboardActivityItemProps {
  activity:
    DashboardLiveActivity;
}

function activityIcon(
  category:
    DashboardLiveActivity["category"],
): string {
  switch (category) {
    case "project":
      return "P";

    case "script":
      return "S";

    case "calendar":
      return "C";

    case "prompt":
      return "AI";

    default:
      return "•";
  }
}

export default function DashboardActivityItem({
  activity,
}: DashboardActivityItemProps) {
  return (
    <article
      className={[
        "dashboard-enterprise-activity-item",
        `dashboard-enterprise-activity-item--${activity.tone}`,
      ].join(" ")}
    >
      <span
        className="dashboard-enterprise-activity-item__icon"
        aria-hidden="true"
      >
        {activityIcon(
          activity.category,
        )}
      </span>

      <div className="dashboard-enterprise-activity-item__content">
        <header>
          <strong>
            {activity.title}
          </strong>

          <time
            dateTime={
              activity.timestamp
            }
          >
            {activity.relativeTime}
          </time>
        </header>

        <p>
          {activity.description}
        </p>
      </div>
    </article>
  );
}
