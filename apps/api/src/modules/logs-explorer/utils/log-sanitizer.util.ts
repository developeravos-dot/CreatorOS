const REDACTED =
  '[REDACTED]';

const SENSITIVE_KEY_PATTERN =
  /(?:password|passwd|secret|token|api[-_]?key|authorization|cookie|database[-_]?url|connection[-_]?string|private[-_]?key|client[-_]?secret)/i;

const CONNECTION_STRING_PATTERN =
  /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^\s"']+/gi;

const BEARER_PATTERN =
  /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi;

const WINDOWS_PATH_PATTERN =
  /[A-Za-z]:\\[^\r\n"']+/g;

const UNIX_PATH_PATTERN =
  /\/(?:home|root|Users|var\/lib)\/[^\r\n"']+/g;

export function sanitizeLogValue(
  value: unknown,
  maxDepth = 8,
): unknown {
  return sanitizeValue(
    value,
    0,
    Math.max(
      1,
      maxDepth,
    ),
    new WeakSet<object>(),
  );
}

export function sanitizeLogRecord(
  value:
    Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  const sanitized =
    sanitizeLogValue(value);

  if (
    typeof sanitized !== 'object' ||
    sanitized === null ||
    Array.isArray(sanitized)
  ) {
    return {};
  }

  return sanitized as
    Readonly<Record<string, unknown>>;
}

export function sanitizeLogMessage(
  value: string,
): string {
  return value
    .replace(
      CONNECTION_STRING_PATTERN,
      '[REDACTED_CONNECTION_STRING]',
    )
    .replace(
      BEARER_PATTERN,
      'Bearer [REDACTED]',
    )
    .replace(
      WINDOWS_PATH_PATTERN,
      '[REDACTED_PATH]',
    )
    .replace(
      UNIX_PATH_PATTERN,
      '[REDACTED_PATH]',
    )
    .replace(
      /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[^\s,;]+/gi,
      '$1=[REDACTED]',
    );
}

function sanitizeValue(
  value: unknown,
  depth: number,
  maxDepth: number,
  visited:
    WeakSet<object>,
): unknown {
  if (depth > maxDepth) {
    return '[MAX_DEPTH_REACHED]';
  }

  if (
    value === null ||
    value === undefined ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return sanitizeLogMessage(value);
  }

  if (value instanceof Date) {
    return Number.isFinite(
      value.getTime(),
    )
      ? value.toISOString()
      : '[INVALID_DATE]';
  }

  if (
    typeof value !== 'object'
  ) {
    return String(value);
  }

  if (visited.has(value)) {
    return '[CIRCULAR_REFERENCE]';
  }

  visited.add(value);

  try {
    if (Array.isArray(value)) {
      return value.map(
        (item) =>
          sanitizeValue(
            item,
            depth + 1,
            maxDepth,
            visited,
          ),
      );
    }

    const output:
      Record<string, unknown> =
        {};

    for (
      const [key, item]
      of Object.entries(value)
    ) {
      output[key] =
        SENSITIVE_KEY_PATTERN
          .test(key)
          ? REDACTED
          : sanitizeValue(
              item,
              depth + 1,
              maxDepth,
              visited,
            );
    }

    return output;
  } finally {
    visited.delete(value);
  }
}