import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SponsorshipDeliverableDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  platform!: string;

  @IsString()
  format!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsNumber()
  @Min(0)
  agreedValue!: number;

  @IsString()
  currency!: string;
}

export class SponsorshipPaymentMilestoneDto {
  @IsString()
  title!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage!: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class CreateSponsorshipDealDto {
  @IsString()
  sponsorId!: string;

  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsString()
  opportunityId?: string;

  @IsString()
  campaignName!: string;

  @IsNumber()
  @Min(0)
  proposedValue!: number;

  @IsNumber()
  @Min(0)
  minimumAcceptableValue!: number;

  @IsString()
  currency!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorshipDeliverableDto)
  deliverables!: SponsorshipDeliverableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorshipPaymentMilestoneDto)
  paymentMilestones!: SponsorshipPaymentMilestoneDto[];
}

export class UpdateDealStatusDto {
  @IsIn([
    'draft',
    'proposal_ready',
    'proposal_approved',
    'sent',
    'negotiating',
    'verbally_agreed',
    'contract_ready',
    'contract_approved',
    'signed',
    'in_delivery',
    'completed',
    'invoiced',
    'partially_paid',
    'paid',
    'cancelled',
    'lost',
  ])
  status!: string;
}

export class RecordNegotiationDto {
  @IsNumber()
  @Min(0)
  proposedValue!: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class ApproveDealProposalDto {
  @IsBoolean()
  approved!: boolean;
}

export class ApproveContractDto {
  @IsBoolean()
  approved!: boolean;
}

export class SignContractDto {
  @IsBoolean()
  signed!: boolean;
}

export class UpdateDeliverableStatusDto {
  @IsIn([
    'planned',
    'in_progress',
    'submitted',
    'revision_requested',
    'approved',
    'published',
    'cancelled',
  ])
  status!: string;
}

export class CreateInvoiceDto {
  @IsString()
  dealId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsDateString()
  dueDate!: string;
}

export class RecordInvoicePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;
}
