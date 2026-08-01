import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class GenerateStoryboardDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  scriptId!: string;

  @IsOptional()
  @IsString()
  visualStyleOverride?: string;

  @IsOptional()
  @IsString()
  targetImageProvider?: string;

  @IsOptional()
  @IsString()
  targetVideoProvider?: string;

  @IsOptional()
  @IsBoolean()
  includeImagePrompts?: boolean;

  @IsOptional()
  @IsBoolean()
  includeVideoPrompts?: boolean;

  @IsOptional()
  @IsBoolean()
  includeNegativePrompts?: boolean;

  @IsOptional()
  @IsBoolean()
  enforceCharacterConsistency?: boolean;

  @IsOptional()
  @IsBoolean()
  requireHumanApproval?: boolean;
}
