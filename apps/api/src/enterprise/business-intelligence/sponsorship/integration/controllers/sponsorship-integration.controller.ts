import { Controller,Get } from '@nestjs/common';
import { SponsorshipIntegrationService } from '../services/sponsorship-integration.service';

@Controller('enterprise/business-intelligence/sponsorship/integration')
export class SponsorshipIntegrationController{

constructor(private readonly service:SponsorshipIntegrationService){}

@Get('status')
status(){
return this.service.status();
}

@Get('dashboard')
dashboard(){
return this.service.dashboard();
}

}
