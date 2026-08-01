import { Injectable } from '@nestjs/common';
import {
  IntelligenceGenerateRequest,
  IntelligenceGenerateResult,
  IntelligenceProvider,
} from '../interfaces/intelligence-provider.interface';

interface OllamaGenerateResponse {
  model?: string;
  response?: string;
  prompt_eval_count?: number;
  eval_count?: number;
}

@Injectable()
export class LocalIntelligenceProvider implements IntelligenceProvider {
  readonly name = 'local' as const;

  private readonly baseUrl =
    process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';

  private readonly defaultModel =
    process.env.OLLAMA_MODEL ?? 'qwen2.5:7b';

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async generate(
    request: IntelligenceGenerateRequest,
  ): Promise<IntelligenceGenerateResult> {
    const startedAt = Date.now();
    const model = request.model ?? this.defaultModel;

    const prompt = request.systemPrompt
      ? `${request.systemPrompt}\n\nUser request:\n${request.prompt}`
      : request.prompt;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(
        Number(process.env.OLLAMA_TIMEOUT_MS ?? 120000),
      ),
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: request.temperature ?? 0.7,
          num_predict: request.maxTokens ?? 1200,
        },
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Ollama request failed (${response.status}): ${rawText}`,
      );
    }

    const data = JSON.parse(rawText) as OllamaGenerateResponse;
    const inputTokens = data.prompt_eval_count ?? 0;
    const outputTokens = data.eval_count ?? 0;

    return {
      success: true,
      provider: this.name,
      model: data.model ?? model,
      content: data.response ?? '',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        estimatedCostUsd: 0,
      },
      durationMs: Date.now() - startedAt,
      fallbackUsed: false,
      warnings: [],
    };
  }
}
