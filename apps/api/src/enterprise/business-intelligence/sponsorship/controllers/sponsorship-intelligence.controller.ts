import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AnalyzeChannelDto,
  DiscoverSponsorshipsDto,
  SponsorProfileDto,
} from '../dto/sponsorship.dto';
import {
  SponsorshipChannelProfile,
  SponsorshipOpportunityStatus,
} from '../models/sponsorship.models';
import { SponsorshipIntelligenceService } from '../services/sponsorship-intelligence.service';

@Controller(
  'enterprise/business-intelligence/sponsorship',
)
export class SponsorshipIntelligenceController {
  constructor(
    private readonly service: SponsorshipIntelligenceService,
  ) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('opportunities')
  list() {
    return {
      success: true,
      opportunities: this.service.list(),
    };
  }

  @Get('opportunities/:opportunityId')
  get(
    @Param('opportunityId') opportunityId: string,
  ) {
    return {
      success: true,
      opportunity: this.service.get(opportunityId),
    };
  }

  @Post('discover')
  discover(
    @Body() input: DiscoverSponsorshipsDto,
  ) {
    return {
      success: true,
      opportunities: this.service.discover(input),
      requiresHumanApproval: true,
    };
  }

  @Post('analyze')
  analyze(
    @Body()
    input: {
      channel: AnalyzeChannelDto;
      sponsor: SponsorProfileDto;
    },
  ) {
    return {
      success: true,
      opportunity: this.service.analyzeSponsor(
        input.channel as SponsorshipChannelProfile,
        input.sponsor,
      ),
      requiresHumanApproval: true,
    };
  }

  @Patch('opportunities/:opportunityId/status')
  updateStatus(
    @Param('opportunityId') opportunityId: string,
    @Body()
    input: {
      status: SponsorshipOpportunityStatus;
    },
  ) {
    return {
      success: true,
      opportunity: this.service.updateStatus(
        opportunityId,
        input.status,
      ),
    };
  }
}



