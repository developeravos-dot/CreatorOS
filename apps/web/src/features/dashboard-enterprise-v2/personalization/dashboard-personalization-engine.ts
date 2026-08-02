import {
  defaultDashboardPreferences,
  type DashboardLayoutMode,
  type DashboardPersonalizationPreferences,
  type DashboardSavedView,
  type DashboardSectionId,
} from "./dashboard-personalization-types";

import {
  normalizeDashboardPreferences,
} from "./dashboard-personalization-storage";

export function updateDashboardDensity(
  preferences:
    DashboardPersonalizationPreferences,
  density:
    DashboardPersonalizationPreferences["density"],
): DashboardPersonalizationPreferences {
  return {
    ...preferences,
    density,
  };
}

export function updateDashboardLayoutMode(
  preferences:
    DashboardPersonalizationPreferences,
  layoutMode:
    DashboardLayoutMode,
): DashboardPersonalizationPreferences {
  return {
    ...preferences,
    layoutMode,
  };
}

export function toggleDashboardSection(
  preferences:
    DashboardPersonalizationPreferences,
  sectionId:
    DashboardSectionId,
): DashboardPersonalizationPreferences {
  return {
    ...preferences,

    sections:
      preferences.sections.map(
        (section) =>
          section.id ===
          sectionId
            ? {
                ...section,
                visible:
                  !section.visible,
              }
            : section,
      ),
  };
}

export function moveDashboardSection(
  preferences:
    DashboardPersonalizationPreferences,
  sectionId:
    DashboardSectionId,
  direction:
    "up" |
    "down",
): DashboardPersonalizationPreferences {
  const ordered =
    [...preferences.sections]
      .sort(
        (
          left,
          right,
        ) =>
          left.order -
          right.order,
      );

  const currentIndex =
    ordered.findIndex(
      (section) =>
        section.id ===
        sectionId,
    );

  if (currentIndex < 0) {
    return preferences;
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >=
      ordered.length
  ) {
    return preferences;
  }

  const current =
    ordered[currentIndex];

  const target =
    ordered[targetIndex];

  if (!current || !target) {
    return preferences;
  }

  ordered[currentIndex] =
    target;

  ordered[targetIndex] =
    current;

  return {
    ...preferences,

    sections:
      ordered.map(
        (
          section,
          index,
        ) => ({
          ...section,
          order: index,
        }),
      ),
  };
}

export function resetDashboardPreferences():
  DashboardPersonalizationPreferences {
  return normalizeDashboardPreferences(
    defaultDashboardPreferences,
  );
}

export function createDashboardSavedView(
  name: string,
  description: string,
  preferences:
    DashboardPersonalizationPreferences,
  now = new Date(),
): DashboardSavedView {
  const normalizedName =
    name.trim();

  if (!normalizedName) {
    throw new Error(
      "Saved view name is required.",
    );
  }

  const timestamp =
    now.toISOString();

  return {
    id:
      `dashboard-view-${now.getTime()}`,

    name:
      normalizedName,

    description:
      description.trim(),

    createdAt:
      timestamp,

    updatedAt:
      timestamp,

    preferences:
      normalizeDashboardPreferences(
        preferences,
      ),
  };
}

export function updateDashboardSavedView(
  view:
    DashboardSavedView,
  preferences:
    DashboardPersonalizationPreferences,
  now = new Date(),
): DashboardSavedView {
  return {
    ...view,

    updatedAt:
      now.toISOString(),

    preferences:
      normalizeDashboardPreferences(
        preferences,
      ),
  };
}
