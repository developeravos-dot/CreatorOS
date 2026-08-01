export type IntelligenceProviderName = 'local' | 'openai' | 'mock';

export interface IntelligenceGenerateRequest {
  prompt: string;
  systemPrompt?: string;
  provider?: IntelligenceProviderName | 'auto';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  allowPaidProvider?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IntelligenceUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCostUsd: number;
}

export interface IntelligenceGenerateResult {
  success: boolean;
  provider: IntelligenceProviderName;
  model: string;
  content: string;
  usage: IntelligenceUsage;
  durationMs: number;
  fallbackUsed: boolean;
  warnings: string[];
}

export interface IntelligenceProviderFailure {
  provider: IntelligenceProviderName;
  code: string;
  message: string;
  retryable: boolean;
}

export interface IntelligenceProvider {
  readonly name: IntelligenceProviderName;

  isAvailable(): Promise<boolean>;

  generate(
    request: IntelligenceGenerateRequest,
  ): Promise<IntelligenceGenerateResult>;
}
