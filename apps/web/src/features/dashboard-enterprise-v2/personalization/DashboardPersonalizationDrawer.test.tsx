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

import DashboardPersonalizationDrawer from "./DashboardPersonalizationDrawer";

import {
  defaultDashboardPreferences,
} from "./dashboard-personalization-types";

describe(
  "DashboardPersonalizationDrawer",
  () => {
    it(
      "does not render while closed",
      () => {
        render(
          <DashboardPersonalizationDrawer
            open={false}
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[]}
            activeViewId={null}
            onClose={
              vi.fn()
            }
            onDensityChange={
              vi.fn()
            }
            onLayoutModeChange={
              vi.fn()
            }
            onToggleSection={
              vi.fn()
            }
            onMoveSection={
              vi.fn()
            }
            onReset={
              vi.fn()
            }
            onSaveView={
              vi.fn()
            }
            onApplyView={
              vi.fn()
            }
            onUpdateActiveView={
              vi.fn()
            }
            onDeleteView={
              vi.fn()
            }
          />,
        );

        expect(
          screen.queryByRole(
            "dialog",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "renders and closes",
      () => {
        const onClose =
          vi.fn();

        render(
          <DashboardPersonalizationDrawer
            open
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[]}
            activeViewId={null}
            onClose={
              onClose
            }
            onDensityChange={
              vi.fn()
            }
            onLayoutModeChange={
              vi.fn()
            }
            onToggleSection={
              vi.fn()
            }
            onMoveSection={
              vi.fn()
            }
            onReset={
              vi.fn()
            }
            onSaveView={
              vi.fn()
            }
            onApplyView={
              vi.fn()
            }
            onUpdateActiveView={
              vi.fn()
            }
            onDeleteView={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByRole(
            "dialog",
            {
              name:
                "Dashboard personalization",
            },
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Close dashboard personalization",
            },
          ),
        );

        expect(
          onClose,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "closes with escape",
      () => {
        const onClose =
          vi.fn();

        render(
          <DashboardPersonalizationDrawer
            open
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[]}
            activeViewId={null}
            onClose={
              onClose
            }
            onDensityChange={
              vi.fn()
            }
            onLayoutModeChange={
              vi.fn()
            }
            onToggleSection={
              vi.fn()
            }
            onMoveSection={
              vi.fn()
            }
            onReset={
              vi.fn()
            }
            onSaveView={
              vi.fn()
            }
            onApplyView={
              vi.fn()
            }
            onUpdateActiveView={
              vi.fn()
            }
            onDeleteView={
              vi.fn()
            }
          />,
        );

        fireEvent.keyDown(
          window,
          {
            key: "Escape",
          },
        );

        expect(
          onClose,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);
