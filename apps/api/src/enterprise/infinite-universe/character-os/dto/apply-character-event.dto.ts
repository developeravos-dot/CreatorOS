import { Type } from 'class-transformer';

import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class ApplyCharacterEventDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  characterId!: string;

  @IsString()
  @MinLength(3)
  eventTitle!: string;

  @IsString()
  @MinLength(10)
  eventDescription!: string;

  @IsIn([
    'event',
    'relationship',
    'promise',
    'success',
    'failure',
    'fear',
    'betrayal',
    'discovery',
    'lesson',
  ])
  memoryType!:
    | 'event'
    | 'relationship'
    | 'promise'
    | 'success'
    | 'failure'
    | 'fear'
    | 'betrayal'
    | 'discovery'
    | 'lesson';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  worldYear!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  episodeNumber?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  emotionalImpact!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  importance!: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  affectedTraits?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  involvedCharacterIds?: string[];

  @IsOptional()
  @IsString()
  relationshipTargetCharacterId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  trustDelta?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  affectionDelta?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  rivalryDelta?: number;
}
