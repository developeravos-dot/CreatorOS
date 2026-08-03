export function normalizeAuditTimestamp(
  value?: string | Date,
  fallback:
    Date = new Date(),
): string {
  if (value instanceof Date) {
    if (
      Number.isFinite(
        value.getTime(),
      )
    ) {
      return value.toISOString();
    }

    return fallback.toISOString();
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

export function isAuditTimestampInRange(
  value: string,
  from?: string,
  to?: string,
): boolean {
  const timestamp =
    new Date(value).getTime();

  if (
    !Number.isFinite(timestamp)
  ) {
    return false;
  }

  if (from) {
    const fromTimestamp =
      new Date(from).getTime();

    if (
      Number.isFinite(
        fromTimestamp,
      ) &&
      timestamp < fromTimestamp
    ) {
      return false;
    }
  }

  if (to) {
    const toTimestamp =
      new Date(to).getTime();

    if (
      Number.isFinite(
        toTimestamp,
      ) &&
      timestamp > toTimestamp
    ) {
      return false;
    }
  }

  return true;
}