import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ReviewGeneratedImageDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  jobId!: string;

  @IsString()
  @MinLength(10)
  assetId!: string;

  @IsBoolean()
  approved!: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
