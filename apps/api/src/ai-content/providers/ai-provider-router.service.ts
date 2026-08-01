import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  AiProviderError,
  AiProviderHealth,
  AiTextGenerationRequest,
  AiTextGenerationResult,
} from './ai-provider.contracts';
import { AiProviderRegistryService } from './ai-provider-registry.service';

interface ProviderAttempt {
  providerId: string;
  code: string;
  message: string;
}

@Injectable()
export class AiProviderRouterService {
  constructor(
    private readonly registry: AiProviderRegistryService,
  ) {}

  async generateJson<T extends Record<string, unknown>>(
    request: AiTextGenerationRequest,
  ): Promise<AiTextGenerationResult<T>> {
    const providerIds = this.resolveProviderOrder();
    const attempts: ProviderAttempt[] = [];

    for (const providerId of providerIds) {
      const provider = this.registry.get(providerId);

      if (!provider) {
        attempts.push({
          providerId,
          code: 'not_registered',
          message: `Provider "${providerId}" is not registered.`,
        });
        continue;
      }

      if (!provider.isConfigured()) {
        attempts.push({
          providerId,
          code: 'not_configured',
          message: `Provider "${providerId}" is not configured.`,
        });
        continue;
      }

      try {
        return await provider.generateJson<T>(request);
      } catch (error) {
        const mapped = this.asProviderError(providerId, error);
        attempts.push({
          providerId,
          code: mapped.code,
          message: mapped.message,
        });

        if (!this.allowFallback() || !mapped.retryable) {
          throw this.toHttpException(mapped, attempts);
        }
      }
    }

    throw new ServiceUnavailableException({
      success: false,
      message: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø²ÙˆØ¯ Ø°ÙƒØ§Ø¡ Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ù…ØªØ§Ø­ Ù„ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨.',
      attempts,
    });
  }

  status() {
    const order = this.resolveProviderOrder();

    return {
      primaryProvider: order[0] ?? null,
      fallbackProviders: order.slice(1),
      fallbackEnabled: this.allowFallback(),
      registeredProviders: this.registry.list().map((provider) => ({
        id: provider.id,
        configured: provider.isConfigured(),
      })),
    };
  }

  async health(): Promise<AiProviderHealth[]> {
    return Promise.all(
      this.registry.list().map((provider) => provider.healthCheck()),
    );
  }

  private resolveProviderOrder(): string[] {
    const primary =
      process.env.AI_PRIMARY_PROVIDER?.trim().toLowerCase() || 'openai';

    const fallbacks = (
      process.env.AI_FALLBACK_PROVIDERS || 'ollama'
    )
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    return [...new Set([primary, ...fallbacks])];
  }

  private allowFallback(): boolean {
    return process.env.AI_ALLOW_FALLBACK?.trim().toLowerCase() !== 'false';
  }

  private asProviderError(
    providerId: string,
    error: unknown,
  ): AiProviderError {
    if (error instanceof AiProviderError) {
      return error;
    }

    return new AiProviderError(
      providerId,
      'unknown',
      error instanceof Error ? error.message : 'Unknown AI provider error.',
      false,
      error,
    );
  }

  private toHttpException(
    error: AiProviderError,
    attempts: ProviderAttempt[],
  ) {
    const body = {
      success: false,
      message: 'ÙØ´Ù„ Ù…Ø­Ø±Ùƒ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙÙŠ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙˆÙ‰.',
      provider: error.providerId,
      errorCode: error.code,
      details: error.message,
      attempts,
    };

    if (
      error.code === 'not_configured' ||
      error.code === 'quota_exhausted' ||
      error.code === 'rate_limited' ||
      error.code === 'unavailable'
    ) {
      return new ServiceUnavailableException(body);
    }

    return new InternalServerErrorException(body);
  }
}