export function clampPercentage(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(value),
    ),
  );
}

export function safeRatio(
  numerator: number,
  denominator: number,
): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return 0;
  }

  return clampPercentage(
    (
      numerator /
      denominator
    ) * 100,
  );
}

export function formatMetricValue(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 0,
    },
  ).format(
    Number.isFinite(value)
      ? value
      : 0,
  );
}

export function average(
  values: number[],
): number {
  const validValues =
    values.filter(
      Number.isFinite,
    );

  if (
    validValues.length === 0
  ) {
    return 0;
  }

  return (
    validValues.reduce(
      (
        total,
        value,
      ) => total + value,
      0,
    ) /
    validValues.length
  );
}
