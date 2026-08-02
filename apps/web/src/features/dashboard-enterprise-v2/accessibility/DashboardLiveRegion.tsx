import {
  useSyncExternalStore,
} from "react";

import {
  getDashboardAnnouncementsSnapshot,
  subscribeDashboardAccessibility,
} from "./dashboard-accessibility-store";

export default function DashboardLiveRegion() {
  const announcements =
    useSyncExternalStore(
      subscribeDashboardAccessibility,
      getDashboardAnnouncementsSnapshot,
      getDashboardAnnouncementsSnapshot,
    );

  const polite =
    announcements
      .filter(
        (item) =>
          item.priority ===
          "polite",
      )
      .at(-1);

  const assertive =
    announcements
      .filter(
        (item) =>
          item.priority ===
          "assertive",
      )
      .at(-1);

  return (
    <>
      <div
        className="dashboard-accessibility-live-region"
        aria-live="polite"
        aria-atomic="true"
      >
        {polite?.message ?? ""}
      </div>

      <div
        className="dashboard-accessibility-live-region"
        aria-live="assertive"
        aria-atomic="true"
      >
        {assertive?.message ?? ""}
      </div>
    </>
  );
}
