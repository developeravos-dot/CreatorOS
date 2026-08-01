import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ProductionExecutionOptions,
  ProductionRequest,
  ProductionResult,
  ProductionTask,
  ProductionTaskState,
} from '../contracts/production.contracts';
import { ProductionProvider } from '../contracts/production-provider.interface';
import { ProductionProviderRegistry } from '../registry/production-provider.registry';

@Injectable()
export class ProductionOrchestratorService {
  private readonly logger = new Logger(ProductionOrchestratorService.name);

  constructor(private readonly registry: ProductionProviderRegistry) {}

  async providers() {
    const providers = await Promise.all(
      this.registry.list().map(async (provider) => ({
        name: provider.name,
        capabilities: provider.capabilities,
        enabled: provider.isEnabled(),
        configured: provider.isConfigured(),
        available:
          provider.isEnabled() && provider.isConfigured()
            ? await provider.isAvailable().catch(() => false)
            : false,
      })),
    );

    return { success: true, providers };
  }

  async generate(
    request: ProductionRequest,
    execution: ProductionExecutionOptions = {},
  ): Promise<ProductionTask | ProductionResult> {
    if (!request?.prompt?.trim()) throw new BadRequestException('prompt is required');

    const candidates = this.resolveCandidates(request, execution);
    if (candidates.length === 0) {
      throw new ServiceUnavailableException('No production provider is registered.');
    }

    const failures: Array<{ provider: string; message: string }> = [];

    for (const provider of candidates) {
      try {
        this.assertUsable(provider);
        if (!(await provider.isAvailable())) throw new Error('provider is unavailable');

        const task = await provider.generate(request);
        if (!execution.waitForCompletion) return task;

        const state = await this.waitForCompletion(provider, task, request);
        if (state.status !== 'succeeded') {
          throw new Error(state.error || `task ended with ${state.status}`);
        }

        if (execution.download === false) {
          return { ...task, status: 'succeeded', raw: state.raw };
        }

        return await provider.download(task.taskId, request.filename);
      } catch (error) {
        const message = this.errorMessage(error);
        failures.push({ provider: provider.name, message });
        this.logger.warn(`${provider.name} failed: ${message}`);
      }
    }

    throw new BadGatewayException({ message: 'All production providers failed.', failures });
  }

  async status(providerName: string, taskId: string): Promise<ProductionTaskState> {
    return this.registry.require(providerName).getStatus(taskId);
  }

  async download(providerName: string, taskId: string, filename?: string): Promise<ProductionResult> {
    return this.registry.require(providerName).download(taskId, filename);
  }

  async cancel(providerName: string, taskId: string): Promise<void> {
    const provider = this.registry.require(providerName);
    if (!provider.cancel) {
      throw new BadRequestException(`Provider "${provider.name}" does not support cancellation.`);
    }
    await provider.cancel(taskId);
  }

  private resolveCandidates(
    request: ProductionRequest,
    execution: ProductionExecutionOptions,
  ): ProductionProvider[] {
    const primary = execution.provider || request.provider || process.env.PRODUCTION_PRIMARY_PROVIDER || 'hailuo';
    const configuredFallbacks =
      execution.fallbackProviders ||
      (process.env.PRODUCTION_FALLBACK_PROVIDERS || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    return [...new Set([primary, ...configuredFallbacks])]
      .map((name) => this.registry.get(name))
      .filter((provider): provider is ProductionProvider => Boolean(provider));
  }

  private assertUsable(provider: ProductionProvider): void {
    if (!provider.isEnabled()) throw new Error('provider is disabled');
    if (!provider.isConfigured()) throw new Error('provider is not configured');
  }

  private async waitForCompletion(
    provider: ProductionProvider,
    task: ProductionTask,
    request: ProductionRequest,
  ): Promise<ProductionTaskState> {
    const interval = Math.max(1000, request.pollingIntervalMs || Number(process.env.PRODUCTION_POLL_INTERVAL_MS) || 10000);
    const timeout = Math.max(interval, request.timeoutMs || Number(process.env.PRODUCTION_TIMEOUT_MS) || 900000);
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      const state = await provider.getStatus(task.taskId);
      if (['succeeded', 'failed', 'cancelled'].includes(state.status)) return state;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Production task timed out after ${timeout}ms.`);
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
