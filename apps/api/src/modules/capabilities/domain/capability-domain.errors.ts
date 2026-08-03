export class CapabilityDomainError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = 'CapabilityDomainError';
  }
}

export class InvalidCapabilityManifestError extends CapabilityDomainError {
  constructor(
    message: string,
    details?: Readonly<Record<string, unknown>>,
  ) {
    super(message, 'CAPABILITY_MANIFEST_INVALID', details);
    this.name = 'InvalidCapabilityManifestError';
  }
}

export class InvalidCapabilityStateTransitionError extends CapabilityDomainError {
  constructor(
    readonly from: string,
    readonly to: string,
  ) {
    super(
      `Capability lifecycle transition from "${from}" to "${to}" is not allowed.`,
      'CAPABILITY_STATE_TRANSITION_INVALID',
      { from, to },
    );

    this.name = 'InvalidCapabilityStateTransitionError';
  }
}