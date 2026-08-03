import { CapabilityDomainError } from './capability-domain.errors';

const SEMANTIC_VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export class CapabilityVersionValue {
  private constructor(readonly value: string) {}

  static create(value: string): CapabilityVersionValue {
    const normalized = value.trim();

    if (!SEMANTIC_VERSION_PATTERN.test(normalized)) {
      throw new CapabilityDomainError(
        `Capability version "${value}" is not a valid semantic version.`,
        'CAPABILITY_VERSION_INVALID',
        { value },
      );
    }

    return new CapabilityVersionValue(normalized);
  }

  equals(other: CapabilityVersionValue): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}