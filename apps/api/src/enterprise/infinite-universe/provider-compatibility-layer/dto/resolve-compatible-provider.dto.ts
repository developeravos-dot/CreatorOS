import {
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ResolveCompatibleProviderDto {
  @IsIn([
    'character-reference',
    'character-expression',
    'character-pose',
    'environment-reference',
    'prop-reference',
    'storyboard-frame',
  ])
  workload!:
    | 'character-reference'
    | 'character-expression'
    | 'character-pose'
    | 'environment-reference'
    | 'prop-reference'
    | 'storyboard-frame';

  @IsOptional()
  @IsString()
  requestedProviderId?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  worldId?: string;

  @IsOptional()
  @IsIn([
    'character',
    'environment',
    'prop',
  ])
  entityType?:
    | 'character'
    | 'environment'
    | 'prop';

  @IsOptional()
  @IsString()
  @MinLength(1)
  entityId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  entityName?: string;
}
