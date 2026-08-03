import type {
  CapabilitySdkClock,
} from '../../contracts';

export class SdkClock
  implements CapabilitySdkClock
{
  now(): Date {
    return new Date();
  }

  nowIso(): string {
    return this.now().toISOString();
  }
}