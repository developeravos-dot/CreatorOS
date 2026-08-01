import {
  ProductionRequest,
  ProductionResult,
  ProductionTask,
  ProductionTaskState,
} from './production.contracts';

export interface ProductionProvider {
  readonly name: string;
  readonly capabilities: readonly string[];

  isEnabled(): boolean;
  isConfigured(): boolean;
  isAvailable(): Promise<boolean>;

  generate(request: ProductionRequest): Promise<ProductionTask>;
  getStatus(taskId: string): Promise<ProductionTaskState>;
  download(taskId: string, filename?: string): Promise<ProductionResult>;
  cancel?(taskId: string): Promise<void>;
}
