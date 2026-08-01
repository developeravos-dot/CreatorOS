import { Controller,Get } from '@nestjs/common';
import { SponsorshipDiscoveryService } from '../services/sponsorship-discovery.service';

@Controller('enterprise/business-intelligence/sponsorship/discovery')
export class SponsorshipDiscoveryController{

constructor(private readonly service:SponsorshipDiscoveryService){}

@Get('status')
status(){
return this.service.status();
}

@Get('dashboard')
dashboard(){
return this.service.dashboard();
}

}
