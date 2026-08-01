import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class NoveltyV2ThresholdsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  structuralNovelty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  mechanismNovelty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ipProtectability?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  dataMoatStrength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commercialValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  feasibility?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maximumDuplicateRisk?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  marketNovelty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  total?: number;
}

export class GenerateNoveltyV2Dto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetUsers?: string[];

  @IsOptional()
  @IsString()
  businessModel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technology?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  differentiators?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  knownCompetitorPatterns?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  maximumIterations?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(6)
  @Max(60)
  populationSize?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(12)
  eliteSize?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NoveltyV2ThresholdsDto)
  thresholds?: NoveltyV2ThresholdsDto;
}

