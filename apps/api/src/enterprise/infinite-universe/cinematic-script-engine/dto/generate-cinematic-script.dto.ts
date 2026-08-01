import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class GenerateCinematicScriptDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  episodeId!: string;

  @IsOptional()
  @IsString()
  sourceLanguageCode?: string;

  @IsOptional()
  @IsBoolean()
  includeCameraDirections?: boolean;

  @IsOptional()
  @IsBoolean()
  includeLightingDirections?: boolean;

  @IsOptional()
  @IsBoolean()
  includeSoundDirections?: boolean;

  @IsOptional()
  @IsBoolean()
  includeSubtext?: boolean;

  @IsOptional()
  @IsBoolean()
  enforceAudienceSafety?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  localizationLanguageCodes?: string[];
}
