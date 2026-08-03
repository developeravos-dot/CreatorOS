import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CapabilityResourceLimitsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3_600_000)
  timeoutMs?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10_000)
  maxConcurrency?: number;

  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(1_048_576)
  maxMemoryMb?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  maxRetries?: number;
}

export class CapabilitySecurityPolicyDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  permissions!: string[];

  @IsOptional()
  @IsBoolean()
  networkAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  filesystemAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  environmentAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  processAccess?: boolean;
}

export class CapabilityPolicyDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CapabilityResourceLimitsDto)
  limits?: CapabilityResourceLimitsDto;

  @ValidateNested()
  @Type(() => CapabilitySecurityPolicyDto)
  security!: CapabilitySecurityPolicyDto;
}