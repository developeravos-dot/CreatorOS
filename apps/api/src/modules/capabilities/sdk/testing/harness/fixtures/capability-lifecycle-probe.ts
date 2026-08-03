import type {
  CapabilityLifecycleProbe,
  CapabilityLifecycleProbeSnapshot,
} from '../contracts';

type LifecycleHookName =
  | 'initialize'
  | 'activate'
  | 'stop';

export class DefaultCapabilityLifecycleProbe
  implements CapabilityLifecycleProbe
{
  private initializeCalls = 0;
  private activateCalls = 0;
  private stopCalls = 0;

  private readonly callOrder: string[] = [];

  private readonly failures =
    new Map<LifecycleHookName, Error>();

  async initialize(): Promise<void> {
    this.initializeCalls += 1;
    this.callOrder.push('initialize');

    this.throwFailure('initialize');
  }

  async activate(): Promise<void> {
    this.activateCalls += 1;
    this.callOrder.push('activate');

    this.throwFailure('activate');
  }

  async stop(): Promise<void> {
    this.stopCalls += 1;
    this.callOrder.push('stop');

    this.throwFailure('stop');
  }

  failNextInitialize(
    error = new Error(
      'Planned lifecycle initialize failure.',
    ),
  ): void {
    this.failures.set('initialize', error);
  }

  failNextActivate(
    error = new Error(
      'Planned lifecycle activate failure.',
    ),
  ): void {
    this.failures.set('activate', error);
  }

  failNextStop(
    error = new Error(
      'Planned lifecycle stop failure.',
    ),
  ): void {
    this.failures.set('stop', error);
  }

  snapshot(): CapabilityLifecycleProbeSnapshot {
    return Object.freeze({
      initializeCalls:
        this.initializeCalls,
      activateCalls:
        this.activateCalls,
      stopCalls:
        this.stopCalls,
      callOrder: Object.freeze([
        ...this.callOrder,
      ]),
    });
  }

  reset(): void {
    this.initializeCalls = 0;
    this.activateCalls = 0;
    this.stopCalls = 0;
    this.callOrder.length = 0;
    this.failures.clear();
  }

  private throwFailure(
    hook: LifecycleHookName,
  ): void {
    const error = this.failures.get(hook);

    if (!error) {
      return;
    }

    this.failures.delete(hook);

    throw error;
  }
}