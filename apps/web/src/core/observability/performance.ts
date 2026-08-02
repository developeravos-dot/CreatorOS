import {
  logger,
} from "./logger";

export interface PerformanceMeasurement {
  name: string;
  scope: string;
  durationMs: number;
  timestamp: string;
  metadata?: Record<
    string,
    unknown
  >;
}

const measurements:
  PerformanceMeasurement[] = [];

const MAX_MEASUREMENTS = 150;

export async function measureAsync<T>(
  scope: string,
  name: string,
  operation: () => Promise<T>,
  metadata?: Record<
    string,
    unknown
  >,
): Promise<T> {
  const startedAt =
    performance.now();

  try {
    return await operation();
  } finally {
    const durationMs =
      performance.now() -
      startedAt;

    const measurement:
      PerformanceMeasurement = {
        scope,
        name,
        durationMs,
        timestamp:
          new Date().toISOString(),
        metadata,
      };

    measurements.unshift(
      measurement,
    );

    measurements.splice(
      MAX_MEASUREMENTS,
    );

    logger.debug(
      scope,
      `${name} completed in ${durationMs.toFixed(2)}ms`,
      {
        ...metadata,
        durationMs,
      },
    );
  }
}

export function getPerformanceMeasurements():
  PerformanceMeasurement[] {
  return [
    ...measurements,
  ];
}

export function clearPerformanceMeasurements():
  void {
  measurements.length = 0;
}
