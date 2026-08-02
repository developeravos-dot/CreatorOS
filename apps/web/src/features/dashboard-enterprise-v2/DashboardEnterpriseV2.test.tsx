import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardEnterpriseV2 from "./DashboardEnterpriseV2";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 3,
    activeProjects: 2,
    scripts: 6,
    scheduledContent: 2,
    prompts: 4,
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
  "DashboardEnterpriseV2",
  () => {
    it(
      "builds and renders a foundation snapshot",
      () => {
        render(
          <DashboardEnterpriseV2
            dashboard={
              dashboard
            }
            connected
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
          screen.getByText(
            "3",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Enterprise connected",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
