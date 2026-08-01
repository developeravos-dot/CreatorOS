import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString() @Matches(/^[a-z0-9.*:_-]{3,120}$/) key!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
}