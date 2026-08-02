import {
  EmptyState,
} from "../../../design-system";

import DashboardActivityItem from "./DashboardActivityItem";

import type {
  DashboardLiveActivity,
} from "../command-center/dashboard-command-center-types";

interface DashboardLiveActivityFeedProps {
  activities:
    DashboardLiveActivity[];
}

export default function DashboardLiveActivityFeed({
  activities,
}: DashboardLiveActivityFeedProps) {
  if (
    activities.length === 0
  ) {
    return (
      <EmptyState
        title="No recent activity"
        description={
          "CreatorOS activity will appear here as projects, scripts, prompts and publishing items change."
        }
      />
    );
  }

  return (
    <div className="dashboard-enterprise-activity-feed">
      {activities.map(
        (activity) => (
          <DashboardActivityItem
            key={activity.id}
            activity={activity}
          />
        ),
      )}
    </div>
  );
}
