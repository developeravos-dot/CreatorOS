import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCanonicalFingerprintsDto {
  @IsString()
  @MinLength(10)
  worldId!: string;

  @IsString()
  @MinLength(10)
  bibleId!: string;

  @IsOptional()
  @IsBoolean()
  lockAfterCreation?: boolean;
}
