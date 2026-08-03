import type {
  CapabilityIdentifier,
  CapabilityMetadata,
} from '../../../../contracts';
import type {
  MockRuntimeCall,
  MockRuntimeOperation,
} from '../contracts';
import {
  FakeSdkClock,
} from '../../mocks';

export interface RecordMockRuntimeCallInput {
  readonly operation:
    MockRuntimeOperation;
  readonly capabilityId?:
    CapabilityIdentifier;
  readonly instanceId?: string;
  readonly successful?: boolean;
  readonly error?: unknown;
  readonly metadata?: CapabilityMetadata;
}

export class MockRuntimeCallTracker {
  private readonly calls:
    MockRuntimeCall[] = [];

  private sequence = 0;

  constructor(
    private readonly clock =
      new FakeSdkClock(),
  ) {}

  record(
    input: RecordMockRuntimeCallInput,
  ): MockRuntimeCall {
    this.sequence += 1;

    const call: MockRuntimeCall =
      Object.freeze({
        sequence: this.sequence,
        operation: input.operation,
        capabilityId:
          input.capabilityId,
        instanceId: input.instanceId,
        occurredAt:
          this.clock.nowIso(),
        successful:
          input.successful ?? true,
        error:
          input.error instanceof Error
            ? input.error.message
            : input.error !== undefined
              ? String(input.error)
              : undefined,
        metadata: input.metadata,
      });

    this.calls.push(call);

    return call;
  }

  all(): readonly MockRuntimeCall[] {
    return [...this.calls];
  }

  byOperation(
    operation: MockRuntimeOperation,
  ): readonly MockRuntimeCall[] {
    return this.calls.filter(
      (call) =>
        call.operation === operation,
    );
  }

  byCapability(
    capabilityId: CapabilityIdentifier,
  ): readonly MockRuntimeCall[] {
    return this.calls.filter(
      (call) =>
        call.capabilityId === capabilityId,
    );
  }

  byInstance(
    instanceId: string,
  ): readonly MockRuntimeCall[] {
    return this.calls.filter(
      (call) =>
        call.instanceId === instanceId,
    );
  }

  successful():
    readonly MockRuntimeCall[] {
    return this.calls.filter(
      (call) => call.successful,
    );
  }

  failed(): readonly MockRuntimeCall[] {
    return this.calls.filter(
      (call) => !call.successful,
    );
  }

  last():
    | MockRuntimeCall
    | undefined {
    return this.calls.at(-1);
  }

  count(
    operation?: MockRuntimeOperation,
  ): number {
    return operation
      ? this.byOperation(operation).length
      : this.calls.length;
  }

  clear(): void {
    this.calls.length = 0;
    this.sequence = 0;
  }
}