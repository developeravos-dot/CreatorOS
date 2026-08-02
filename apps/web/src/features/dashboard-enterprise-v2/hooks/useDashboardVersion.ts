import {
  useCallback,
  useState,
} from "react";

import {
  readDashboardVersion,
  writeDashboardVersion,
  type DashboardVersion,
} from "../dashboard-version";

export function useDashboardVersion() {
  const [
    version,
    setVersionState,
  ] = useState<DashboardVersion>(
    readDashboardVersion,
  );

  const setVersion =
    useCallback(
      (
        next:
          DashboardVersion,
      ): void => {
        setVersionState(next);
        writeDashboardVersion(
          next,
        );
      },
      [],
    );

  const toggleVersion =
    useCallback((): void => {
      setVersion(
        version ===
          "enterprise-v2"
          ? "legacy"
          : "enterprise-v2",
      );
    }, [
      setVersion,
      version,
    ]);

  return {
    version,
    setVersion,
    toggleVersion,
    isEnterpriseV2:
      version ===
      "enterprise-v2",
  };
}
