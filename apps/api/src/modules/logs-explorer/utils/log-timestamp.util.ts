export function normalizeLogTimestamp(
  value?: string | Date,
  fallback:
    Date = new Date(),
): string {
  if (value instanceof Date) {
    return Number.isFinite(
      value.getTime(),
    )
      ? value.toISOString()
      : fallback.toISOString();
  }

  if (
    typeof value === 'string' &&
    value.trim().length > 0
  ) {
    const parsed =
      new Date(value);

    if (
      Number.isFinite(
        parsed.getTime(),
      )
    ) {
      return parsed.toISOString();
    }
  }

  return fallback.toISOString();
}

export function isLogTimestampInRange(
  value: string,
  from?: string,
  to?: string,
): boolean {
  const valueTime =
    new Date(value).getTime();

  if (!Number.isFinite(valueTime)) {
    return false;
  }

  if (from) {
    const fromTime =
      new Date(from).getTime();

    if (
      Number.isFinite(fromTime) &&
      valueTime < fromTime
    ) {
      return false;
    }
  }

  if (to) {
    const toTime =
      new Date(to).getTime();

    if (
      Number.isFinite(toTime) &&
      valueTime > toTime
    ) {
      return false;
    }
  }

  return true;
}