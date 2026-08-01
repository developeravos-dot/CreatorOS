import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ValidateVisualConsistencyDto {
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
  providerId!: string;

  @IsString()
  @MinLength(10)
  prompt!: string;

  @IsString()
  negativePrompt!: string;

  @IsOptional()
  @IsString()
  outputAssetId?: string;

  @IsOptional()
  @IsString()
  outputLocation?: string;

  @IsOptional()
  @IsString()
  identityDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  proportions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  signatureElements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  continuityKeys?: string[];
}
