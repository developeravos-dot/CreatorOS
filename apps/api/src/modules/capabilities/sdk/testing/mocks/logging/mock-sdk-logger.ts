import type {
  CapabilityMetadata,
} from '../../../../contracts';
import type {
  CapabilityLogger,
} from '../../../../interfaces';

export type MockSdkLogLevel =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error';

export interface MockSdkLogEntry {
  readonly sequence: number;
  readonly level: MockSdkLogLevel;
  readonly message: string;
  readonly error?: unknown;
  readonly context?: CapabilityMetadata;
}

export class MockSdkLogger
  implements CapabilityLogger
{
  private readonly entries:
    MockSdkLogEntry[] = [];

  private nextSequence = 0;

  debug(
    message: string,
    context?: CapabilityMetadata,
  ): void {
    this.record(
      'debug',
      message,
      undefined,
      context,
    );
  }

  info(
    message: string,
    context?: CapabilityMetadata,
  ): void {
    this.record(
      'info',
      message,
      undefined,
      context,
    );
  }

  warn(
    message: string,
    context?: CapabilityMetadata,
  ): void {
    this.record(
      'warn',
      message,
      undefined,
      context,
    );
  }

  error(
    message: string,
    error?: unknown,
    context?: CapabilityMetadata,
  ): void {
    this.record(
      'error',
      message,
      error,
      context,
    );
  }

  getEntries(): readonly MockSdkLogEntry[] {
    return [...this.entries];
  }

  getByLevel(
    level: MockSdkLogLevel,
  ): readonly MockSdkLogEntry[] {
    return this.entries.filter(
      (entry) => entry.level === level,
    );
  }

  containsMessage(
    message: string,
  ): boolean {
    return this.entries.some(
      (entry) =>
        entry.message.includes(message),
    );
  }

  clear(): void {
    this.entries.length = 0;
    this.nextSequence = 0;
  }

  private record(
    level: MockSdkLogLevel,
    message: string,
    error?: unknown,
    context?: CapabilityMetadata,
  ): void {
    this.nextSequence += 1;

    this.entries.push(
      Object.freeze({
        sequence: this.nextSequence,
        level,
        message,
        error,
        context,
      }),
    );
  }
}