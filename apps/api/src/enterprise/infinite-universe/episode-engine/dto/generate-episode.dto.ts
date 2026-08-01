import { Type } from 'class-transformer';

import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class GenerateEpisodeDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  episodeNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  targetDurationMinutes?: number;

  @IsOptional()
  @IsIn([
    'wonder',
    'mystery',
    'adventure',
    'emotional',
    'comedy',
    'tension',
    'discovery',
    'hybrid',
  ])
  preferredTone?:
    | 'wonder'
    | 'mystery'
    | 'adventure'
    | 'emotional'
    | 'comedy'
    | 'tension'
    | 'discovery'
    | 'hybrid';

  @IsOptional()
  @IsString()
  preferredStoryThread?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  requiredCharacterIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  excludedCharacterIds?: string[];

  @IsOptional()
  @IsBoolean()
  allowNewMystery?: boolean;

  @IsOptional()
  @IsBoolean()
  allowThreadResolution?: boolean;

  @IsOptional()
  @IsBoolean()
  requireCliffhanger?: boolean;
}
