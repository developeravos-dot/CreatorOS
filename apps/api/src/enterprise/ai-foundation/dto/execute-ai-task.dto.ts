import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const AI_TASK_TYPES = [
  'idea',
  'research',
  'writing',
  'script',
  'code',
  'analysis',
  'translation',
  'vision',
  'general',
] as const;

export const AI_PROVIDER_OPTIONS = [
  'auto',
  'local',
  'openai',
  'mock',
] as const;

export type AiTaskType =
  (typeof AI_TASK_TYPES)[number];

export type AiProviderOption =
  (typeof AI_PROVIDER_OPTIONS)[number];

export class ExecuteAiTaskDto {
  @IsIn(AI_TASK_TYPES)
  taskType!: AiTaskType;

  @IsString()
  input!: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsIn(AI_PROVIDER_OPTIONS)
  provider?: AiProviderOption;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(32768)
  maxTokens?: number;

  @IsOptional()
  @IsBoolean()
  allowPaidProvider?: boolean;

  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
