import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CapabilityDependencyDto } from './capability-dependency.dto';
import { CapabilityEntrypointDto } from './capability-entrypoint.dto';
import { CapabilityPolicyDto } from './capability-policy.dto';
import { CapabilityPublisherDto } from './capability-publisher.dto';

export class CreateCapabilityManifestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  @Matches(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/)
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/,
  )
  version!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  domain!: string;

  @IsIn([
    'core',
    'application',
    'integration',
    'intelligence',
    'automation',
    'content',
    'infrastructure',
    'extension',
  ])
  kind!:
    | 'core'
    | 'application'
    | 'integration'
    | 'intelligence'
    | 'automation'
    | 'content'
    | 'infrastructure'
    | 'extension';

  @ValidateNested()
  @Type(() => CapabilityPublisherDto)
  publisher!: CapabilityPublisherDto;

  @ValidateNested()
  @Type(() => CapabilityEntrypointDto)
  entrypoint!: CapabilityEntrypointDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CapabilityDependencyDto)
  dependencies!: CapabilityDependencyDto[];

  @ValidateNested()
  @Type(() => CapabilityPolicyDto)
  policy!: CapabilityPolicyDto;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}