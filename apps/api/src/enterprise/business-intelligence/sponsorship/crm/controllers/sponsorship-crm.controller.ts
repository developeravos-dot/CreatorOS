import { Controller, Get } from '@nestjs/common';
import { SponsorshipCrmService } from '../services/sponsorship-crm.service';

@Controller('enterprise/business-intelligence/sponsorship/crm')
export class SponsorshipCrmController {

  constructor(
    private readonly service: SponsorshipCrmService,
  ) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

}
