export class CapabilityRuntimeError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = 'CapabilityRuntimeError';
  }
}

export class CapabilityRuntimeAdapterNotFoundError
  extends CapabilityRuntimeError
{
  constructor(runtime: string) {
    super(
      `No runtime adapter is registered for runtime "${runtime}".`,
      'CAPABILITY_RUNTIME_ADAPTER_NOT_FOUND',
      { runtime },
    );

    this.name = 'CapabilityRuntimeAdapterNotFoundError';
  }
}

export class CapabilityRuntimeInstanceNotFoundError
  extends CapabilityRuntimeError
{
  constructor(instanceId: string) {
    super(
      `Runtime instance "${instanceId}" was not found.`,
      'CAPABILITY_RUNTIME_INSTANCE_NOT_FOUND',
      { instanceId },
    );

    this.name = 'CapabilityRuntimeInstanceNotFoundError';
  }
}

export class CapabilityRuntimeAlreadyRunningError
  extends CapabilityRuntimeError
{
  constructor(capabilityId: string) {
    super(
      `Capability "${capabilityId}" already has an active runtime instance.`,
      'CAPABILITY_RUNTIME_ALREADY_RUNNING',
      { capabilityId },
    );

    this.name = 'CapabilityRuntimeAlreadyRunningError';
  }
}

export class CapabilityRuntimeLoadError
  extends CapabilityRuntimeError
{
  constructor(
    capabilityId: string,
    cause?: unknown,
  ) {
    super(
      `Capability "${capabilityId}" could not be loaded by the runtime.`,
      'CAPABILITY_RUNTIME_LOAD_FAILED',
      {
        capabilityId,
        cause:
          cause instanceof Error
            ? cause.message
            : String(cause),
      },
    );

    this.name = 'CapabilityRuntimeLoadError';
  }
}