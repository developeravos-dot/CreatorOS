import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class GenerateVisualReferenceBibleDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  storyboardId!: string;

  @IsOptional()
  @IsString()
  visualStyleOverride?: string;

  @IsOptional()
  @IsBoolean()
  includeExpressionSheets?: boolean;

  @IsOptional()
  @IsBoolean()
  includePoseSheets?: boolean;

  @IsOptional()
  @IsBoolean()
  includeEnvironmentVariants?: boolean;

  @IsOptional()
  @IsBoolean()
  includePropSheets?: boolean;

  @IsOptional()
  @IsBoolean()
  requireHumanApproval?: boolean;
}
