import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @IsDateString() expiresAt!: string;
  @IsOptional() @IsString() @MaxLength(100) ipAddress?: string;
  @IsOptional() @IsString() @MaxLength(500) userAgent?: string;
  @IsOptional() @IsString() @MaxLength(120) deviceName?: string;
}