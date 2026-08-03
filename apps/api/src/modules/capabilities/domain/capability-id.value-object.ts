import { CapabilityDomainError } from './capability-domain.errors';

const CAPABILITY_ID_PATTERN =
  /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

export class CapabilityIdValue {
  private constructor(readonly value: string) {}

  static create(value: string): CapabilityIdValue {
    const normalized = value.trim().toLowerCase();

    if (normalized.length < 3 || normalized.length > 160) {
      throw new CapabilityDomainError(
        'Capability id must contain between 3 and 160 characters.',
        'CAPABILITY_ID_LENGTH_INVALID',
        { value },
      );
    }

    if (!CAPABILITY_ID_PATTERN.test(normalized)) {
      throw new CapabilityDomainError(
        `Capability id "${value}" contains unsupported characters.`,
        'CAPABILITY_ID_FORMAT_INVALID',
        { value },
      );
    }

    return new CapabilityIdValue(normalized);
  }

  equals(other: CapabilityIdValue): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}