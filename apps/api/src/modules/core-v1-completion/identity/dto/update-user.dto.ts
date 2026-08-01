import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { CreatorUserStatus } from '../../../../generated/prisma/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]{3,64}$/)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(CreatorUserStatus)
  status?: CreatorUserStatus;
}