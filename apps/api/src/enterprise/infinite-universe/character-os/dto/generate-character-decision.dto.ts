import { Type } from 'class-transformer';

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CharacterDecisionOptionDto {
  @IsString()
  @MinLength(1)
  optionId!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  risk!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  moralCost!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-100)
  @Max(100)
  relationshipImpact!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  goalAlignment!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  fearActivation!: number;
}

export class GenerateCharacterDecisionDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  characterId!: string;

  @IsString()
  @MinLength(10)
  situation!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CharacterDecisionOptionDto)
  options!: CharacterDecisionOptionDto[];
}
