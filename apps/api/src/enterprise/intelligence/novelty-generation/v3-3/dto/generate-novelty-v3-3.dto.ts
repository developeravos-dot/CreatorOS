import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { GenerateNoveltyV32Dto } from '../../v3-2/dto/generate-novelty-v3-2.dto';

export class GenerateNoveltyV33Dto extends GenerateNoveltyV32Dto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalTechnicalEffects?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalMechanisms?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maximumGraphDocuments?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maximumSimilarityResults?: number;

  @IsOptional()
  @IsBoolean()
  includeSyntheticDocumentsInGraph?: boolean;

  @IsOptional()
  @IsBoolean()
  executeSearchBeforeReasoning?: boolean;
}
