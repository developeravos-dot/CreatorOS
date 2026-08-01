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

export class NoveltyGenerationThresholdsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  originality?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maximumDuplicateRisk?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  protectability?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commercialValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  technicalFeasibility?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  innovation?: number;
}

export class GenerateNoveltyIdeaDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetUsers?: string[];

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  maximumIterations?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(24)
  candidatesPerIteration?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NoveltyGenerationThresholdsDto)
  thresholds?: NoveltyGenerationThresholdsDto;
}
