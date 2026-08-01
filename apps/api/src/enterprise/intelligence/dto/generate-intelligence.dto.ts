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

export const INTELLIGENCE_PROVIDERS = [
  'local',
  'openai',
  'mock',
] as const;

export type IntelligenceProviderName =
  (typeof INTELLIGENCE_PROVIDERS)[number];

export class GenerateIntelligenceDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsIn(INTELLIGENCE_PROVIDERS)
  provider?: IntelligenceProviderName;

  @IsOptional()
  @IsString()
  model?: string;

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
  metadata?: Record<string, unknown>;
}
