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

import DashboardCommandCenterOverview from "./DashboardCommandCenterOverview";

import type {
  DashboardCommandCenterSnapshot,
} from "./dashboard-command-center-types";

const snapshot:
  DashboardCommandCenterSnapshot = {
  generatedAt:
    "2026-08-02T12:00:00.000Z",

  activities: [
    {
      id: "activity-1",
      category: "project",
      title: "CreatorOS",
      description:
        "Project is active.",
      timestamp:
        "2026-08-02T12:00:00.000Z",
      relativeTime:
        "Just now",
      tone: "success",
    },
  ],

  commands: [
    {
      id: "create-project",
      label:
        "Create project",
      description:
        "Create workspace.",
      icon: "+",
      tone: "success",
    },
  ],

  alerts: [
    {
      id: "no-projects",
      title:
        "Production pipeline is empty",
      description:
        "Create a project.",
      severity: "warning",
      actionLabel:
        "Resolve project alert",
    },
  ],

  summary: {
    totalActivities: 1,
    actionableAlerts: 1,
    criticalAlerts: 0,
    availableCommands: 1,
  },
};

describe(
  "DashboardCommandCenterOverview",
  () => {
    it(
      "renders command center sections",
      () => {
        render(
          <DashboardCommandCenterOverview
            snapshot={snapshot}
            onCommand={
              vi.fn()
            }
            onAlertAction={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Operational command center",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Quick actions",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Operational alerts",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Live activity",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "runs commands and alert actions",
      () => {
        const onCommand =
          vi.fn();

        const onAlertAction =
          vi.fn();

        render(
          <DashboardCommandCenterOverview
            snapshot={snapshot}
            onCommand={
              onCommand
            }
            onAlertAction={
              onAlertAction
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

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Resolve project alert",
            },
          ),
        );

        expect(
          onCommand,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onAlertAction,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);
