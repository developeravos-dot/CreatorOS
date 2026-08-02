import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import DashboardLiveActivityFeed from "../activity/DashboardLiveActivityFeed";
import DashboardAlertsPanel from "./DashboardAlertsPanel";
import DashboardQuickActionsPanel from "./DashboardQuickActionsPanel";

import type {
  DashboardLiveActivity,
  DashboardOperationalAlert,
  DashboardQuickCommand,
} from "./dashboard-command-center-types";

const activity:
  DashboardLiveActivity = {
  id: "activity-1",
  category: "project",
  title: "CreatorOS",
  description:
    "Project is active.",
  timestamp:
    "2026-08-02T12:00:00.000Z",
  relativeTime: "Just now",
  tone: "success",
};

const command:
  DashboardQuickCommand = {
  id: "create-project",
  label: "Create project",
  description:
    "Create a workspace.",
  icon: "+",
  tone: "success",
};

const alert:
  DashboardOperationalAlert = {
  id: "alert-1",
  title:
    "Publishing queue empty",
  description:
    "Schedule content.",
  severity: "warning",
  actionLabel:
    "Schedule content",
};

describe(
  "dashboard command center components",
  () => {
    it(
      "renders live activities",
      () => {
        render(
          <DashboardLiveActivityFeed
            activities={[
              activity,
            ]}
          />,
        );

        expect(
          screen.getByText(
            "CreatorOS",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Just now",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders empty activities",
      () => {
        render(
          <DashboardLiveActivityFeed
            activities={[]}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "No recent activity",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "runs quick commands",
      () => {
        const onCommand =
          vi.fn();

        render(
          <DashboardQuickActionsPanel
            commands={[
              command,
            ]}
            onCommand={
              onCommand
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Create project/,
            },
          ),
        );

        expect(
          onCommand,
        ).toHaveBeenCalledWith(
          command,
        );
      },
    );

    it(
      "renders and executes alerts",
      () => {
        const onAction =
          vi.fn();

        render(
          <DashboardAlertsPanel
            alerts={[
              alert,
            ]}
            onAction={
              onAction
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Schedule content",
            },
          ),
        );

        expect(
          onAction,
        ).toHaveBeenCalledWith(
          alert,
        );
      },
    );

    it(
      "renders empty alerts",
      () => {
        render(
          <DashboardAlertsPanel
            alerts={[]}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "No operational alerts",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
