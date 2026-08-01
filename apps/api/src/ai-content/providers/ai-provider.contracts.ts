export type AiProviderErrorCode =
  | 'not_configured'
  | 'quota_exhausted'
  | 'rate_limited'
  | 'unavailable'
  | 'invalid_response'
  | 'authentication_failed'
  | 'unknown';

export interface AiTextGenerationRequest {
  task: string;
  systemInstruction: string;
  prompt: string;
  responseFormat: 'json';
  metadata?: Record<string, unknown>;
}

export interface AiTextGenerationResult<T = Record<string, unknown>> {
  providerId: string;
  model: string;
  output: T;
  latencyMs: number;
  requestId?: string;
}

export interface AiProviderHealth {
  id: string;
  configured: boolean;
  available: boolean;
  model: string;
  reason?: string;
}

export interface AiTextProvider {
  readonly id: string;

  isConfigured(): boolean;

  healthCheck(): Promise<AiProviderHealth>;

  generateJson<T extends Record<string, unknown>>(
    request: AiTextGenerationRequest,
  ): Promise<AiTextGenerationResult<T>>;
}

export class AiProviderError extends Error {
  constructor(
    public readonly providerId: string,
    public readonly code: AiProviderErrorCode,
    message: string,
    public readonly retryable: boolean,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AiProviderError';
  }
}