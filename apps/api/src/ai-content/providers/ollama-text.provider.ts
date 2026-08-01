import { Injectable } from '@nestjs/common';
import {
  AiProviderError,
  AiProviderHealth,
  AiTextGenerationRequest,
  AiTextGenerationResult,
  AiTextProvider,
} from './ai-provider.contracts';

interface OllamaGenerateResponse {
  model?: string;
  response?: string;
  thinking?: string;
  done?: boolean;
}

@Injectable()
export class OllamaTextProvider implements AiTextProvider {
  readonly id = 'ollama';

  private readonly baseUrl =
    process.env.OLLAMA_BASE_URL?.trim() || 'http://127.0.0.1:11434';

  private readonly model =
    process.env.OLLAMA_MODEL?.trim() || 'qwen2.5:7b';

  isConfigured(): boolean {
    return process.env.OLLAMA_ENABLED?.trim().toLowerCase() !== 'false';
  }

  async healthCheck(): Promise<AiProviderHealth> {
    if (!this.isConfigured()) {
      return {
        id: this.id,
        configured: false,
        available: false,
        model: this.model,
        reason: 'OLLAMA_ENABLED=false',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2500),
      });

      return {
        id: this.id,
        configured: true,
        available: response.ok,
        model: this.model,
        reason: response.ok ? undefined : `Ollama health returned ${response.status}.`,
      };
    } catch (error) {
      return {
        id: this.id,
        configured: true,
        available: false,
        model: this.model,
        reason: error instanceof Error ? error.message : 'Ollama is unavailable.',
      };
    }
  }

  async generateJson<T extends Record<string, unknown>>(
    request: AiTextGenerationRequest,
  ): Promise<AiTextGenerationResult<T>> {
    if (!this.isConfigured()) {
      throw new AiProviderError(
        this.id,
        'not_configured',
        'Ollama provider is disabled.',
        true,
      );
    }

    const startedAt = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          stream: false,
          think: false,
          format: 'json',
          prompt: [
            request.systemInstruction,
            request.task,
            request.prompt,
            'Return valid JSON only. Do not use Markdown.',
          ].join('\n\n'),
        }),
        signal: AbortSignal.timeout(
          Number(process.env.OLLAMA_TIMEOUT_MS || 120000),
        ),
      });

      if (!response.ok) {
        throw new AiProviderError(
          this.id,
          response.status === 404 ? 'not_configured' : 'unavailable',
          `Ollama returned HTTP ${response.status}.`,
          true,
        );
      }

      const payload = (await response.json()) as OllamaGenerateResponse;
      const outputText =
        payload.response?.trim() ||
        payload.thinking?.trim();

      if (!outputText) {
        throw new AiProviderError(
          this.id,
          'invalid_response',
          'Ollama returned an empty response.',
          true,
        );
      }

      return {
        providerId: this.id,
        model: payload.model || this.model,
        output: this.parseJson<T>(outputText),
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      if (error instanceof AiProviderError) {
        throw error;
      }

      throw new AiProviderError(
        this.id,
        'unavailable',
        error instanceof Error ? error.message : 'Ollama is unavailable.',
        true,
        error,
      );
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
        'Ollama response was not valid JSON.',
        true,
      );
    }
  }
}