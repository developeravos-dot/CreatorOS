import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApproveOutreachDraftDto,
  CreateSponsorshipLeadDto,
  GenerateOutreachDraftDto,
  UpdateSponsorshipLeadStatusDto,
} from '../dto/sponsorship-outreach.dto';
import { SponsorshipOutreachService } from '../services/sponsorship-outreach.service';

@Controller(
  'enterprise/business-intelligence/sponsorship/outreach',
)
export class SponsorshipOutreachController {
  constructor(
    private readonly service: SponsorshipOutreachService,
  ) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Post('leads')
  createLead(
    @Body() input: CreateSponsorshipLeadDto,
  ) {
    return {
      success: true,
      lead: this.service.createLead(input),
    };
  }

  @Get('leads')
  listLeads() {
    return {
      success: true,
      leads: this.service.listLeads(),
    };
  }

  @Get('leads/:leadId')
  getLead(@Param('leadId') leadId: string) {
    return {
      success: true,
      lead: this.service.getLead(leadId),
    };
  }

  @Patch('leads/:leadId/status')
  updateLeadStatus(
    @Param('leadId') leadId: string,
    @Body() input: UpdateSponsorshipLeadStatusDto,
  ) {
    return {
      success: true,
      lead: this.service.updateLeadStatus(
        leadId,
        input.status,
      ),
    };
  }

  @Post('drafts')
  generateDraft(
    @Body() input: GenerateOutreachDraftDto,
  ) {
    return {
      success: true,
      draft: this.service.generateDraft(input),
      requiresHumanApproval: true,
    };
  }

  @Get('drafts')
  listDrafts() {
    return {
      success: true,
      drafts: this.service.listDrafts(),
    };
  }

  @Get('drafts/:draftId')
  getDraft(@Param('draftId') draftId: string) {
    return {
      success: true,
      draft: this.service.getDraft(draftId),
    };
  }

  @Patch('drafts/:draftId/approval')
  approveDraft(
    @Param('draftId') draftId: string,
    @Body() input: ApproveOutreachDraftDto,
  ) {
    return {
      success: true,
      draft: this.service.approveDraft(
        draftId,
        input.approved,
      ),
      humanFinalAuthority: true,
    };
  }
}



