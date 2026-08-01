interface DashboardChartProps {
  values: number[];
  labels?: string[];
}

export default function DashboardChart({
  values,
  labels = [],
}: DashboardChartProps) {
  const normalized = values.length > 0 ? values : [0];
  const maximum = Math.max(...normalized, 1);

  return (
    <div className="dashboard-v2-chart">
      <div className="dashboard-v2-chart__plot">
        {normalized.map((value, index) => {
          const height = Math.max(5, (value / maximum) * 100);

          return (
            <div
              className="dashboard-v2-chart__column"
              key={`${value}-${index}`}
            >
              <span
                className="dashboard-v2-chart__bar"
                style={{ height: `${height}%` }}
                title={`${value}`}
              />

              <small>
                {labels[index] ?? `${index + 1}`}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
