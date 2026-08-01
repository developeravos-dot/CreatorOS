import { Controller,Get } from '@nestjs/common';
import { SponsorshipOrchestratorService } from '../services/sponsorship-orchestrator.service';

@Controller('enterprise/business-intelligence/sponsorship/orchestrator')
export class SponsorshipOrchestratorController{

constructor(private readonly service:SponsorshipOrchestratorService){}

@Get('status')
status(){
return this.service.status();
}

@Get('dashboard')
dashboard(){
return this.service.dashboard();
}

}
