import {
  useEffect,
  useState,
} from "react";

import {
  logger,
  type LogEntry,
} from "./logger";

import {
  getPerformanceMeasurements,
  type PerformanceMeasurement,
} from "./performance";

import {
  getQueryDiagnostics,
  type QueryDiagnosticEntry,
} from "./query-diagnostics";

export interface DiagnosticsSnapshot {
  logs: LogEntry[];
  queries:
    QueryDiagnosticEntry[];
  performance:
    PerformanceMeasurement[];
}

export function useDiagnostics():
  DiagnosticsSnapshot {
  const [
    snapshot,
    setSnapshot,
  ] = useState<
    DiagnosticsSnapshot
  >(() => ({
    logs:
      logger.getEntries(),

    queries:
      getQueryDiagnostics(),

    performance:
      getPerformanceMeasurements(),
  }));

  useEffect(
    () =>
      logger.subscribe(
        (logs) => {
          setSnapshot({
            logs,
            queries:
              getQueryDiagnostics(),

            performance:
              getPerformanceMeasurements(),
          });
        },
      ),
    [],
  );

  return snapshot;
}
