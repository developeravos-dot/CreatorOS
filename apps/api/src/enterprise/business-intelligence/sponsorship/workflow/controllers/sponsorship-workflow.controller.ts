import { Controller,Get } from '@nestjs/common';
import { SponsorshipWorkflowService } from '../services/sponsorship-workflow.service';

@Controller('enterprise/business-intelligence/sponsorship/workflow')
export class SponsorshipWorkflowController{

constructor(private readonly service:SponsorshipWorkflowService){}

@Get('status')
status(){
return this.service.status();
}

@Get('dashboard')
dashboard(){
return this.service.dashboard();
}

}
