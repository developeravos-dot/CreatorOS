import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CapabilityEntrypointDto {
  @IsIn(['node', 'browser', 'worker', 'hybrid'])
  runtime!: 'node' | 'browser' | 'worker' | 'hybrid';

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  module!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  exportName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bootstrap?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  shutdown?: string;
}