import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { IntelligenceCostGateService } from './intelligence-cost-gate.service';
import {
  IntelligenceGenerateRequest,
  IntelligenceGenerateResult,
  IntelligenceProvider,
  IntelligenceProviderFailure,
  IntelligenceProviderName,
} from './interfaces/intelligence-provider.interface';
import { LocalIntelligenceProvider } from './providers/local-intelligence.provider';
import { MockIntelligenceProvider } from './providers/mock-intelligence.provider';
import { OpenAiIntelligenceProvider } from './providers/openai-intelligence.provider';

@Injectable()
export class IntelligenceRouterService {
  private readonly providers: Map<
    IntelligenceProviderName,
    IntelligenceProvider
  >;

  constructor(
    private readonly localProvider: LocalIntelligenceProvider,
    private readonly openAiProvider: OpenAiIntelligenceProvider,
    private readonly mockProvider: MockIntelligenceProvider,
    private readonly costGate: IntelligenceCostGateService,
  ) {
    this.providers = new Map<
      IntelligenceProviderName,
      IntelligenceProvider
    >([
      ['local', this.localProvider],
      ['openai', this.openAiProvider],
      ['mock', this.mockProvider],
    ]);
  }

  async generate(
    request: IntelligenceGenerateRequest,
  ): Promise<
    IntelligenceGenerateResult & {
      attempts: IntelligenceProviderFailure[];
    }
  > {
    if (!request.prompt?.trim()) {
      throw new BadRequestException('prompt is required');
    }

    const requestedProvider =
      request.provider ?? 'auto';

    const attempts: IntelligenceProviderFailure[] = [];

    const providerOrder: IntelligenceProviderName[] =
      requestedProvider === 'auto'
        ? this.buildAutomaticProviderOrder(request)
        : requestedProvider === 'local'
          ? ['local', 'mock']
          : requestedProvider === 'openai'
            ? ['openai', 'mock']
            : [requestedProvider];

    for (const [index, providerName] of providerOrder.entries()) {
      const provider = this.providers.get(providerName);

      if (!provider) {
        attempts.push({
          provider: providerName,
          code: 'PROVIDER_NOT_REGISTERED',
          message: `Provider ${providerName} is not registered`,
          retryable: false,
        });

        continue;
      }

      if (providerName === 'openai') {
        const permission = this.costGate.canUsePaidProvider(
          request.allowPaidProvider === true,
        );

        if (!permission.allowed) {
          attempts.push({
            provider: 'openai',
            code: 'COST_GATE_BLOCKED',
            message:
              permission.reason ??
              'Paid provider blocked',
            retryable: false,
          });

          continue;
        }
      }

      try {
        const available = await provider.isAvailable();

        if (!available) {
          attempts.push({
            provider: providerName,
            code: 'PROVIDER_UNAVAILABLE',
            message: `${providerName} is unavailable`,
            retryable: true,
          });

          continue;
        }

        const result = await provider.generate(request);

        if (providerName === 'openai') {
          this.costGate.registerPaidUsage(
            result.usage.estimatedCostUsd,
          );
        }

        return {
          ...result,
          fallbackUsed: index > 0,
          attempts,
        };
      } catch (error) {
        attempts.push({
          provider: providerName,
          code: 'PROVIDER_REQUEST_FAILED',
          message:
            error instanceof Error
              ? error.message
              : String(error),
          retryable: true,
        });
      }
    }

    throw new BadGatewayException({
      success: false,
      code: 'ALL_INTELLIGENCE_PROVIDERS_FAILED',
      message:
        'No intelligence provider could complete the request.',
      attempts,
    });
  }

  private buildAutomaticProviderOrder(
    request: IntelligenceGenerateRequest,
  ): IntelligenceProviderName[] {
    const order: IntelligenceProviderName[] = [
      'local',
    ];

    if (request.allowPaidProvider === true) {
      order.push('openai');
    }

    const mockFallbackEnabled =
      String(
        process.env.INTELLIGENCE_MOCK_FALLBACK ??
          'true',
      ).toLowerCase() === 'true';

    if (mockFallbackEnabled) {
      order.push('mock');
    }

    return order;
  }

  async getStatus() {
    const statuses = await Promise.all(
      Array.from(this.providers.entries()).map(
        async ([name, provider]) => ({
          provider: name,
          available: await provider.isAvailable(),
          paid: name === 'openai',
        }),
      ),
    );

    return {
      success: true,
      system: 'CreatorOS Intelligence Engine',
      defaultProviderOrder: [
        'local',
        'openai',
        'mock',
      ],
      providers: statuses,
      costGate: this.costGate.getStatus(),
    };
  }
}

