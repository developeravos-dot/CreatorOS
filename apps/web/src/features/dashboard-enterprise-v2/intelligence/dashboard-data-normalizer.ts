export function sanitizeNumber(
  value: unknown,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return value;
}

export function normalizeSeriesValues(
  values: number[],
): number[] {
  if (
    values.length === 0
  ) {
    return [];
  }

  const sanitized =
    values.map(
      sanitizeNumber,
    );

  const maximum =
    Math.max(
      ...sanitized,
      0,
    );

  if (maximum === 0) {
    return sanitized.map(
      () => 0,
    );
  }

  return sanitized.map(
    (value) =>
      Math.round(
        (
          value /
          maximum
        ) * 100,
      ),
  );
}

export function calculateDelta(
  current: number,
  previous: number,
): {
  absolute: number;
  percentage: number;
  direction:
    | "up"
    | "down"
    | "stable";
} {
  const safeCurrent =
    sanitizeNumber(
      current,
    );

  const safePrevious =
    sanitizeNumber(
      previous,
    );

  const absolute =
    safeCurrent -
    safePrevious;

  if (absolute === 0) {
    return {
      absolute: 0,
      percentage: 0,
      direction: "stable",
    };
  }

  const percentage =
    safePrevious === 0
      ? 100
      : Math.round(
          (
            absolute /
            Math.abs(
              safePrevious,
            )
          ) * 100,
        );

  return {
    absolute,
    percentage:
      Math.abs(
        percentage,
      ),
    direction:
      absolute > 0
        ? "up"
        : "down",
  };
}

export function averageSeries(
  values: number[],
): number {
  if (
    values.length === 0
  ) {
    return 0;
  }

  const sanitized =
    values.map(
      sanitizeNumber,
    );

  return Math.round(
    sanitized.reduce(
      (
        total,
        value,
      ) => total + value,
      0,
    ) /
    sanitized.length,
  );
}
