import { Injectable, OnModuleInit } from '@nestjs/common';
import { HailuoAdapter } from '../../../production-adapters/hailuo/hailuo.adapter';
import {
  ProductionRequest,
  ProductionResult,
  ProductionTask,
  ProductionTaskState,
  ProductionTaskStatus,
} from '../../contracts/production.contracts';
import { ProductionProvider } from '../../contracts/production-provider.interface';
import { ProductionProviderRegistry } from '../../registry/production-provider.registry';

@Injectable()
export class HailuoProductionProvider implements ProductionProvider, OnModuleInit {
  readonly name = 'hailuo';
  readonly capabilities = ['text-to-video', 'task-polling', 'download'] as const;

  constructor(
    private readonly adapter: HailuoAdapter,
    private readonly registry: ProductionProviderRegistry,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  isEnabled(): boolean {
    return String(process.env.PRODUCTION_TOOL_HAILUO_ENABLED ?? 'false').toLowerCase() === 'true';
  }

  isConfigured(): boolean {
    const key = String(process.env.HAILUO_API_KEY ?? '').trim();
    return Boolean(key) && !/PUT_|PLACEHOLDER|ضع_|مفتاح|هنا/i.test(key);
  }

  async isAvailable(): Promise<boolean> {
    const adapter = this.adapter as any;
    if (typeof adapter.status === 'function') {
      const status = await adapter.status();
      return Boolean(status?.available ?? status?.success ?? true);
    }
    if (typeof adapter.getStatusInfo === 'function') {
      const status = await adapter.getStatusInfo();
      return Boolean(status?.available ?? status?.success ?? true);
    }
    return this.isEnabled() && this.isConfigured();
  }

  async generate(request: ProductionRequest): Promise<ProductionTask> {
    const adapter = this.adapter as any;
    const payload = {
      prompt: request.prompt,
      negativePrompt: request.negativePrompt,
      model: request.model || process.env.HAILUO_MODEL,
      duration: request.duration,
      resolution: request.resolution,
      fps: request.fps,
      aspectRatio: request.aspectRatio,
      seed: request.seed,
      promptOptimizer: request.options?.promptOptimizer ?? true,
      ...request.options,
    };

    const response =
      typeof adapter.generate === 'function'
        ? await adapter.generate(payload)
        : typeof adapter.createTask === 'function'
          ? await adapter.createTask(payload)
          : await this.callCombinedGenerate(adapter, payload, request);

    const taskId = this.pickTaskId(response);
    if (!taskId) throw new Error(this.pickError(response) || 'Hailuo returned no task_id.');

    return {
      provider: this.name,
      taskId,
      status: this.mapStatus(response?.status || 'queued'),
      raw: response,
    };
  }

  async getStatus(taskId: string): Promise<ProductionTaskState> {
    const adapter = this.adapter as any;
    const response =
      typeof adapter.getTaskStatus === 'function'
        ? await adapter.getTaskStatus(taskId)
        : typeof adapter.getStatus === 'function'
          ? await adapter.getStatus(taskId)
          : typeof adapter.poll === 'function'
            ? await adapter.poll(taskId)
            : (() => { throw new Error('The installed Hailuo adapter does not expose a status method.'); })();

    return {
      provider: this.name,
      taskId,
      status: this.mapStatus(
        response?.status || response?.task_status || response?.data?.status || response?.data?.task_status,
      ),
      progress: response?.progress ?? response?.data?.progress,
      error: this.pickError(response),
      raw: response,
    };
  }

  async download(taskId: string, filename?: string): Promise<ProductionResult> {
    const adapter = this.adapter as any;
    const response =
      typeof adapter.download === 'function'
        ? await adapter.download(taskId, filename)
        : typeof adapter.downloadResult === 'function'
          ? await adapter.downloadResult(taskId, filename)
          : typeof adapter.downloadTask === 'function'
            ? await adapter.downloadTask(taskId, filename)
            : (() => { throw new Error('The installed Hailuo adapter does not expose a download method.'); })();

    return {
      provider: this.name,
      taskId,
      status: 'succeeded',
      outputPath: response?.outputPath || response?.downloadPath || response?.path || response?.filePath,
      outputUrl: response?.outputUrl || response?.downloadUrl || response?.url || response?.fileUrl,
      filename: response?.filename || filename,
      metadata: { raw: response },
    };
  }

  async cancel(taskId: string): Promise<void> {
    const adapter = this.adapter as any;
    if (typeof adapter.cancel === 'function') return void (await adapter.cancel(taskId));
    if (typeof adapter.cancelTask === 'function') return void (await adapter.cancelTask(taskId));
    throw new Error('Hailuo cancellation is not supported by the adapter.');
  }

  private async callCombinedGenerate(adapter: any, payload: Record<string, unknown>, request: ProductionRequest): Promise<unknown> {
    if (typeof adapter.generateWaitDownload !== 'function') {
      throw new Error('The installed Hailuo adapter exposes no compatible generation method.');
    }
    return adapter.generateWaitDownload(payload, {
      pollingIntervalMs: request.pollingIntervalMs,
      timeoutMs: request.timeoutMs,
      filename: request.filename,
    });
  }

  private pickTaskId(response: any): string {
    return String(response?.taskId || response?.task_id || response?.data?.taskId || response?.data?.task_id || '').trim();
  }

  private pickError(response: any): string | undefined {
    const value = response?.error || response?.message || response?.status_msg || response?.base_resp?.status_msg || response?.data?.error || response?.data?.message;
    return value ? String(value) : undefined;
  }

  private mapStatus(value: unknown): ProductionTaskStatus {
    const status = String(value ?? '').toLowerCase();
    if (['success', 'succeeded', 'completed', 'finished', 'done'].includes(status)) return 'succeeded';
    if (['fail', 'failed', 'error'].includes(status)) return 'failed';
    if (['cancel', 'cancelled', 'canceled'].includes(status)) return 'cancelled';
    if (['queue', 'queued', 'submitted', 'created'].includes(status)) return 'queued';
    if (['processing', 'running', 'in_progress', 'generating'].includes(status)) return 'processing';
    return 'unknown';
  }
}
