import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { IntegrationDeliveryStatus, IntegrationEndpointStatus, IntegrationSagaStatus } from '../../../../generated/prisma/enums';

export class CreateIntegrationEndpointDto {
  @IsString() @MaxLength(80) endpointKey!: string;
  @IsString() @MaxLength(160) name!: string;
  @IsString() @MaxLength(80) type!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsEnum(IntegrationEndpointStatus) status?: IntegrationEndpointStatus;
  @IsOptional() @IsObject() configuration?: Record<string, unknown>;
}
export class UpdateIntegrationEndpointDto {
  @IsOptional() @IsString() @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsEnum(IntegrationEndpointStatus) status?: IntegrationEndpointStatus;
  @IsOptional() @IsObject() configuration?: Record<string, unknown>;
}
export class CreateEventDefinitionDto {
  @IsString() @MaxLength(120) eventName!: string;
  @IsString() @MaxLength(80) domain!: string;
  @IsString() @MaxLength(40) version!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsObject() schema!: Record<string, unknown>;
}
export class CreateWebhookDto {
  @IsString() @MaxLength(80) webhookKey!: string;
  @IsString() @MaxLength(160) name!: string;
  @IsUrl({ require_tld: false }) url!: string;
  @IsArray() @IsString({ each: true }) eventNames!: string[];
  @IsOptional() @IsString() secret?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
export class PublishIntegrationEventDto {
  @IsString() @MaxLength(120) eventName!: string;
  @IsString() @MaxLength(120) aggregateType!: string;
  @IsOptional() @IsString() aggregateId?: string;
  @IsObject() payload!: Record<string, unknown>;
  @IsOptional() @IsString() correlationId?: string;
}
export class TransitionDeliveryDto {
  @IsEnum(IntegrationDeliveryStatus) status!: IntegrationDeliveryStatus;
  @IsOptional() @IsString() @MaxLength(4000) responseBody?: string;
  @IsOptional() @IsString() @MaxLength(2000) error?: string;
}
export class CreateSagaDto {
  @IsString() @MaxLength(80) sagaKey!: string;
  @IsString() @MaxLength(160) name!: string;
  @IsOptional() @IsString() correlationId?: string;
  @IsObject() state!: Record<string, unknown>;
}
export class TransitionSagaDto {
  @IsEnum(IntegrationSagaStatus) status!: IntegrationSagaStatus;
  @IsOptional() @IsObject() state?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(2000) error?: string;
}
