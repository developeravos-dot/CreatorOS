import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
import { KnowledgeConfidenceLevel, KnowledgeInsightStatus, KnowledgeSourceType, RecordStatus } from '../../../../generated/prisma/enums';

export class CreateKnowledgeSourceDto {
  @IsString() sourceKey!: string;
  @IsString() name!: string;
  @IsEnum(KnowledgeSourceType) type!: KnowledgeSourceType;
  @IsOptional() @IsUrl({ require_tld: false }) uri?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateKnowledgeSourceDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(KnowledgeSourceType) type?: KnowledgeSourceType;
  @IsOptional() @IsUrl({ require_tld: false }) uri?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @IsOptional() @IsEnum(RecordStatus) status?: RecordStatus;
}

export class CreateKnowledgeEvidenceDto {
  @IsString() nodeId!: string;
  @IsString() sourceId!: string;
  @IsString() claim!: string;
  @IsEnum(KnowledgeConfidenceLevel) confidence!: KnowledgeConfidenceLevel;
  @IsNumber() @Min(0) @Max(1) score!: number;
  @IsOptional() @IsObject() context?: Record<string, unknown>;
  @IsOptional() @IsString() observedAt?: string;
}

export class CreateKnowledgeInsightDto {
  @IsString() insightKey!: string;
  @IsString() title!: string;
  @IsString() summary!: string;
  @IsString() category!: string;
  @IsEnum(KnowledgeConfidenceLevel) confidence!: KnowledgeConfidenceLevel;
  @IsNumber() @Min(0) @Max(1) score!: number;
  @IsOptional() @IsString() nodeId?: string;
  @IsOptional() @IsArray() evidenceIds?: string[];
  @IsOptional() @IsArray() recommendations?: unknown[];
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class TransitionKnowledgeInsightDto {
  @IsEnum(KnowledgeInsightStatus) status!: KnowledgeInsightStatus;
  @IsOptional() @IsString() reviewNote?: string;
}

export class KnowledgeGraphQueryDto {
  @IsOptional() @IsString() query?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsInt() @Min(1) @Max(200) limit?: number;
  @IsOptional() @IsBoolean() includeInactive?: boolean;
}
