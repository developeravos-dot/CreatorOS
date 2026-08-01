import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MediaPlatform } from './media-ecosystem.contracts';

export class CreateMediaProjectDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(2)
  primaryLanguage!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  targetMarkets!: string[];
}

export class CreateMediaChannelDto {
  name!: string;
  platform!: MediaPlatform;
  language!: string;
  market?: string;
  niche!: string;
  audience!: string;
  familyName?: string;
}

export class CreateLocalizedMediaChannelDto {
  name!: string;
  language!: string;
  market?: string;
}

export class CreateMediaChannelLanguagesDto {
  channels!: CreateLocalizedMediaChannelDto[];
}

export class CreateMediaContentIdeaDto {
  projectId!: string;
  channelFamilyId?: string;
  title!: string;
  summary!: string;
  contentType!: string;
  targetAudience!: string;
  sourceMode!:
    | 'original'
    | 'research-inspired'
    | 'public-domain';
  score?: number;
}

export class DecideMediaApprovalDto {
  notes?: string;
}
