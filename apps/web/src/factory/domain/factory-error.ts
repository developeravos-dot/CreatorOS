import type {
  FactoryErrorCode,
  FactoryErrorSeverity,
  FactoryErrorSnapshot,
} from "./factory-types";

export interface FactoryErrorOptions {
  readonly code:
    FactoryErrorCode;
  readonly severity?:
    FactoryErrorSeverity;
  readonly recoverable?: boolean;
  readonly details?:
    Readonly<
      Record<
        string,
        unknown
      >
    >;
  readonly occurredAt?: string;
  readonly cause?: unknown;
}

function normalizeTimestamp(
  value:
    string | undefined,
): string {
  if (!value) {
    return new Date()
      .toISOString();
  }

  const parsed =
    Date.parse(value);

  return Number.isFinite(parsed)
    ? new Date(parsed)
        .toISOString()
    : value;
}

export class FactoryError
  extends Error {
  readonly code:
    FactoryErrorCode;

  readonly severity:
    FactoryErrorSeverity;

  readonly recoverable:
    boolean;

  readonly details:
    Readonly<
      Record<
        string,
        unknown
      >
    >;

  readonly occurredAt:
    string;

  override readonly cause:
    unknown;

  constructor(
    message: string,
    options:
      FactoryErrorOptions,
  ) {
    super(message);

    this.name =
      "FactoryError";

    this.code =
      options.code;

    this.severity =
      options.severity ??
      "error";

    this.recoverable =
      options.recoverable ??
      false;

    this.details =
      options.details ??
      {};

    this.occurredAt =
      normalizeTimestamp(
        options.occurredAt,
      );

    this.cause =
      options.cause;
  }

  toSnapshot():
    FactoryErrorSnapshot {
    return {
      name:
        this.name,
      code:
        this.code,
      message:
        this.message,
      severity:
        this.severity,
      recoverable:
        this.recoverable,
      details:
        this.details,
      occurredAt:
        this.occurredAt,
    };
  }
}

export function toFactoryError(
  error: unknown,
  fallback: {
    readonly code:
      FactoryErrorCode;
    readonly message: string;
    readonly recoverable?: boolean;
    readonly details?:
      Readonly<
        Record<
          string,
          unknown
        >
      >;
  },
): FactoryError {
  if (
    error instanceof
    FactoryError
  ) {
    return error;
  }

  return new FactoryError(
    error instanceof Error
      ? error.message
      : fallback.message,
    {
      code:
        fallback.code,
      recoverable:
        fallback.recoverable,
      details: {
        ...fallback.details,
        originalError:
          error,
      },
      cause:
        error,
    },
  );
}
