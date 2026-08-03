import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class BulkRegisterCapabilitiesDto {
  @IsArray()
  @IsObject({
    each: true,
  })
  manifests!: Record<string, unknown>[];

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsBoolean()
  continueOnError?: boolean;
}

export class BulkUnregisterCapabilitiesDto {
  @IsArray()
  @IsString({
    each: true,
  })
  capabilityIds!: string[];

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsBoolean()
  continueOnError?: boolean;
}

export class ClearCapabilityRegistryDto {
  @IsString()
  @MinLength(1)
  confirmation!: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsBoolean()
  force?: boolean;
}

export class RestoreCapabilityRegistrySnapshotDto {
  @IsArray()
  @IsObject({
    each: true,
  })
  manifests!: Record<string, unknown>[];

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsBoolean()
  clearExisting?: boolean;

  @IsOptional()
  @IsBoolean()
  continueOnError?: boolean;
}