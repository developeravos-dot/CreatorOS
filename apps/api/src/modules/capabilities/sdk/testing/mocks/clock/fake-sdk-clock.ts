import type {
  CapabilitySdkClock,
} from '../../../contracts';

export class FakeSdkClock
  implements CapabilitySdkClock
{
  private currentTime: Date;

  constructor(
    initialTime:
      string | Date =
        '2026-01-01T00:00:00.000Z',
  ) {
    this.currentTime =
      initialTime instanceof Date
        ? new Date(initialTime.getTime())
        : new Date(initialTime);

    if (
      Number.isNaN(
        this.currentTime.getTime(),
      )
    ) {
      throw new Error(
        'Fake SDK clock requires a valid initial time.',
      );
    }
  }

  now(): Date {
    return new Date(
      this.currentTime.getTime(),
    );
  }

  nowIso(): string {
    return this.currentTime.toISOString();
  }

  set(
    value: string | Date,
  ): void {
    const next =
      value instanceof Date
        ? new Date(value.getTime())
        : new Date(value);

    if (Number.isNaN(next.getTime())) {
      throw new Error(
        'Fake SDK clock cannot be set to an invalid time.',
      );
    }

    this.currentTime = next;
  }

  advanceMilliseconds(
    milliseconds: number,
  ): Date {
    if (!Number.isFinite(milliseconds)) {
      throw new Error(
        'Clock advance value must be finite.',
      );
    }

    this.currentTime = new Date(
      this.currentTime.getTime() +
        milliseconds,
    );

    return this.now();
  }

  advanceSeconds(seconds: number): Date {
    return this.advanceMilliseconds(
      seconds * 1_000,
    );
  }

  advanceMinutes(minutes: number): Date {
    return this.advanceSeconds(
      minutes * 60,
    );
  }

  advanceHours(hours: number): Date {
    return this.advanceMinutes(
      hours * 60,
    );
  }

  reset(
    value:
      string | Date =
        '2026-01-01T00:00:00.000Z',
  ): void {
    this.set(value);
  }
}