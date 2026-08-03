export class CapabilityRegistryError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = 'CapabilityRegistryError';
  }
}

export class CapabilityAlreadyRegisteredError
  extends CapabilityRegistryError
{
  constructor(capabilityId: string) {
    super(
      `Capability "${capabilityId}" is already registered.`,
      'CAPABILITY_ALREADY_REGISTERED',
      { capabilityId },
    );

    this.name = 'CapabilityAlreadyRegisteredError';
  }
}

export class CapabilityNotRegisteredError
  extends CapabilityRegistryError
{
  constructor(capabilityId: string) {
    super(
      `Capability "${capabilityId}" is not registered.`,
      'CAPABILITY_NOT_REGISTERED',
      { capabilityId },
    );

    this.name = 'CapabilityNotRegisteredError';
  }
}

export class CapabilityRegistryValidationError
  extends CapabilityRegistryError
{
  constructor(
    capabilityId: string,
    readonly issues: readonly unknown[],
  ) {
    super(
      `Capability "${capabilityId}" failed registry validation.`,
      'CAPABILITY_REGISTRY_VALIDATION_FAILED',
      { capabilityId, issues },
    );

    this.name = 'CapabilityRegistryValidationError';
  }
}