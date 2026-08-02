export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error";

export interface LogEntry {
  id: string;
  level: LogLevel;
  scope: string;
  message: string;
  timestamp: string;
  metadata?: Record<
    string,
    unknown
  >;
}

export type LogSubscriber = (
  entries: LogEntry[],
) => void;

const MAX_LOG_ENTRIES = 250;

class CreatorLogger {
  private entries: LogEntry[] = [];

  private readonly subscribers =
    new Set<LogSubscriber>();

  private write(
    level: LogLevel,
    scope: string,
    message: string,
    metadata?: Record<
      string,
      unknown
    >,
  ): void {
    const entry: LogEntry = {
      id:
        globalThis.crypto
          ?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`,

      level,
      scope,
      message,

      timestamp:
        new Date().toISOString(),

      metadata,
    };

    this.entries = [
      entry,
      ...this.entries,
    ].slice(
      0,
      MAX_LOG_ENTRIES,
    );

    if (
      import.meta.env.DEV ||
      level === "warn" ||
      level === "error"
    ) {
      const consoleMethod =
        level === "debug"
          ? console.debug
          : level === "info"
            ? console.info
            : level === "warn"
              ? console.warn
              : console.error;

      consoleMethod(
        `[CreatorOS:${scope}] ${message}`,
        metadata ?? "",
      );
    }

    this.notify();
  }

  debug(
    scope: string,
    message: string,
    metadata?: Record<
      string,
      unknown
    >,
  ): void {
    this.write(
      "debug",
      scope,
      message,
      metadata,
    );
  }

  info(
    scope: string,
    message: string,
    metadata?: Record<
      string,
      unknown
    >,
  ): void {
    this.write(
      "info",
      scope,
      message,
      metadata,
    );
  }

  warn(
    scope: string,
    message: string,
    metadata?: Record<
      string,
      unknown
    >,
  ): void {
    this.write(
      "warn",
      scope,
      message,
      metadata,
    );
  }

  error(
    scope: string,
    message: string,
    metadata?: Record<
      string,
      unknown
    >,
  ): void {
    this.write(
      "error",
      scope,
      message,
      metadata,
    );
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
    this.notify();
  }

  subscribe(
    subscriber: LogSubscriber,
  ): () => void {
    this.subscribers.add(
      subscriber,
    );

    subscriber(
      this.getEntries(),
    );

    return () => {
      this.subscribers.delete(
        subscriber,
      );
    };
  }

  private notify(): void {
    const entries =
      this.getEntries();

    for (
      const subscriber
      of this.subscribers
    ) {
      subscriber(entries);
    }
  }
}

export const logger =
  new CreatorLogger();
