import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApproveContractDto,
  ApproveDealProposalDto,
  CreateInvoiceDto,
  CreateSponsorshipDealDto,
  RecordInvoicePaymentDto,
  RecordNegotiationDto,
  SignContractDto,
  UpdateDealStatusDto,
  UpdateDeliverableStatusDto,
} from '../dto/sponsorship-deal.dto';
import {
  SponsorshipDealStatus,
  SponsorshipDeliverableStatus,
} from '../models/sponsorship-deal.models';
import { SponsorshipDealService } from '../services/sponsorship-deal.service';

@Controller(
  'enterprise/business-intelligence/sponsorship/deals',
)
export class SponsorshipDealController {
  constructor(
    private readonly service: SponsorshipDealService,
  ) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Post()
  createDeal(
    @Body() input: CreateSponsorshipDealDto,
  ) {
    return {
      success: true,
      deal: this.service.createDeal(input),
    };
  }

  @Get()
  listDeals() {
    return {
      success: true,
      deals: this.service.listDeals(),
    };
  }

  @Get(':dealId')
  getDeal(@Param('dealId') dealId: string) {
    return {
      success: true,
      deal: this.service.getDeal(dealId),
    };
  }

  @Patch(':dealId/status')
  updateStatus(
    @Param('dealId') dealId: string,
    @Body() input: UpdateDealStatusDto,
  ) {
    return {
      success: true,
      deal: this.service.updateStatus(
        dealId,
        input.status as SponsorshipDealStatus,
      ),
    };
  }

  @Post(':dealId/negotiations')
  recordNegotiation(
    @Param('dealId') dealId: string,
    @Body() input: RecordNegotiationDto,
  ) {
    return {
      success: true,
      deal: this.service.recordNegotiation(
        dealId,
        input.proposedValue,
        input.note,
      ),
    };
  }

  @Patch(':dealId/proposal-approval')
  approveProposal(
    @Param('dealId') dealId: string,
    @Body() input: ApproveDealProposalDto,
  ) {
    return {
      success: true,
      deal: this.service.approveProposal(
        dealId,
        input.approved,
      ),
    };
  }

  @Patch(':dealId/contract-approval')
  approveContract(
    @Param('dealId') dealId: string,
    @Body() input: ApproveContractDto,
  ) {
    return {
      success: true,
      deal: this.service.approveContract(
        dealId,
        input.approved,
      ),
    };
  }

  @Patch(':dealId/contract-signature')
  signContract(
    @Param('dealId') dealId: string,
    @Body() input: SignContractDto,
  ) {
    return {
      success: true,
      deal: this.service.signContract(
        dealId,
        input.signed,
      ),
    };
  }

  @Patch(':dealId/deliverables/:deliverableId/status')
  updateDeliverableStatus(
    @Param('dealId') dealId: string,
    @Param('deliverableId') deliverableId: string,
    @Body() input: UpdateDeliverableStatusDto,
  ) {
    return {
      success: true,
      deal: this.service.updateDeliverableStatus(
        dealId,
        deliverableId,
        input.status as SponsorshipDeliverableStatus,
      ),
    };
  }

  @Post('invoices/create')
  createInvoice(@Body() input: CreateInvoiceDto) {
    return {
      success: true,
      invoice: this.service.createInvoice(input),
    };
  }

  @Get('invoices/all')
  listInvoices() {
    return {
      success: true,
      invoices: this.service.listInvoices(),
    };
  }

  @Patch('invoices/:invoiceId/payment')
  recordPayment(
    @Param('invoiceId') invoiceId: string,
    @Body() input: RecordInvoicePaymentDto,
  ) {
    return {
      success: true,
      invoice: this.service.recordPayment(
        invoiceId,
        input.amount,
      ),
    };
  }
}
