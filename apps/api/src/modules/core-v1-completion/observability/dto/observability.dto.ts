import { IsBoolean, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import { ObsAlertSeverity, ObsAlertStatus, ObsHealthStatus, ObsLogLevel, ObsMetricKind } from '../../../../generated/prisma/enums';

export class RecordMetricDto {
  @IsString() metricKey!: string;
  @IsString() service!: string;
  @IsEnum(ObsMetricKind) kind!: ObsMetricKind;
  @IsNumber() value!: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsObject() labels?: Record<string, unknown>;
  @IsOptional() @IsString() observedAt?: string;
}

export class RecordHealthDto {
  @IsString() service!: string;
  @IsEnum(ObsHealthStatus) status!: ObsHealthStatus;
  @IsOptional() @IsNumber() latencyMs?: number;
  @IsOptional() @IsString() message?: string;
  @IsOptional() @IsObject() details?: Record<string, unknown>;
  @IsOptional() @IsString() checkedAt?: string;
}

export class RecordLogDto {
  @IsString() service!: string;
  @IsEnum(ObsLogLevel) level!: ObsLogLevel;
  @IsString() message!: string;
  @IsOptional() @IsString() traceId?: string;
  @IsOptional() @IsString() spanId?: string;
  @IsOptional() @IsObject() context?: Record<string, unknown>;
  @IsOptional() @IsString() occurredAt?: string;
}

export class RecordTraceDto {
  @IsString() traceId!: string;
  @IsString() spanId!: string;
  @IsOptional() @IsString() parentSpanId?: string;
  @IsString() service!: string;
  @IsString() operation!: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsNumber() durationMs?: number;
  @IsOptional() @IsString() startedAt?: string;
  @IsOptional() @IsString() endedAt?: string;
  @IsOptional() @IsObject() attributes?: Record<string, unknown>;
}

export class CreateAlertRuleDto {
  @IsString() ruleKey!: string;
  @IsString() name!: string;
  @IsString() metricKey!: string;
  @IsString() operator!: string;
  @IsNumber() threshold!: number;
  @IsEnum(ObsAlertSeverity) severity!: ObsAlertSeverity;
  @IsOptional() @IsInt() @Min(1) evaluationWindowMinutes?: number;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsObject() labels?: Record<string, unknown>;
}

export class UpdateAlertRuleDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() operator?: string;
  @IsOptional() @IsNumber() threshold?: number;
  @IsOptional() @IsEnum(ObsAlertSeverity) severity?: ObsAlertSeverity;
  @IsOptional() @IsInt() @Min(1) evaluationWindowMinutes?: number;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsObject() labels?: Record<string, unknown>;
}

export class TransitionAlertDto {
  @IsEnum(ObsAlertStatus) status!: ObsAlertStatus;
  @IsOptional() @IsString() note?: string;
}

export class QueryTelemetryDto {
  @IsOptional() @IsString() service?: string;
  @IsOptional() @IsString() metricKey?: string;
  @IsOptional() @IsString() traceId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(500) limit?: number;
}
