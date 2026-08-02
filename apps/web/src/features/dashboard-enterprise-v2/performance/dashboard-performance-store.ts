import type {
  DashboardRenderMeasurement,
} from "./dashboard-performance-types";

const MAX_MEASUREMENTS = 50;

let measurements:
  DashboardRenderMeasurement[] = [];

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

export function recordDashboardRender(
  id: string,
  durationMs: number,
  timestamp = new Date(),
): DashboardRenderMeasurement {
  const measurement:
    DashboardRenderMeasurement = {
    id,
    durationMs:
      Number.isFinite(
        durationMs,
      )
        ? Math.max(
            0,
            durationMs,
          )
        : 0,

    timestamp:
      timestamp.toISOString(),
  };

  measurements = [
    ...measurements,
    measurement,
  ].slice(
    -MAX_MEASUREMENTS,
  );

  notify();

  return measurement;
}

export function getDashboardRenderMeasurements():
  DashboardRenderMeasurement[] {
  return [
    ...measurements,
  ];
}

export function getDashboardRenderMeasurementsSnapshot():
  readonly DashboardRenderMeasurement[] {
  return measurements;
}

export function clearDashboardRenderMeasurements():
  void {
  measurements = [];
  notify();
}

export function subscribeDashboardPerformance(
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
