import { Injectable } from '@nestjs/common';
import {
  AiProviderOption,
  AiTaskType,
} from './dto/execute-ai-task.dto';
import {
  CreatorOsAiModel,
  ModelRegistryService,
} from './model-registry.service';

export interface AiTaskRoute {
  taskType: AiTaskType;
  provider: AiProviderOption;
  model: string;
  selectedModel: CreatorOsAiModel;
  temperature: number;
  maxTokens: number;
  allowPaidProvider: boolean;
}

@Injectable()
export class TaskRouterService {
  constructor(
    private readonly registry: ModelRegistryService,
  ) {}

  route(input: {
    taskType: AiTaskType;
    provider?: AiProviderOption;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    allowPaidProvider?: boolean;
  }): AiTaskRoute {
    const allowPaidProvider =
      input.allowPaidProvider === true;

    const selectedModel = this.registry.selectModel(
      input.taskType,
      allowPaidProvider,
    );

    const taskDefaults = this.getTaskDefaults(
      input.taskType,
    );

    return {
      taskType: input.taskType,
      provider:
        input.provider ??
        selectedModel.provider,
      model:
        input.model ??
        selectedModel.name,
      selectedModel,
      temperature:
        input.temperature ??
        taskDefaults.temperature,
      maxTokens:
        input.maxTokens ??
        taskDefaults.maxTokens,
      allowPaidProvider,
    };
  }

  private getTaskDefaults(taskType: AiTaskType) {
    switch (taskType) {
      case 'idea':
        return {
          temperature: 0.9,
          maxTokens: 1400,
        };

      case 'writing':
      case 'script':
        return {
          temperature: 0.8,
          maxTokens: 2200,
        };

      case 'code':
      case 'analysis':
      case 'research':
        return {
          temperature: 0.3,
          maxTokens: 2400,
        };

      case 'translation':
        return {
          temperature: 0.2,
          maxTokens: 1800,
        };

      case 'vision':
        return {
          temperature: 0.4,
          maxTokens: 1600,
        };

      default:
        return {
          temperature: 0.7,
          maxTokens: 1200,
        };
    }
  }

  getStatus() {
    return {
      success: true,
      strategy:
        'task-aware-model-routing',
      supportedTaskTypes: [
        'idea',
        'research',
        'writing',
        'script',
        'code',
        'analysis',
        'translation',
        'vision',
        'general',
      ],
      defaultPolicy:
        'local-first-paid-provider-by-explicit-permission',
    };
  }
}
