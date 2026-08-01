import { Injectable } from '@nestjs/common';
import {
  IntelligenceGenerateRequest,
  IntelligenceGenerateResult,
  IntelligenceProvider,
} from '../interfaces/intelligence-provider.interface';

interface OpenAiResponse {
  model?: string;
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
}

@Injectable()
export class OpenAiIntelligenceProvider implements IntelligenceProvider {
  readonly name = 'openai' as const;

  async isAvailable(): Promise<boolean> {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async generate(
    request: IntelligenceGenerateRequest,
  ): Promise<IntelligenceGenerateResult> {
    const startedAt = Date.now();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const model =
      request.model ??
      process.env.OPENAI_MODEL ??
      'gpt-5-mini';

    const input = request.systemPrompt
      ? [
          {
            role: 'system',
            content: request.systemPrompt,
          },
          {
            role: 'user',
            content: request.prompt,
          },
        ]
      : request.prompt;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(
        Number(process.env.OPENAI_TIMEOUT_MS ?? 120000),
      ),
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: request.maxTokens ?? 1200,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(
        `OpenAI request failed (${response.status}): ${rawText}`,
      );
    }

    const data = JSON.parse(rawText) as OpenAiResponse;

    const extractedText =
      data.output_text ??
      data.output
        ?.flatMap((item) => item.content ?? [])
        .map((item) => item.text ?? '')
        .filter(Boolean)
        .join('\n') ??
      '';

    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;
    const totalTokens =
      data.usage?.total_tokens ?? inputTokens + outputTokens;

    const estimatedCostUsd = Number(
      (
        inputTokens * 0.00000025 +
        outputTokens * 0.000002
      ).toFixed(6),
    );

    return {
      success: true,
      provider: this.name,
      model: data.model ?? model,
      content: extractedText,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd,
      },
      durationMs: Date.now() - startedAt,
      fallbackUsed: false,
      warnings: [
        'Estimated cost is approximate and must not be treated as billing data.',
      ],
    };
  }
}
