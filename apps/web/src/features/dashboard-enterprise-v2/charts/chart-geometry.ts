export interface ChartPoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

export function buildChartPoints(
  values: number[],
  labels: string[],
  width: number,
  height: number,
  padding = 16,
): ChartPoint[] {
  if (values.length === 0) {
    return [];
  }

  const safeWidth =
    Math.max(width, padding * 2);

  const safeHeight =
    Math.max(height, padding * 2);

  const maximum =
    Math.max(...values, 1);

  const minimum =
    Math.min(...values, 0);

  const range =
    Math.max(maximum - minimum, 1);

  const plotWidth =
    safeWidth - padding * 2;

  const plotHeight =
    safeHeight - padding * 2;

  return values.map(
    (value, index) => {
      const ratioX =
        values.length === 1
          ? 0.5
          : index /
            (values.length - 1);

      const ratioY =
        (value - minimum) /
        range;

      return {
        x:
          padding +
          plotWidth * ratioX,

        y:
          safeHeight -
          padding -
          plotHeight * ratioY,

        value,

        label:
          labels[index] ??
          String(index + 1),
      };
    },
  );
}

export function buildLinePath(
  points: ChartPoint[],
): string {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${
          point.x
        } ${point.y}`,
    )
    .join(" ");
}

export function buildAreaPath(
  points: ChartPoint[],
  height: number,
  padding = 16,
): string {
  if (points.length === 0) {
    return "";
  }

  const line =
    buildLinePath(points);

  const first =
    points[0];

  const last =
    points.at(-1);

  if (!first || !last) {
    return "";
  }

  const baseline =
    height - padding;

  return [
    line,
    `L ${last.x} ${baseline}`,
    `L ${first.x} ${baseline}`,
    "Z",
  ].join(" ");
}
