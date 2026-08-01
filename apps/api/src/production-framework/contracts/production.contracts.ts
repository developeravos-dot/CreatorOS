export type ProductionMediaType = 'video' | 'image' | 'audio';

export interface ProductionRequest {
  prompt: string;
  negativePrompt?: string;
  mediaType?: ProductionMediaType;
  model?: string;
  duration?: number;
  resolution?: string;
  fps?: number;
  aspectRatio?: string;
  seed?: number;
  images?: string[];
  videos?: string[];
  provider?: string;
  filename?: string;
  pollingIntervalMs?: number;
  timeoutMs?: number;
  options?: Record<string, unknown>;
}

export interface ProductionTask {
  provider: string;
  taskId: string;
  status: ProductionTaskStatus;
  raw?: unknown;
}

export type ProductionTaskStatus =
  | 'queued'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'unknown';

export interface ProductionTaskState {
  provider: string;
  taskId: string;
  status: ProductionTaskStatus;
  progress?: number;
  error?: string;
  raw?: unknown;
}

export interface ProductionResult {
  provider: string;
  taskId: string;
  status: 'succeeded';
  outputPath?: string;
  outputUrl?: string;
  filename?: string;
  metadata: Record<string, unknown>;
}

export interface ProductionExecutionOptions {
  provider?: string;
  fallbackProviders?: string[];
  waitForCompletion?: boolean;
  download?: boolean;
}
