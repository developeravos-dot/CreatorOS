import {
  defaultDashboardPreferences,
  type DashboardPersonalizationPreferences,
  type DashboardPersonalizationState,
  type DashboardSavedView,
} from "./dashboard-personalization-types";

const PREFERENCES_KEY =
  "creatoros.dashboard.personalization";

const SAVED_VIEWS_KEY =
  "creatoros.dashboard.saved-views";

const ACTIVE_VIEW_KEY =
  "creatoros.dashboard.active-view";

function clonePreferences(
  preferences:
    DashboardPersonalizationPreferences,
): DashboardPersonalizationPreferences {
  return {
    ...preferences,

    sections:
      preferences.sections.map(
        (section) => ({
          ...section,
        }),
      ),
  };
}

export function normalizeDashboardPreferences(
  value:
    Partial<DashboardPersonalizationPreferences> |
    null |
    undefined,
): DashboardPersonalizationPreferences {
  const sections =
    defaultDashboardPreferences
      .sections.map(
        (defaultSection) => {
          const storedSection =
            value?.sections?.find(
              (section) =>
                section.id ===
                defaultSection.id,
            );

          return {
            id:
              defaultSection.id,

            visible:
              storedSection?.visible ??
              defaultSection.visible,

            order:
              Number.isFinite(
                storedSection?.order,
              )
                ? Number(
                    storedSection?.order,
                  )
                : defaultSection.order,
          };
        },
      )
      .sort(
        (
          left,
          right,
        ) =>
          left.order -
          right.order,
      );

  return {
    density:
      value?.density ===
        "compact"
        ? "compact"
        : "comfortable",

    layoutMode:
      value?.layoutMode ===
        "analytics" ||
      value?.layoutMode ===
        "operations"
        ? value.layoutMode
        : "balanced",

    sections,

    showLegacyToggle:
      value?.showLegacyToggle ??
      true,
  };
}

export function readDashboardPreferences():
  DashboardPersonalizationPreferences {
  try {
    const stored =
      localStorage.getItem(
        PREFERENCES_KEY,
      );

    if (!stored) {
      return clonePreferences(
        defaultDashboardPreferences,
      );
    }

    return normalizeDashboardPreferences(
      JSON.parse(stored) as
        Partial<DashboardPersonalizationPreferences>,
    );
  } catch {
    return clonePreferences(
      defaultDashboardPreferences,
    );
  }
}

export function writeDashboardPreferences(
  preferences:
    DashboardPersonalizationPreferences,
): void {
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify(
      normalizeDashboardPreferences(
        preferences,
      ),
    ),
  );
}

export function readDashboardSavedViews():
  DashboardSavedView[] {
  try {
    const stored =
      localStorage.getItem(
        SAVED_VIEWS_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (
          item,
        ): item is DashboardSavedView =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.name === "string",
      )
      .map(
        (view) => ({
          ...view,

          preferences:
            normalizeDashboardPreferences(
              view.preferences,
            ),
        }),
      );
  } catch {
    return [];
  }
}

export function writeDashboardSavedViews(
  views:
    DashboardSavedView[],
): void {
  localStorage.setItem(
    SAVED_VIEWS_KEY,
    JSON.stringify(views),
  );
}

export function readActiveDashboardViewId():
  string | null {
  try {
    return localStorage.getItem(
      ACTIVE_VIEW_KEY,
    );
  } catch {
    return null;
  }
}

export function writeActiveDashboardViewId(
  viewId: string | null,
): void {
  if (viewId) {
    localStorage.setItem(
      ACTIVE_VIEW_KEY,
      viewId,
    );

    return;
  }

  localStorage.removeItem(
    ACTIVE_VIEW_KEY,
  );
}

export function readDashboardPersonalizationState():
  DashboardPersonalizationState {
  return {
    preferences:
      readDashboardPreferences(),

    savedViews:
      readDashboardSavedViews(),

    activeViewId:
      readActiveDashboardViewId(),
  };
}
