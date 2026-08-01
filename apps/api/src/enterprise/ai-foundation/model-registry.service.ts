import { Injectable } from '@nestjs/common';
import { AiTaskType } from './dto/execute-ai-task.dto';

export interface CreatorOsAiModel {
  id: string;
  provider: 'local' | 'openai';
  name: string;
  taskTypes: AiTaskType[];
  paid: boolean;
  enabled: boolean;
  priority: number;
  capabilities: string[];
}

@Injectable()
export class ModelRegistryService {
  private readonly models: CreatorOsAiModel[] = [
    {
      id: 'local-qwen-2-5-7b',
      provider: 'local',
      name: process.env.OLLAMA_MODEL ?? 'qwen2.5:7b',
      taskTypes: [
        'idea',
        'research',
        'writing',
        'script',
        'code',
        'analysis',
        'translation',
        'general',
      ],
      paid: false,
      enabled: true,
      priority: 100,
      capabilities: [
        'text-generation',
        'reasoning',
        'writing',
        'coding',
        'translation',
      ],
    },
    {
      id: 'local-qwen-vision',
      provider: 'local',
      name: process.env.OLLAMA_VISION_MODEL ?? 'qwen2.5vl:latest',
      taskTypes: ['vision'],
      paid: false,
      enabled: true,
      priority: 100,
      capabilities: [
        'vision',
        'image-understanding',
        'text-generation',
      ],
    },
    {
      id: 'openai-default',
      provider: 'openai',
      name: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      taskTypes: [
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
      paid: true,
      enabled:
        String(process.env.INTELLIGENCE_OPENAI_ENABLED ?? 'false')
          .toLowerCase() === 'true',
      priority: 50,
      capabilities: [
        'text-generation',
        'reasoning',
        'coding',
        'vision',
      ],
    },
  ];

  listModels(): CreatorOsAiModel[] {
    return this.models.map((model) => ({ ...model }));
  }

  getModel(id: string): CreatorOsAiModel | undefined {
    return this.models.find((model) => model.id === id);
  }

  selectModel(
    taskType: AiTaskType,
    allowPaidProvider: boolean,
  ): CreatorOsAiModel {
    const available = this.models
      .filter((model) => model.enabled)
      .filter((model) => model.taskTypes.includes(taskType))
      .filter((model) => allowPaidProvider || !model.paid)
      .sort((a, b) => b.priority - a.priority);

    return (
      available[0] ?? {
        id: 'local-fallback',
        provider: 'local',
        name: process.env.OLLAMA_MODEL ?? 'qwen2.5:7b',
        taskTypes: ['general'],
        paid: false,
        enabled: true,
        priority: 1,
        capabilities: ['text-generation'],
      }
    );
  }

  getStatus() {
    return {
      success: true,
      totalModels: this.models.length,
      enabledModels: this.models.filter(
        (model) => model.enabled,
      ).length,
      localModels: this.models.filter(
        (model) => model.provider === 'local',
      ).length,
      paidModels: this.models.filter(
        (model) => model.paid,
      ).length,
      models: this.listModels(),
    };
  }
}
