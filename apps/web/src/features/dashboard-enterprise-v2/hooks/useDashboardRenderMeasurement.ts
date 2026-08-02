import {
  useEffect,
  useRef,
} from "react";

import {
  recordDashboardRender,
} from "../performance/dashboard-performance-store";

export function useDashboardRenderMeasurement(
  id: string,
): void {
  const startedAt =
    useRef(
      performance.now(),
    );

  useEffect(
    () => {
      const durationMs =
        performance.now() -
        startedAt.current;

      recordDashboardRender(
        id,
        durationMs,
      );
    },
    [
      id,
    ],
  );
}
