import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CapabilityQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  domain?: string;

  @IsOptional()
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
  kind?:
    | 'core'
    | 'application'
    | 'integration'
    | 'intelligence'
    | 'automation'
    | 'content'
    | 'infrastructure'
    | 'extension';

  @IsOptional()
  @IsIn([
    'discovered',
    'registered',
    'validated',
    'installed',
    'initialized',
    'active',
    'suspended',
    'stopped',
    'failed',
    'uninstalled',
  ])
  state?:
    | 'discovered'
    | 'registered'
    | 'validated'
    | 'installed'
    | 'initialized'
    | 'active'
    | 'suspended'
    | 'stopped'
    | 'failed'
    | 'uninstalled';
}