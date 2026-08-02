export type DashboardAnnouncementPriority =
  | "polite"
  | "assertive";

export interface DashboardAnnouncement {
  id: string;
  message: string;
  priority:
    DashboardAnnouncementPriority;
  createdAt: string;
}

export interface DashboardAccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  announceUpdates: boolean;
}
