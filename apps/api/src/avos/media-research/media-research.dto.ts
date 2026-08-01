import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMediaResearchDto {
  @IsString()
  projectId!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  summary!: string;

  @IsIn([
    'market',
    'trend',
    'competitor',
    'audience',
    'topic',
    'technology',
    'platform',
    'other',
  ])
  researchType!: string;

  @IsIn([
    'original',
    'manual',
    'public-source',
    'research-inspired',
    'api',
    'other',
  ])
  sourceMode!: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  sourceUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  findings!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;
}

export class CreateMediaTrendDto {
  @IsString()
  projectId!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn([
    'youtube',
    'tiktok',
    'instagram',
    'facebook',
    'x',
    'web',
    'other',
  ])
  platform!: string;

  @IsOptional()
  @IsString()
  market?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  growthScore!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  opportunityScore!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  competitionScore!: number;
}

export class CreateMediaCompetitorDto {
  @IsString()
  projectId!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsIn([
    'youtube',
    'tiktok',
    'instagram',
    'facebook',
    'x',
    'web',
    'other',
  ])
  platform!: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  channelUrl?: string;

  @IsOptional()
  @IsString()
  market?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  niche?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weaknesses?: string[];

  @IsOptional()
  @IsString()
  publishingNotes?: string;
}

export class CreateMediaAudienceProfileDto {
  @IsString()
  projectId!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  market?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  ageRange?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  interests!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  painPoints!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  searchIntents!: string[];
}

export class CreateMediaOpportunityDto {
  @IsString()
  projectId!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  summary!: string;

  @IsIn([
    'content',
    'channel',
    'market',
    'trend',
    'partnership',
    'product',
    'licensing',
    'other',
  ])
  opportunityType!: string;

  @IsOptional()
  @IsString()
  market?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  demandScore!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  competitionScore!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  executionScore!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  revenueScore!: number;

  @IsOptional()
  @IsString()
  rationale?: string;
}
