import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const platforms = ['YouTube', 'TikTok', 'Both'] as const;
const tones = [
  'professional',
  'cinematic',
  'educational',
  'entertaining',
  'inspirational',
] as const;

export class GenerateIdeasDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  topic!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  audience!: string;

  @IsIn(platforms)
  platform!: (typeof platforms)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  count?: number;

  @IsOptional()
  @IsIn(tones)
  tone?: (typeof tones)[number];
}

export class GenerateScriptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  topic!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  audience!: string;

  @IsIn(platforms)
  platform!: (typeof platforms)[number];

  @IsOptional()
  @IsIn(tones)
  tone?: (typeof tones)[number];

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(3600)
  durationSeconds?: number;
}

export class OptimizeContentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30000)
  content!: string;

  @IsIn(platforms)
  platform!: (typeof platforms)[number];
}

export class ReviewContentDto extends OptimizeContentDto {}

export class ProductionPackageDto extends GenerateScriptDto {}