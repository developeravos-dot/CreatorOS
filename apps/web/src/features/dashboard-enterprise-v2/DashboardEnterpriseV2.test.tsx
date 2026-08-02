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

import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import DashboardEnterpriseV2 from "./DashboardEnterpriseV2";

const dashboard:
  EnterpriseDashboard = {
  metrics: {
    projects: 1,
    activeProjects: 1,
    scripts: 1,
    scheduledContent: 0,
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
  "DashboardEnterpriseV2",
  () => {
    it(
      "renders foundation, intelligence and command center",
      () => {
        render(
          <DashboardEnterpriseV2
            dashboard={dashboard}
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
          screen.getByRole(
            "heading",
            {
              name:
                "KPI intelligence",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Operational command center",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "runs schedule command",
      () => {
        const onScheduleContent =
          vi.fn();

        render(
          <DashboardEnterpriseV2
            dashboard={dashboard}
            connected
            onScheduleContent={
              onScheduleContent
            }
          />,
        );

        const scheduleButtons =
          screen.getAllByRole(
            "button",
            {
              name:
                /Schedule content/,
            },
          );

        fireEvent.click(
          scheduleButtons[0]!,
        );

        expect(
          onScheduleContent,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "does not render intelligence while loading",
      () => {
        render(
          <DashboardEnterpriseV2
            dashboard={dashboard}
            connected
            loading
          />,
        );

        expect(
          screen.queryByRole(
            "heading",
            {
              name:
                "KPI intelligence",
            },
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByRole(
            "heading",
            {
              name:
                "Operational command center",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);
