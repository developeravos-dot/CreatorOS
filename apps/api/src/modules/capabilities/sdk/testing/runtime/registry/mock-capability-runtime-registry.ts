import type {
  CapabilityIdentifier,
} from '../../../../contracts';
import type {
  RegisterMockRuntimeInput,
  MockRuntimeRegistration,
} from '../contracts';
import {
  FakeSdkClock,
} from '../../mocks';
import {
  MockRuntimeCallTracker,
} from '../tracking';

export class MockCapabilityRuntimeRegistry {
  private readonly registrations =
    new Map<
      CapabilityIdentifier,
      MockRuntimeRegistration
    >();

  constructor(
    private readonly clock =
      new FakeSdkClock(),
    private readonly calls =
      new MockRuntimeCallTracker(clock),
  ) {}

  register(
    input: RegisterMockRuntimeInput,
  ): MockRuntimeRegistration {
    const capabilityId =
      input.manifest.id;

    if (
      input.provider.manifest.id !==
      capabilityId
    ) {
      throw new Error(
        `Provider manifest "${input.provider.manifest.id}" does not match registration manifest "${capabilityId}".`,
      );
    }

    if (
      input.provider.manifest.version !==
      input.manifest.version
    ) {
      throw new Error(
        `Provider version "${input.provider.manifest.version}" does not match registration version "${input.manifest.version}".`,
      );
    }

    if (
      this.registrations.has(
        capabilityId,
      )
    ) {
      throw new Error(
        `Mock runtime capability "${capabilityId}" is already registered.`,
      );
    }

    const registration:
      MockRuntimeRegistration =
        Object.freeze({
          capabilityId,
          version:
            input.manifest.version,
          manifest: input.manifest,
          provider: input.provider,
          registeredAt:
            this.clock.nowIso(),
        });

    this.registrations.set(
      capabilityId,
      registration,
    );

    this.calls.record({
      operation: 'register',
      capabilityId,
    });

    return registration;
  }

  unregister(
    capabilityId: CapabilityIdentifier,
  ): MockRuntimeRegistration {
    const registration =
      this.require(capabilityId);

    this.registrations.delete(
      capabilityId,
    );

    this.calls.record({
      operation: 'unregister',
      capabilityId,
    });

    return registration;
  }

  get(
    capabilityId: CapabilityIdentifier,
  ): MockRuntimeRegistration | undefined {
    return this.registrations.get(
      capabilityId,
    );
  }

  require(
    capabilityId: CapabilityIdentifier,
  ): MockRuntimeRegistration {
    const registration =
      this.get(capabilityId);

    if (!registration) {
      throw new Error(
        `Mock runtime capability "${capabilityId}" is not registered.`,
      );
    }

    return registration;
  }

  has(
    capabilityId: CapabilityIdentifier,
  ): boolean {
    return this.registrations.has(
      capabilityId,
    );
  }

  list():
    readonly MockRuntimeRegistration[] {
    return [
      ...this.registrations.values(),
    ];
  }

  size(): number {
    return this.registrations.size;
  }

  clear(): void {
    this.registrations.clear();
  }
}