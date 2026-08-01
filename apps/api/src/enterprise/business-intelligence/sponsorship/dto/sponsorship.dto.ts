import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SponsorshipAudienceProfileDto {
  @IsArray()
  @IsString({ each: true })
  countries!: string[];

  @IsArray()
  @IsString({ each: true })
  languages!: string[];

  @IsArray()
  @IsString({ each: true })
  ageRanges!: string[];

  @IsArray()
  @IsString({ each: true })
  interests!: string[];

  @IsNumber()
  @Min(0)
  estimatedReach!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  engagementRate!: number;
}

export class AnalyzeChannelDto {
  @IsString()
  channelId!: string;

  @IsString()
  channelName!: string;

  @IsArray()
  @IsString({ each: true })
  platforms!: string[];

  @IsArray()
  @IsString({ each: true })
  categories!: string[];

  @ValidateNested()
  @Type(() => SponsorshipAudienceProfileDto)
  audience!: SponsorshipAudienceProfileDto;

  @IsNumber()
  @Min(0)
  averageViews!: number;

  @IsNumber()
  @Min(0)
  publishingFrequencyPerMonth!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  brandSafetyScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  contentQualityScore!: number;
}

export class SponsorProfileDto {
  @IsString()
  sponsorId!: string;

  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsArray()
  @IsString({ each: true })
  industries!: string[];

  @IsArray()
  @IsString({ each: true })
  targetCountries!: string[];

  @IsArray()
  @IsString({ each: true })
  targetLanguages!: string[];

  @IsArray()
  @IsString({ each: true })
  targetAgeRanges!: string[];

  @IsArray()
  @IsString({ each: true })
  targetInterests!: string[];

  @IsArray()
  @IsString({ each: true })
  preferredPlatforms!: string[];

  @IsArray()
  @IsString({ each: true })
  preferredContentCategories!: string[];

  @IsNumber()
  @Min(0)
  estimatedBudgetMin!: number;

  @IsNumber()
  @Min(0)
  estimatedBudgetMax!: number;

  @IsString()
  currency!: string;

  @IsArray()
  @IsString({ each: true })
  brandSafetyRequirements!: string[];

  @IsArray()
  @IsString({ each: true })
  prohibitedTopics!: string[];

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class DiscoverSponsorshipsDto {
  @ValidateNested()
  @Type(() => AnalyzeChannelDto)
  channel!: AnalyzeChannelDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorProfileDto)
  sponsors!: SponsorProfileDto[];
}
