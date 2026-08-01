import { ArrayUnique, IsArray, IsDateString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCredentialDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsArray() @ArrayUnique() @IsString({ each: true }) scopes!: string[];
  @IsOptional() @IsDateString() expiresAt?: string;
}