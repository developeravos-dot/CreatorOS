import { IsString, MinLength } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  @MinLength(2)
  roleKey!: string;
}