export function formatRelativeTime(
  timestamp: string,
  now = new Date(),
): string {
  const date =
    new Date(timestamp);

  const differenceMs =
    now.getTime() -
    date.getTime();

  if (
    !Number.isFinite(
      differenceMs,
    )
  ) {
    return "Unknown time";
  }

  const seconds =
    Math.max(
      0,
      Math.floor(
        differenceMs / 1000,
      ),
    );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds / 60,
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  return `${days}d ago`;
}

export function ensureIsoTimestamp(
  value: string | undefined,
  fallback = new Date(),
): string {
  if (!value) {
    return fallback.toISOString();
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return fallback.toISOString();
  }

  return parsed.toISOString();
}
