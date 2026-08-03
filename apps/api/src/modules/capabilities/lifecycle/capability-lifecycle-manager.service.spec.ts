import 'reflect-metadata';

import { CapabilityLifecycleManagerService } from './capability-lifecycle-manager.service';

describe('CapabilityLifecycleManagerService', () => {
  it('initializes capabilities in discovered state', async () => {
    const service =
      new CapabilityLifecycleManagerService();

    const state = await service.initialize(
      'creatoros.capability.lifecycle-test',
    );

    expect(state.state).toBe('discovered');
  });

  it('transitions through valid lifecycle states', async () => {
    const service =
      new CapabilityLifecycleManagerService();

    const capabilityId =
      'creatoros.capability.lifecycle-test';

    await service.initialize(capabilityId);

    await service.transition({
      capabilityId,
      targetState: 'registered',
    });

    const result = await service.transition({
      capabilityId,
      targetState: 'validated',
      reason: 'Manifest validation passed.',
    });

    expect(result.previousState).toBe('registered');
    expect(result.currentState).toBe('validated');
    expect(result.changed).toBe(true);
    expect(service.getHistory(capabilityId)).toHaveLength(2);
  });

  it('returns unchanged result for the same state', async () => {
    const service =
      new CapabilityLifecycleManagerService();

    const capabilityId =
      'creatoros.capability.lifecycle-noop';

    await service.initialize(capabilityId);

    const result = await service.transition({
      capabilityId,
      targetState: 'discovered',
    });

    expect(result.changed).toBe(false);
    expect(service.getHistory(capabilityId)).toHaveLength(0);
  });

  it('rejects invalid transitions', async () => {
    const service =
      new CapabilityLifecycleManagerService();

    const capabilityId =
      'creatoros.capability.lifecycle-invalid';

    await service.initialize(capabilityId);

    await expect(
      service.transition({
        capabilityId,
        targetState: 'active',
      }),
    ).rejects.toThrow(
      'transition from "discovered" to "active" is not allowed',
    );
  });
});