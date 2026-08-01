import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { GenerateNoveltyV2Dto } from '../../v2/dto/generate-novelty-v2.dto';

export class GenerateNoveltyV3Dto extends GenerateNoveltyV2Dto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  priorArtPatterns?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredTransferIndustries?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  maximumTrizPrinciples?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  maximumCrossIndustryTransfers?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  maximumClaims?: number;

  @IsOptional()
  @IsBoolean()
  includeMethodClaims?: boolean;

  @IsOptional()
  @IsBoolean()
  includeSystemClaims?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(3)
  inventionDomain?: string;
}
