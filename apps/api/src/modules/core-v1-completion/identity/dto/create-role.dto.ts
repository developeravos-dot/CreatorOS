import { ArrayUnique, IsArray, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString() @Matches(/^[a-z0-9._-]{2,64}$/) key!: string;
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true }) permissionKeys?: string[];
}