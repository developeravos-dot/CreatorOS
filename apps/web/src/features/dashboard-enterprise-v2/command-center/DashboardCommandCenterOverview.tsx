import DashboardLiveActivityFeed from "../activity/DashboardLiveActivityFeed";
import DashboardSection from "../components/DashboardSection";

import DashboardAlertsPanel from "./DashboardAlertsPanel";
import DashboardQuickActionsPanel from "./DashboardQuickActionsPanel";

import type {
  DashboardCommandCenterSnapshot,
  DashboardOperationalAlert,
  DashboardQuickCommand,
} from "./dashboard-command-center-types";

interface DashboardCommandCenterOverviewProps {
  snapshot:
    DashboardCommandCenterSnapshot;

  onCommand: (
    command:
      DashboardQuickCommand,
  ) => void;

  onAlertAction: (
    alert:
      DashboardOperationalAlert,
  ) => void;
}

export default function DashboardCommandCenterOverview({
  snapshot,
  onCommand,
  onAlertAction,
}: DashboardCommandCenterOverviewProps) {
  return (
    <div className="dashboard-enterprise-command-center-overview">
      <DashboardSection
        title="Operational command center"
        description={
          "Execute core production actions and monitor the current operating state of CreatorOS."
        }
      >
        <div className="dashboard-enterprise-command-center-summary">
          <article>
            <span>
              Recent activities
            </span>

            <strong>
              {
                snapshot.summary
                  .totalActivities
              }
            </strong>
          </article>

          <article>
            <span>
              Available commands
            </span>

            <strong>
              {
                snapshot.summary
                  .availableCommands
              }
            </strong>
          </article>

          <article>
            <span>
              Actionable alerts
            </span>

            <strong>
              {
                snapshot.summary
                  .actionableAlerts
              }
            </strong>
          </article>

          <article>
            <span>
              Critical alerts
            </span>

            <strong>
              {
                snapshot.summary
                  .criticalAlerts
              }
            </strong>
          </article>
        </div>
      </DashboardSection>

      <div className="dashboard-enterprise-command-center-grid">
        <DashboardSection
          title="Quick actions"
          description={
            "Start the most common CreatorOS production operations."
          }
        >
          <DashboardQuickActionsPanel
            commands={
              snapshot.commands
            }
            onCommand={
              onCommand
            }
          />
        </DashboardSection>

        <DashboardSection
          title="Operational alerts"
          description={
            "Items that require attention across production, publishing and automation."
          }
        >
          <DashboardAlertsPanel
            alerts={
              snapshot.alerts
            }
            onAction={
              onAlertAction
            }
          />
        </DashboardSection>
      </div>

      <DashboardSection
        title="Live activity"
        description={
          "Recent changes across projects, scripts, prompts and publishing items."
        }
      >
        <DashboardLiveActivityFeed
          activities={
            snapshot.activities
          }
        />
      </DashboardSection>
    </div>
  );
}
