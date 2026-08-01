import { Controller,Get } from "@nestjs/common";

import { SponsorCRMService } from "../../services/SponsorCRM/sponsor-crm.service";
import { SponsorshipDashboardService } from "../../services/SponsorshipDashboard/sponsorship-dashboard.service";

@Controller("api/v1/enterprise/sponsorship")

export class SponsorshipController{

constructor(

private readonly crm:SponsorCRMService,

private readonly dashboard:SponsorshipDashboardService

){}

@Get("health")
health(){

return{

success:true,

status:"operational",

system:"CreatorOS Sponsorship Business Intelligence"

};

}

@Get("status")
status(){

return{

capability:"SponsorshipBusinessIntelligence",

state:"running"

};

}

@Get("dashboard")
dashboardSummary(){

return this.dashboard.getSummary();

}

@Get("sponsors")
sponsors(){

return this.crm.getSponsors();

}

}
