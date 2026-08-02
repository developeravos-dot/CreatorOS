import {
  useState,
} from "react";

import DashboardLineChart from "./DashboardLineChart";

import type {
  DashboardTimeSeries,
} from "../intelligence/dashboard-chart-types";

interface DashboardChartPanelProps {
  series:
    DashboardTimeSeries[];
}

export default function DashboardChartPanel({
  series,
}: DashboardChartPanelProps) {
  const [
    activeSeriesId,
    setActiveSeriesId,
  ] = useState(
    series[0]?.id ?? "",
  );

  const activeSeries =
    series.find(
      (item) =>
        item.id === activeSeriesId,
    ) ??
    series[0];

  if (!activeSeries) {
    return (
      <div className="dashboard-enterprise-chart-empty">
        No chart data available.
      </div>
    );
  }

  return (
    <div className="dashboard-enterprise-chart-panel">
      <div className="dashboard-enterprise-chart-panel__tabs">
        {series.map(
          (item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={
                item.id ===
                activeSeries.id
              }
              onClick={() =>
                setActiveSeriesId(
                  item.id,
                )
              }
            >
              {item.label}
            </button>
          ),
        )}
      </div>

      <header>
        <div>
          <h3>
            {activeSeries.label}
          </h3>

          <p>
            {
              activeSeries.description
            }
          </p>
        </div>

        <strong>
          {
            activeSeries.points.at(-1)
              ?.value ?? 0
          }
        </strong>
      </header>

      <DashboardLineChart
        series={activeSeries}
      />
    </div>
  );
}
