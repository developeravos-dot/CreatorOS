export class CapabilitySdkBuilderError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = 'CapabilitySdkBuilderError';
  }
}

export class CapabilitySdkBuilderValidationError
  extends CapabilitySdkBuilderError
{
  constructor(
    readonly issues: readonly string[],
  ) {
    super(
      `Capability SDK builder validation failed: ${issues.join('; ')}`,
      'CAPABILITY_SDK_BUILDER_VALIDATION_FAILED',
      { issues },
    );

    this.name = 'CapabilitySdkBuilderValidationError';
  }
}