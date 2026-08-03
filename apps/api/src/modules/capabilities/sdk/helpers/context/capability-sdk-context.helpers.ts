import type {
  CapabilityMetadata,
} from '../../../contracts';
import type {
  CapabilitySdkContext,
  CapabilitySdkContextScope,
} from '../../contracts';

export interface CreateSdkOperationContextInput {
  readonly scope?: CapabilitySdkContextScope;
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly configuration?:
    Readonly<Record<string, unknown>>;
  readonly services?:
    ReadonlyMap<string | symbol, unknown>;
  readonly state?:
    Readonly<Record<string, unknown>>;
  readonly metadata?: CapabilityMetadata;
}

export const createSdkOperationContext = (
  context: CapabilitySdkContext,
  input: CreateSdkOperationContextInput = {},
): CapabilitySdkContext =>
  context.createChild({
    scope: input.scope ?? 'operation',
    correlationId: input.correlationId,
    actorId: input.actorId,
    configuration: input.configuration,
    services: input.services,
    state: input.state,
    metadata: input.metadata,
  });

export const requireSdkConfiguration = <
  TValue = unknown,
>(
  context: CapabilitySdkContext,
  key: string,
): TValue =>
  context.configuration.require<TValue>(key);

export const getSdkConfiguration = <
  TValue = unknown,
>(
  context: CapabilitySdkContext,
  key: string,
  fallback?: TValue,
): TValue | undefined =>
  context.configuration.get<TValue>(key) ??
  fallback;

export const resolveSdkService = <
  TService,
>(
  context: CapabilitySdkContext,
  token: string | symbol,
): TService =>
  context.services.resolve<TService>(token);

export const resolveOptionalSdkService = <
  TService,
>(
  context: CapabilitySdkContext,
  token: string | symbol,
): TService | undefined =>
  context.services.resolveOptional<TService>(
    token,
  );

export const setSdkState = <
  TValue = unknown,
>(
  context: CapabilitySdkContext,
  key: string,
  value: TValue,
): TValue => {
  context.state.set(key, value);
  return value;
};

export const updateSdkState = <
  TValue = unknown,
>(
  context: CapabilitySdkContext,
  key: string,
  updater: (
    current: TValue | undefined,
  ) => TValue,
): TValue => {
  const nextValue = updater(
    context.state.get<TValue>(key),
  );

  context.state.set(key, nextValue);

  return nextValue;
};

export const incrementSdkStateCounter = (
  context: CapabilitySdkContext,
  key: string,
  increment = 1,
): number =>
  updateSdkState<number>(
    context,
    key,
    (current) =>
      (current ?? 0) + increment,
  );

export const getSdkStateSnapshot = (
  context: CapabilitySdkContext,
): Readonly<Record<string, unknown>> =>
  context.state.snapshot();

export const publishSdkEvent = async <
  TEvent extends object,
>(
  context: CapabilitySdkContext,
  event: TEvent,
): Promise<void> => {
  await context.events.publish({
    ...event,
    capabilityId:
      context.identity.capabilityId,
    capabilityVersion:
      context.identity.capabilityVersion,
    contextId:
      context.identity.contextId,
    instanceId:
      context.identity.instanceId,
    correlationId:
      context.identity.correlationId,
    occurredAt:
      context.clock.nowIso(),
  });
};