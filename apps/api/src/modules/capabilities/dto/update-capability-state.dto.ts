import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCapabilityStateDto {
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
  state!:
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

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}