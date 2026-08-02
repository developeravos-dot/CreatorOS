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

import DashboardPersonalizationPanel from "./DashboardPersonalizationPanel";

import {
  defaultDashboardPreferences,
  type DashboardSavedView,
} from "./dashboard-personalization-types";

const savedView:
  DashboardSavedView = {
  id: "view-1",
  name: "Analytics view",
  description:
    "KPI focused layout.",
  createdAt:
    "2026-08-02T12:00:00.000Z",
  updatedAt:
    "2026-08-02T12:00:00.000Z",
  preferences:
    defaultDashboardPreferences,
};

describe(
  "DashboardPersonalizationPanel",
  () => {
    it(
      "changes density and layout mode",
      () => {
        const onDensityChange =
          vi.fn();

        const onLayoutModeChange =
          vi.fn();

        render(
          <DashboardPersonalizationPanel
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[]}
            activeViewId={null}
            onDensityChange={
              onDensityChange
            }
            onLayoutModeChange={
              onLayoutModeChange
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

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Compact",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Analytics/,
            },
          ),
        );

        expect(
          onDensityChange,
        ).toHaveBeenCalledWith(
          "compact",
        );

        expect(
          onLayoutModeChange,
        ).toHaveBeenCalledWith(
          "analytics",
        );
      },
    );

    it(
      "toggles and moves sections",
      () => {
        const onToggleSection =
          vi.fn();

        const onMoveSection =
          vi.fn();

        render(
          <DashboardPersonalizationPanel
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[]}
            activeViewId={null}
            onDensityChange={
              vi.fn()
            }
            onLayoutModeChange={
              vi.fn()
            }
            onToggleSection={
              onToggleSection
            }
            onMoveSection={
              onMoveSection
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

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "KPI intelligence",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Move Operational command center up",
            },
          ),
        );

        expect(
          onToggleSection,
        ).toHaveBeenCalledWith(
          "intelligence",
        );

        expect(
          onMoveSection,
        ).toHaveBeenCalledWith(
          "command-center",
          "up",
        );
      },
    );

    it(
      "saves a new view",
      () => {
        const onSaveView =
          vi.fn();

        render(
          <DashboardPersonalizationPanel
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[]}
            activeViewId={null}
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
              onSaveView
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

        fireEvent.change(
          screen.getByPlaceholderText(
            "My dashboard view",
          ),
          {
            target: {
              value:
                "My view",
            },
          },
        );

        fireEvent.change(
          screen.getByPlaceholderText(
            "Describe this layout",
          ),
          {
            target: {
              value:
                "Custom layout",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Save current view",
            },
          ),
        );

        expect(
          onSaveView,
        ).toHaveBeenCalledWith(
          "My view",
          "Custom layout",
        );
      },
    );

    it(
      "applies and deletes saved views",
      () => {
        const onApplyView =
          vi.fn();

        const onDeleteView =
          vi.fn();

        render(
          <DashboardPersonalizationPanel
            density="comfortable"
            layoutMode="balanced"
            sections={
              defaultDashboardPreferences
                .sections
            }
            savedViews={[
              savedView,
            ]}
            activeViewId={
              savedView.id
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
              onApplyView
            }
            onUpdateActiveView={
              vi.fn()
            }
            onDeleteView={
              onDeleteView
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Apply",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Delete",
            },
          ),
        );

        expect(
          onApplyView,
        ).toHaveBeenCalledWith(
          "view-1",
        );

        expect(
          onDeleteView,
        ).toHaveBeenCalledWith(
          "view-1",
        );
      },
    );
  },
);
