import {
  describe,
  expect,
  it,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
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
      "renders all personalized sections",
      async () => {
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
          await screen.findByRole(
            "heading",
            {
              name:
                "KPI intelligence",
            },
          ),
        ).toBeInTheDocument();

        expect(
          await screen.findByRole(
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
      "opens personalization drawer",
      async () => {
        render(
          <DashboardEnterpriseV2
            dashboard={dashboard}
            connected
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Personalize dashboard",
            },
          ),
        );

        expect(
          await screen.findByRole(
            "dialog",
            {
              name:
                "Dashboard personalization",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "hides a dashboard section",
      async () => {
        render(
          <DashboardEnterpriseV2
            dashboard={dashboard}
            connected
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Personalize dashboard",
            },
          ),
        );

        fireEvent.click(
          await screen.findByRole(
            "checkbox",
            {
              name:
                "KPI intelligence",
            },
          ),
        );

        await waitFor(() => {
          expect(
            screen.queryByRole(
              "heading",
              {
                name:
                  "KPI intelligence",
              },
            ),
          ).not.toBeInTheDocument();
        });
      },
    );

    it(
      "does not render optional sections while loading",
      async () => {
        render(
          <DashboardEnterpriseV2
            dashboard={dashboard}
            connected
            loading
          />,
        );

        await waitFor(() => {
          expect(
            screen.queryByRole(
              "heading",
              {
                name:
                  "KPI intelligence",
              },
            ),
          ).not.toBeInTheDocument();
        });

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
