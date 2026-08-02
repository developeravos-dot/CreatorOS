import type {
  DashboardAccessibilityPreferences,
  DashboardAnnouncement,
  DashboardAnnouncementPriority,
} from "./dashboard-accessibility-types";

const STORAGE_KEY =
  "creatoros.dashboard.accessibility";

const defaultPreferences:
  DashboardAccessibilityPreferences = {
  reducedMotion: false,
  highContrast: false,
  announceUpdates: true,
};

let announcements:
  DashboardAnnouncement[] = [];

let preferences =
  readStoredPreferences();

const listeners =
  new Set<
    () => void
  >();

function notify(): void {
  listeners.forEach(
    (listener) => {
      listener();
    },
  );
}

function readStoredPreferences():
  DashboardAccessibilityPreferences {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return {
        ...defaultPreferences,
      };
    }

    const parsed =
      JSON.parse(stored) as
        Partial<DashboardAccessibilityPreferences>;

    return {
      reducedMotion:
        Boolean(
          parsed.reducedMotion,
        ),

      highContrast:
        Boolean(
          parsed.highContrast,
        ),

      announceUpdates:
        parsed.announceUpdates ??
        true,
    };
  } catch {
    return {
      ...defaultPreferences,
    };
  }
}

function persistPreferences(): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        preferences,
      ),
    );
  } catch {
    // Keep preferences in memory.
  }
}

export function getDashboardAccessibilityPreferences():
  DashboardAccessibilityPreferences {
  return {
    ...preferences,
  };
}

export function getDashboardAccessibilityPreferencesSnapshot():
  DashboardAccessibilityPreferences {
  return preferences;
}

export function updateDashboardAccessibilityPreferences(
  next:
    Partial<DashboardAccessibilityPreferences>,
): DashboardAccessibilityPreferences {
  preferences = {
    ...preferences,
    ...next,
  };

  persistPreferences();
  notify();

  return {
    ...preferences,
  };
}

export function resetDashboardAccessibilityPreferences():
  DashboardAccessibilityPreferences {
  preferences = {
    ...defaultPreferences,
  };

  persistPreferences();
  notify();

  return {
    ...preferences,
  };
}

export function announceDashboardUpdate(
  message: string,
  priority:
    DashboardAnnouncementPriority = "polite",
  now = new Date(),
): DashboardAnnouncement | null {
  const normalized =
    message.trim();

  if (
    !normalized ||
    !preferences.announceUpdates
  ) {
    return null;
  }

  const announcement:
    DashboardAnnouncement = {
    id:
      `dashboard-announcement-${now.getTime()}`,

    message:
      normalized,

    priority,

    createdAt:
      now.toISOString(),
  };

  announcements = [
    ...announcements,
    announcement,
  ].slice(-10);

  notify();

  return announcement;
}

export function getDashboardAnnouncements():
  DashboardAnnouncement[] {
  return [
    ...announcements,
  ];
}

export function getDashboardAnnouncementsSnapshot():
  readonly DashboardAnnouncement[] {
  return announcements;
}

export function clearDashboardAnnouncements():
  void {
  announcements = [];
  notify();
}

export function subscribeDashboardAccessibility(
  listener: () => void,
): () => void {
  listeners.add(
    listener,
  );

  return () => {
    listeners.delete(
      listener,
    );
  };
}
