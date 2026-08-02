export type DashboardDensity =
  | "comfortable"
  | "compact";

export type DashboardLayoutMode =
  | "balanced"
  | "analytics"
  | "operations";

export type DashboardSectionId =
  | "foundation"
  | "intelligence"
  | "command-center";

export interface DashboardSectionPreference {
  id: DashboardSectionId;
  visible: boolean;
  order: number;
}

export interface DashboardPersonalizationPreferences {
  density: DashboardDensity;
  layoutMode: DashboardLayoutMode;
  sections:
    DashboardSectionPreference[];

  showLegacyToggle: boolean;
}

export interface DashboardSavedView {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  preferences:
    DashboardPersonalizationPreferences;
}

export interface DashboardPersonalizationState {
  preferences:
    DashboardPersonalizationPreferences;

  savedViews:
    DashboardSavedView[];

  activeViewId:
    string | null;
}

export const defaultDashboardPreferences:
  DashboardPersonalizationPreferences = {
  density: "comfortable",
  layoutMode: "balanced",

  sections: [
    {
      id: "foundation",
      visible: true,
      order: 0,
    },
    {
      id: "intelligence",
      visible: true,
      order: 1,
    },
    {
      id: "command-center",
      visible: true,
      order: 2,
    },
  ],

  showLegacyToggle: true,
};
