import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  SponsorshipContactChannel,
  SponsorshipLeadStatus,
} from '../models/sponsorship-outreach.models';

export class CreateSponsorshipLeadDto {
  @IsString()
  sponsorId!: string;

  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  opportunityId?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  opportunityScore!: number;

  @IsNumber()
  @Min(0)
  estimatedValue!: number;

  @IsString()
  currency!: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactRole?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsEnum([
    'email',
    'linkedin',
    'website',
    'instagram',
    'other',
  ])
  preferredChannel?: SponsorshipContactChannel;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  contactConfidenceScore?: number;

  @IsOptional()
  @IsBoolean()
  contactVerified?: boolean;
}

export class GenerateOutreachDraftDto {
  @IsString()
  leadId!: string;

  @IsString()
  channelId!: string;

  @IsString()
  channelName!: string;

  @IsArray()
  @IsString({ each: true })
  channelCategories!: string[];

  @IsNumber()
  @Min(0)
  averageViews!: number;

  @IsNumber()
  @Min(0)
  audienceReach!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  engagementRate!: number;

  @IsArray()
  @IsString({ each: true })
  audienceCountries!: string[];

  @IsArray()
  @IsString({ each: true })
  audienceLanguages!: string[];

  @IsOptional()
  @IsString()
  campaignIdea?: string;

  @IsOptional()
  @IsString()
  senderName?: string;
}

export class UpdateSponsorshipLeadStatusDto {
  @IsEnum([
    'discovered',
    'enriched',
    'qualified',
    'draft_ready',
    'approved',
    'contacted',
    'replied',
    'meeting_requested',
    'negotiating',
    'converted',
    'rejected',
    'archived',
  ])
  status!: SponsorshipLeadStatus;
}

export class ApproveOutreachDraftDto {
  @IsBoolean()
  approved!: boolean;
}
