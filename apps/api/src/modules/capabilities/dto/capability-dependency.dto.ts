import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CapabilityDependencyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  capabilityId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  versionRange!: string;

  @IsIn(['required', 'optional', 'peer'])
  type!: 'required' | 'optional' | 'peer';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}