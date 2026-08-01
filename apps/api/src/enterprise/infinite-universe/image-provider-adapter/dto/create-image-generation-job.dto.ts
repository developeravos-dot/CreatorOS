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

import { Type } from 'class-transformer';

export class CreateImageGenerationJobDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  bibleId!: string;

  @IsOptional()
  @IsString()
  storyboardId?: string;

  @IsIn([
    'manual-export',
    'mock-image',
    'openai-image',
  ])
  providerId!:
    | 'manual-export'
    | 'mock-image'
    | 'openai-image';

  @IsArray()
  @ArrayMaxSize(6)
  @IsIn(
    [
      'character-reference',
      'character-expression',
      'character-pose',
      'environment-reference',
      'prop-reference',
      'storyboard-frame',
    ],
    { each: true },
  )
  categories!: Array<
    | 'character-reference'
    | 'character-expression'
    | 'character-pose'
    | 'environment-reference'
    | 'prop-reference'
    | 'storyboard-frame'
  >;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(256)
  @Max(4096)
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(256)
  @Max(4096)
  height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  imageCountPerRequest?: number;

  @IsOptional()
  @IsBoolean()
  requireHumanApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  allowStoryboardBeforeReferenceApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  enforceProviderLocks?: boolean;

  @IsOptional()
  @IsBoolean()
  allowFallbackProvider?: boolean;

  @IsOptional()
  @IsBoolean()
  allowMixedProvidersWithinJob?: boolean;
}

