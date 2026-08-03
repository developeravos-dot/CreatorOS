import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  Type,
} from 'class-transformer';

export class DependencyCatalogEntryDto {
  @IsString()
  @MinLength(1)
  capabilityId!: string;

  @IsString()
  @MinLength(1)
  version!: string;

  @IsObject()
  manifest!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ResolveCapabilityDependenciesDto {
  @IsString()
  @MinLength(1)
  rootCapabilityId!: string;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      DependencyCatalogEntryDto,
  )
  catalog!: DependencyCatalogEntryDto[];

  @IsOptional()
  @IsBoolean()
  includeOptional?: boolean;

  @IsOptional()
  @IsBoolean()
  enforcePeerDependencies?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}

export class BulkDependencyAnalysisItemDto {
  @IsString()
  @MinLength(1)
  rootCapabilityId!: string;

  @IsOptional()
  @IsBoolean()
  includeOptional?: boolean;

  @IsOptional()
  @IsBoolean()
  enforcePeerDependencies?: boolean;
}

export class BulkDependencyAnalysisDto {
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      BulkDependencyAnalysisItemDto,
  )
  requests!:
    BulkDependencyAnalysisItemDto[];

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      DependencyCatalogEntryDto,
  )
  catalog!: DependencyCatalogEntryDto[];

  @IsOptional()
  @IsBoolean()
  continueOnError?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}