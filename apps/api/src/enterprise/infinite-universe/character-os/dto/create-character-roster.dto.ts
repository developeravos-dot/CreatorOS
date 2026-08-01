import { Type } from 'class-transformer';

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CharacterLanguageDto {
  @IsString()
  @MinLength(2)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsIn([
    'translation',
    'cultural-adaptation',
    'native-reproduction',
  ])
  adaptationMode!:
    | 'translation'
    | 'cultural-adaptation'
    | 'native-reproduction';
}

class CharacterBlueprintDto {
  @IsString()
  @MinLength(2)
  canonicalName!: string;

  @IsIn([
    'protagonist',
    'co-protagonist',
    'mentor',
    'friend',
    'rival',
    'antagonist',
    'supporting',
    'recurring',
    'temporary',
  ])
  role!:
    | 'protagonist'
    | 'co-protagonist'
    | 'mentor'
    | 'friend'
    | 'rival'
    | 'antagonist'
    | 'supporting'
    | 'recurring'
    | 'temporary';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  age!: number;

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  genderIdentity?: string;

  @IsString()
  @MinLength(20)
  biography!: string;

  @IsString()
  @MinLength(10)
  visualDescription!: string;

  @IsString()
  @MinLength(2)
  originLocation!: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsString()
  @MinLength(3)
  personalityArchetype!: string;

  @IsOptional()
  @IsIn([
    'secure',
    'anxious',
    'avoidant',
    'mixed',
  ])
  attachmentStyle?:
    | 'secure'
    | 'anxious'
    | 'avoidant'
    | 'mixed';

  @IsOptional()
  @IsIn([
    'analytical',
    'emotional',
    'impulsive',
    'collaborative',
    'cautious',
    'adaptive',
  ])
  decisionStyle?:
    | 'analytical'
    | 'emotional'
    | 'impulsive'
    | 'collaborative'
    | 'cautious'
    | 'adaptive';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  values!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  skills!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  weaknesses!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  goals!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  fears!: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  secrets?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  signatureElements?: string[];
}

export class CreateCharacterRosterDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

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
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => CharacterLanguageDto)
  languages!: CharacterLanguageDto[];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CharacterBlueprintDto)
  characters!: CharacterBlueprintDto[];
}
