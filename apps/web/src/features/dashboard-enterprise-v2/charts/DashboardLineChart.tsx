import {
  useMemo,
  useState,
} from "react";

import {
  buildAreaPath,
  buildChartPoints,
  buildLinePath,
} from "./chart-geometry";

import type {
  DashboardTimeSeries,
} from "../intelligence/dashboard-chart-types";

interface DashboardLineChartProps {
  series: DashboardTimeSeries;
  width?: number;
  height?: number;
}

export default function DashboardLineChart({
  series,
  width = 760,
  height = 260,
}: DashboardLineChartProps) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(
    null,
  );

  const points =
    useMemo(
      () =>
        buildChartPoints(
          series.points.map(
            (point) =>
              point.value,
          ),
          series.points.map(
            (point) =>
              point.label,
          ),
          width,
          height,
          24,
        ),
      [
        height,
        series.points,
        width,
      ],
    );

  const linePath =
    buildLinePath(points);

  const areaPath =
    buildAreaPath(
      points,
      height,
      24,
    );

  const activePoint =
    activeIndex === null
      ? null
      : points[activeIndex] ??
        null;

  return (
    <div className="dashboard-enterprise-line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${series.label} chart`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={`chart-gradient-${series.id}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="currentColor"
              stopOpacity="0.28"
            />

            <stop
              offset="100%"
              stopColor="currentColor"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          className="dashboard-enterprise-line-chart__area"
          d={areaPath}
          fill={`url(#chart-gradient-${series.id})`}
        />

        <path
          className="dashboard-enterprise-line-chart__line"
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />

        {points.map(
          (point, index) => (
            <circle
              key={`${point.label}-${index}`}
              cx={point.x}
              cy={point.y}
              r={
                activeIndex === index
                  ? 6
                  : 4
              }
              tabIndex={0}
              aria-label={`${point.label}: ${point.value}`}
              onMouseEnter={() =>
                setActiveIndex(
                  index,
                )
              }
              onMouseLeave={() =>
                setActiveIndex(
                  null,
                )
              }
              onFocus={() =>
                setActiveIndex(
                  index,
                )
              }
              onBlur={() =>
                setActiveIndex(
                  null,
                )
              }
            />
          ),
        )}
      </svg>

      {activePoint ? (
        <div
          className="dashboard-enterprise-line-chart__tooltip"
          role="status"
        >
          <span>
            {activePoint.label}
          </span>

          <strong>
            {activePoint.value}
          </strong>
        </div>
      ) : null}

      <div className="dashboard-enterprise-line-chart__axis">
        {series.points
          .filter(
            (
              _,
              index,
            ) =>
              index === 0 ||
              index ===
                series.points.length -
                  1 ||
              index ===
                Math.floor(
                  series.points.length /
                    2,
                ),
          )
          .map(
            (point) => (
              <span
                key={
                  point.timestamp
                }
              >
                {point.label}
              </span>
            ),
          )}
      </div>
    </div>
  );
}
