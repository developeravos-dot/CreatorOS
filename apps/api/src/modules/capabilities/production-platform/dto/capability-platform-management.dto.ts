import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ResolveManagedDependenciesDto {
  @IsString()
  @MinLength(1)
  rootCapabilityId!: string;

  @IsArray()
  catalog!: Record<string, unknown>[];

  @IsOptional()
  @IsBoolean()
  includeOptional?: boolean;

  @IsOptional()
  @IsBoolean()
  enforcePeerDependencies?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CapabilityManagementQueryDto {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  search?: string;
}