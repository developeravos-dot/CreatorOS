import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  AiProviderError,
  AiProviderHealth,
  AiTextGenerationRequest,
  AiTextGenerationResult,
  AiTextProvider,
} from './ai-provider.contracts';

@Injectable()
export class OpenAiTextProvider implements AiTextProvider {
  readonly id = 'openai';

  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    this.model = process.env.OPENAI_MODEL?.trim() || 'gpt-5';
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  isConfigured(): boolean {
    return Boolean(this.client);
  }

  async healthCheck(): Promise<AiProviderHealth> {
    return {
      id: this.id,
      configured: this.isConfigured(),
      available: this.isConfigured(),
      model: this.model,
      reason: this.isConfigured() ? undefined : 'OPENAI_API_KEY is missing.',
    };
  }

  async generateJson<T extends Record<string, unknown>>(
    request: AiTextGenerationRequest,
  ): Promise<AiTextGenerationResult<T>> {
    if (!this.client) {
      throw new AiProviderError(
        this.id,
        'not_configured',
        'OpenAI is not configured.',
        true,
      );
    }

    const startedAt = Date.now();

    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: request.systemInstruction,
        input: `${request.task}\n\n${request.prompt}`,
        text: {
          format: { type: 'json_object' },
        },
      });

      const outputText = response.output_text?.trim();
      if (!outputText) {
        throw new AiProviderError(
          this.id,
          'invalid_response',
          'OpenAI returned an empty response.',
          true,
        );
      }

      return {
        providerId: this.id,
        model: this.model,
        output: this.parseJson<T>(outputText),
        latencyMs: Date.now() - startedAt,
        requestId: response.id,
      };
    } catch (error) {
      if (error instanceof AiProviderError) {
        throw error;
      }

      throw this.mapError(error);
    }
  }

  private parseJson<T extends Record<string, unknown>>(value: string): T {
    const cleaned = value
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      }

      throw new AiProviderError(
        this.id,
        'invalid_response',
        'OpenAI response was not valid JSON.',
        true,
      );
    }
  }

  private mapError(error: unknown): AiProviderError {
    const value = error as {
      status?: number;
      code?: string;
      type?: string;
      message?: string;
    };

    const status = value?.status;
    const code = value?.code;
    const type = value?.type;
    const message = value?.message || 'Unknown OpenAI error.';

    if (
      status === 429 &&
      (code === 'credit_balance_exhausted' || type === 'insufficient_quota')
    ) {
      return new AiProviderError(
        this.id,
        'quota_exhausted',
        message,
        true,
        error,
      );
    }

    if (status === 429) {
      return new AiProviderError(
        this.id,
        'rate_limited',
        message,
        true,
        error,
      );
    }

    if (status === 401 || status === 403) {
      return new AiProviderError(
        this.id,
        'authentication_failed',
        message,
        false,
        error,
      );
    }

    if (!status || status >= 500) {
      return new AiProviderError(
        this.id,
        'unavailable',
        message,
        true,
        error,
      );
    }

    return new AiProviderError(
      this.id,
      'unknown',
      message,
      false,
      error,
    );
  }
}