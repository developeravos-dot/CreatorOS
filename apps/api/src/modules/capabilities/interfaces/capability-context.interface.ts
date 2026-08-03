import type {
  CapabilityIdentifier,
  CapabilityMetadata,
  CapabilityVersion,
} from '../contracts';

export interface CapabilityLogger {
  debug(message: string, context?: CapabilityMetadata): void;
  info(message: string, context?: CapabilityMetadata): void;
  warn(message: string, context?: CapabilityMetadata): void;
  error(
    message: string,
    error?: unknown,
    context?: CapabilityMetadata,
  ): void;
}

export interface CapabilityEventPublisher {
  publish<TEvent extends object>(event: TEvent): Promise<void>;
}

export interface CapabilityConfigurationReader {
  get<TValue = unknown>(key: string): TValue | undefined;
  require<TValue = unknown>(key: string): TValue;
}

export interface CapabilityServiceResolver {
  resolve<TService>(token: string | symbol): TService;
  resolveOptional<TService>(token: string | symbol): TService | undefined;
}

export interface CapabilityExecutionContext {
  readonly capabilityId: CapabilityIdentifier;
  readonly version: CapabilityVersion;
  readonly instanceId: string;
  readonly correlationId: string;

  readonly logger: CapabilityLogger;
  readonly events: CapabilityEventPublisher;
  readonly configuration: CapabilityConfigurationReader;
  readonly services: CapabilityServiceResolver;

  readonly metadata?: CapabilityMetadata;
}