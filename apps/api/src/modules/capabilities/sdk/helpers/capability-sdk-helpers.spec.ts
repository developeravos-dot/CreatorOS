import 'reflect-metadata';

import {
  CapabilitySdkContextFactory,
} from '../context';
import {
  assertSdkLifecycleSequence,
  assertSdkValidationResult,
  createSdkActivationLifecyclePlan,
  createSdkLifecyclePlan,
  createSdkOperationContext,
  createSdkValidationIssue,
  createSdkValidationResult,
  getSdkConfiguration,
  getSdkMetadataValue,
  hasSdkMetadataValue,
  incrementSdkStateCounter,
  mergeSdkMetadata,
  mergeSdkValidationResults,
  namespaceSdkMetadata,
  omitSdkMetadata,
  pickSdkMetadata,
  publishSdkEvent,
  requireSdkConfiguration,
  resolveSdkService,
  setSdkState,
  updateSdkState,
} from './index';

describe('Capability SDK Helpers', () => {
  it('creates operation child contexts', () => {
    const parent =
      new CapabilitySdkContextFactory().create({
        capabilityId:
          'creatoros.capability.helpers',
        capabilityVersion: '1.0.0',
        correlationId:
          'parent-correlation',
        configuration: {
          environment: 'test',
        },
      });

    const child =
      createSdkOperationContext(parent, {
        correlationId:
          'child-correlation',
        state: {
          operation: 'execute',
        },
      });

    expect(
      child.identity.parentContextId,
    ).toBe(
      parent.identity.contextId,
    );

    expect(
      child.identity.correlationId,
    ).toBe('child-correlation');

    expect(
      child.state.get('operation'),
    ).toBe('execute');
  });

  it('reads configuration and resolves services', () => {
    const token = Symbol('service');

    const context =
      new CapabilitySdkContextFactory().create({
        capabilityId:
          'creatoros.capability.configuration',
        capabilityVersion: '1.0.0',
        configuration: {
          region: 'uae',
        },
        services: new Map([
          [
            token,
            {
              value: 42,
            },
          ],
        ]),
      });

    expect(
      requireSdkConfiguration<string>(
        context,
        'region',
      ),
    ).toBe('uae');

    expect(
      getSdkConfiguration(
        context,
        'missing',
        'fallback',
      ),
    ).toBe('fallback');

    expect(
      resolveSdkService<{
        value: number;
      }>(context, token).value,
    ).toBe(42);
  });

  it('updates SDK context state', () => {
    const context =
      new CapabilitySdkContextFactory().create({
        capabilityId:
          'creatoros.capability.state',
        capabilityVersion: '1.0.0',
      });

    setSdkState(
      context,
      'status',
      'active',
    );

    updateSdkState<number>(
      context,
      'executions',
      (current) =>
        (current ?? 0) + 5,
    );

    incrementSdkStateCounter(
      context,
      'executions',
      2,
    );

    expect(
      context.state.get('status'),
    ).toBe('active');

    expect(
      context.state.get('executions'),
    ).toBe(7);
  });

  it('publishes enriched SDK events', async () => {
    const context =
      new CapabilitySdkContextFactory().create({
        capabilityId:
          'creatoros.capability.events',
        capabilityVersion: '1.0.0',
      });

    await publishSdkEvent(context, {
      type: 'sdk.helper.test',
    });

    const eventHistory =
      'getHistory' in context.events
        ? (
            context.events as {
              getHistory(): readonly Record<
                string,
                unknown
              >[];
            }
          ).getHistory()
        : [];

    expect(eventHistory).toHaveLength(1);

    expect(eventHistory[0]).toMatchObject({
      type: 'sdk.helper.test',
      capabilityId:
        'creatoros.capability.events',
    });
  });

  it('merges and filters metadata', () => {
    const metadata =
      mergeSdkMetadata(
        {
          environment: 'test',
          secret: 'hidden',
        },
        {
          region: 'uae',
        },
      );

    expect(
      getSdkMetadataValue(
        metadata,
        'region',
      ),
    ).toBe('uae');

    expect(
      hasSdkMetadataValue(
        metadata,
        'environment',
      ),
    ).toBe(true);

    expect(
      pickSdkMetadata(
        metadata,
        ['region'],
      ),
    ).toEqual({
      region: 'uae',
    });

    expect(
      omitSdkMetadata(
        metadata,
        ['secret'],
      ),
    ).toEqual({
      environment: 'test',
      region: 'uae',
    });

    expect(
      namespaceSdkMetadata(
        'runtime',
        {
          active: true,
        },
      ),
    ).toEqual({
      runtime: {
        active: true,
      },
    });
  });

  it('creates and merges validation results', () => {
    const capabilityId =
      'creatoros.capability.validation';

    const warning =
      createSdkValidationIssue({
        code: 'SDK_WARNING',
        message: 'Warning message.',
        severity: 'warning',
      });

    const error =
      createSdkValidationIssue({
        code: 'SDK_ERROR',
        message: 'Error message.',
      });

    const first =
      createSdkValidationResult(
        capabilityId,
        [warning],
      );

    const second =
      createSdkValidationResult(
        capabilityId,
        [error],
      );

    const merged =
      mergeSdkValidationResults(
        capabilityId,
        [first, second],
      );

    expect(first.valid).toBe(true);
    expect(second.valid).toBe(false);
    expect(merged.valid).toBe(false);
    expect(merged.issues).toHaveLength(2);

    expect(() =>
      assertSdkValidationResult(merged),
    ).toThrow(
      'Capability validation failed',
    );
  });

  it('creates executable activation lifecycle plans', () => {
    const plan =
      createSdkActivationLifecyclePlan();

    expect(plan.executable).toBe(true);

    expect(plan.initialState).toBe(
      'discovered',
    );

    expect(plan.targetState).toBe(
      'active',
    );

    expect(plan.steps).toHaveLength(5);

    expect(() =>
      assertSdkLifecycleSequence([
        'discovered',
        'registered',
        'validated',
      ]),
    ).not.toThrow();
  });

  it('detects invalid lifecycle plans', () => {
    const plan =
      createSdkLifecyclePlan([
        'discovered',
        'active',
      ]);

    expect(plan.executable).toBe(false);

    expect(() =>
      assertSdkLifecycleSequence([
        'discovered',
        'active',
      ]),
    ).toThrow(
      'transition from "discovered" to "active" is not allowed',
    );
  });
});