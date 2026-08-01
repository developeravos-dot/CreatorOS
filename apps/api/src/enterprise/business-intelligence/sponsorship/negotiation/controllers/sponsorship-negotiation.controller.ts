import { Controller,Get } from '@nestjs/common';
import { SponsorshipNegotiationService } from '../services/sponsorship-negotiation.service';

@Controller('enterprise/business-intelligence/sponsorship/negotiation')
export class SponsorshipNegotiationController{

constructor(private readonly service:SponsorshipNegotiationService){}

@Get('status')
status(){
return this.service.status();
}

@Get('dashboard')
dashboard(){
return this.service.dashboard();
}

}
