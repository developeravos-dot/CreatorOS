import {
  IsIn,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class RunProviderMigrationTestDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  bibleId!: string;

  @IsIn([
    'character',
    'environment',
    'prop',
  ])
  entityType!:
    | 'character'
    | 'environment'
    | 'prop';

  @IsString()
  @MinLength(1)
  entityId!: string;

  @IsString()
  @MinLength(1)
  currentProviderId!: string;

  @IsString()
  @MinLength(1)
  candidateProviderId!: string;

  @IsIn([
    'character-reference',
    'character-expression',
    'character-pose',
    'environment-reference',
    'prop-reference',
    'storyboard-frame',
  ])
  workload!:
    | 'character-reference'
    | 'character-expression'
    | 'character-pose'
    | 'environment-reference'
    | 'prop-reference'
    | 'storyboard-frame';

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  identityScore!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  colorScore!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  proportionScore!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  signatureElementScore!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  styleScore!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  continuityScore!: number;
}
