import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GenerateNoveltyV3Dto } from '../../v3/dto/generate-novelty-v3.dto';
import type {
  EvidenceType,
  EvidenceVerificationStatus,
} from '../models/novelty-v3-1.models';

export class PatentEvidenceRecordDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @IsIn([
    'user-input',
    'internal-analysis',
    'technical-definition',
    'prototype',
    'experiment',
    'prior-art-document',
    'patent-document',
    'scientific-publication',
    'market-evidence',
    'unknown',
  ])
  type!: EvidenceType;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  publicationNumber?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supports?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contradicts?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  relevance?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  reliability?: number;

  @IsOptional()
  @IsString()
  @IsIn([
    'unverified',
    'partially-verified',
    'verified',
    'rejected',
  ])
  verificationStatus?: EvidenceVerificationStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notes?: string[];
}

export class GenerateNoveltyV31Dto extends GenerateNoveltyV3Dto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatentEvidenceRecordDto)
  evidenceRecords?: PatentEvidenceRecordDto[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  maximumSearchQueries?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minimumEvidenceConfidence?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minimumPriorArtCoverage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minimumClaimSupportCoverage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maximumAllowedUncertainty?: number;
}
