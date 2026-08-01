import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class UniverseLanguageDto {
  @IsString()
  @MinLength(2)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsBoolean()
  primary!: boolean;

  @IsIn([
    'translation',
    'cultural-adaptation',
    'native-reproduction',
  ])
  localizationMode!:
    | 'translation'
    | 'cultural-adaptation'
    | 'native-reproduction';
}

export class CreateWorldDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsIn([
    'kids',
    'junior',
    'teen',
    'adult',
    'family',
  ])
  audienceTier!:
    | 'kids'
    | 'junior'
    | 'teen'
    | 'adult'
    | 'family';

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @IsIn(
    [
      'adventure',
      'fantasy',
      'science-fiction',
      'mystery',
      'comedy',
      'education',
      'psychological',
      'hybrid',
    ],
    { each: true },
  )
  genres!: Array<
    | 'adventure'
    | 'fantasy'
    | 'science-fiction'
    | 'mystery'
    | 'comedy'
    | 'education'
    | 'psychological'
    | 'hybrid'
  >;

  @IsString()
  @MinLength(20)
  premise!: string;

  @IsString()
  @MinLength(3)
  visualStyle!: string;

  @IsString()
  @MinLength(3)
  narrativeTone!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  technologyLevel!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  fantasyLevel!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  realismLevel!: number;

  @IsOptional()
  @IsBoolean()
  agingEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  deathPermanent?: boolean;

  @IsOptional()
  @IsBoolean()
  timeTravelEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  artificialIntelligenceEnabled?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => UniverseLanguageDto)
  languages!: UniverseLanguageDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  requiredPsychologicalThemes?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  forbiddenThemes?: string[];
}
