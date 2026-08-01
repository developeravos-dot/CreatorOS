import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GenerateNoveltyV31Dto } from '../../v3-1/dto/generate-novelty-v3-1.dto';
import type { PatentSearchProviderId } from '../models/novelty-v3-2.models';

export class GenerateNoveltyV32Dto extends GenerateNoveltyV31Dto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(
    [
      'local-simulation',
      'lens-patents',
      'google-patents',
      'espacenet',
      'wipo-patentscope',
      'uspto',
    ],
    { each: true },
  )
  searchProviders?: PatentSearchProviderId[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maximumDocumentsPerQuery?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  maximumQueriesToExecute?: number;

  @IsOptional()
  @IsString()
  searchLanguage?: string;

  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @IsOptional()
  @IsDateString()
  searchDateFrom?: string;

  @IsOptional()
  @IsDateString()
  searchDateTo?: string;
}

