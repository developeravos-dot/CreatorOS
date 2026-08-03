import type {
  MockRuntimeInstanceState,
  MockRuntimeOperation,
} from '../../runtime';
import type {
  CapabilityTestingHarness,
} from '../contracts';

const fail = (
  message: string,
): never => {
  throw new Error(
    `Capability testing assertion failed: ${message}`,
  );
};

export const assertCapabilityRegistered = (
  harness: CapabilityTestingHarness,
): void => {
  if (
    !harness.runtime.registry.has(
      harness.fixture.capabilityId,
    )
  ) {
    fail(
      `Capability "${harness.fixture.capabilityId}" is not registered.`,
    );
  }
};

export const assertCapabilityNotRegistered = (
  harness: CapabilityTestingHarness,
): void => {
  if (
    harness.runtime.registry.has(
      harness.fixture.capabilityId,
    )
  ) {
    fail(
      `Capability "${harness.fixture.capabilityId}" is registered.`,
    );
  }
};

export const assertRuntimeCallCount = (
  harness: CapabilityTestingHarness,
  operation: MockRuntimeOperation,
  expected: number,
): void => {
  const actual =
    harness.runtime.calls.count(
      operation,
    );

  if (actual !== expected) {
    fail(
      `Expected ${expected} "${operation}" calls but found ${actual}.`,
    );
  }
};

export const assertLifecycleCallOrder = (
  harness: CapabilityTestingHarness,
  expected: readonly string[],
): void => {
  const actual =
    harness.fixture.lifecycle
      .snapshot()
      .callOrder;

  if (
    actual.length !== expected.length ||
    actual.some(
      (value, index) =>
        value !== expected[index],
    )
  ) {
    fail(
      `Expected lifecycle order "${expected.join(
        ', ',
      )}" but found "${actual.join(', ')}".`,
    );
  }
};

export const assertInstanceState = (
  harness: CapabilityTestingHarness,
  instanceId: string,
  expected:
    MockRuntimeInstanceState,
): void => {
  const instance =
    harness.runtime.requireInstance(
      instanceId,
    );

  if (instance.state !== expected) {
    fail(
      `Expected instance "${instanceId}" state "${expected}" but found "${instance.state}".`,
    );
  }
};

export const assertNoRuntimeFailures = (
  harness: CapabilityTestingHarness,
): void => {
  const failures =
    harness.runtime.calls.failed();

  if (failures.length > 0) {
    fail(
      `Expected no runtime failures but found ${failures.length}.`,
    );
  }
};

export const assertRuntimeFailureCount = (
  harness: CapabilityTestingHarness,
  expected: number,
): void => {
  const actual =
    harness.runtime.calls.failed().length;

  if (actual !== expected) {
    fail(
      `Expected ${expected} runtime failures but found ${actual}.`,
    );
  }
};