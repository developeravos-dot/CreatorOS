import DashboardPerformanceMetricCard from "./DashboardPerformanceMetricCard";

import type {
  DashboardPerformanceSnapshot,
} from "./dashboard-performance-types";

interface DashboardPerformancePanelProps {
  snapshot:
    DashboardPerformanceSnapshot;
}

export default function DashboardPerformancePanel({
  snapshot,
}: DashboardPerformancePanelProps) {
  return (
    <section className="dashboard-performance-panel">
      <header>
        <div>
          <span>
            Production health
          </span>

          <h2>
            Dashboard performance
          </h2>

          <p>
            Runtime measurements and production readiness indicators.
          </p>
        </div>

        <strong>
          {snapshot.summary.score}
          <small>
            /100
          </small>
        </strong>
      </header>

      <div className="dashboard-performance-summary">
        <span>
          Healthy
          <strong>
            {snapshot.summary.healthy}
          </strong>
        </span>

        <span>
          Warning
          <strong>
            {snapshot.summary.warning}
          </strong>
        </span>

        <span>
          Critical
          <strong>
            {snapshot.summary.critical}
          </strong>
        </span>
      </div>

      <div className="dashboard-performance-grid">
        {snapshot.metrics.map(
          (metric) => (
            <DashboardPerformanceMetricCard
              key={metric.id}
              metric={metric}
            />
          ),
        )}
      </div>
    </section>
  );
}
