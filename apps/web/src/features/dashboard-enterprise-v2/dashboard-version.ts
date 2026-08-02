const STORAGE_KEY =
  "creatoros.dashboard.version";

export type DashboardVersion =
  | "legacy"
  | "enterprise-v2";

export function readDashboardVersion():
  DashboardVersion {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (
      stored === "legacy" ||
      stored === "enterprise-v2"
    ) {
      return stored;
    }
  } catch {
    // Use default version.
  }

  return "enterprise-v2";
}

export function writeDashboardVersion(
  version: DashboardVersion,
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      version,
    );
  } catch {
    // Keep preference in memory only.
  }
}
