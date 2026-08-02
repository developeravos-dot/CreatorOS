import {
  buildChartPoints,
  buildLinePath,
} from "./chart-geometry";

interface DashboardSparklineProps {
  values: number[];
  label: string;
  width?: number;
  height?: number;
}

export default function DashboardSparkline({
  values,
  label,
  width = 120,
  height = 38,
}: DashboardSparklineProps) {
  const points =
    buildChartPoints(
      values,
      values.map(String),
      width,
      height,
      4,
    );

  const path =
    buildLinePath(points);

  return (
    <svg
      className="dashboard-enterprise-sparkline"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
