import {
  describe,
  expect,
  it,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardVersionBoundary from "./DashboardVersionBoundary";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 1,
    activeProjects: 1,
    scripts: 1,
    scheduledContent: 1,
    prompts: 1,
  },

  projects: [],
  scripts: [],
  calendar: [],
  prompts: [],

  system: {
    projectEngine:
      "operational",
    scriptEngine:
      "operational",
    calendarEngine:
      "operational",
    promptEngine:
      "operational",
    storage:
      "persistent",
  },
};

describe(
  "DashboardVersionBoundary",
  () => {
    it(
      "renders Dashboard 2.0 by default",
      async () => {
        render(
          <DashboardVersionBoundary
            dashboard={dashboard}
            connected
            legacy={
              <div>
                Legacy dashboard
              </div>
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Dashboard 2.0",
            },
          ),
        ).toBeInTheDocument();

        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "KPI intelligence",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "switches to the legacy dashboard",
      async () => {
        render(
          <DashboardVersionBoundary
            dashboard={dashboard}
            connected
            legacy={
              <div>
                Legacy dashboard
              </div>
            }
          />,
        );

        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "KPI intelligence",
            },
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /legacy/i,
            },
          ),
        );

        expect(
          screen.getByText(
            "Legacy dashboard",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
