export interface DashboardActivity {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
}

interface DashboardActivityFeedProps {
  activities: DashboardActivity[];
}

export default function DashboardActivityFeed({
  activities,
}: DashboardActivityFeedProps) {
  return (
    <div className="dashboard-v2-activity">
      {activities.length === 0 ? (
        <div className="dashboard-v2-empty">
          No recent activity available.
        </div>
      ) : (
        activities.map((activity) => (
          <article
            className="dashboard-v2-activity__item"
            key={activity.id}
          >
            <span className="dashboard-v2-activity__icon">
              {activity.icon}
            </span>

            <div className="dashboard-v2-activity__content">
              <strong>{activity.title}</strong>
              <p>{activity.description}</p>
            </div>

            <time>{activity.time}</time>
          </article>
        ))
      )}
    </div>
  );
}
