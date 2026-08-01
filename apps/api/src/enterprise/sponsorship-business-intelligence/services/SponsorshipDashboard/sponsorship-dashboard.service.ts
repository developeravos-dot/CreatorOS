import { Injectable } from "@nestjs/common";
import { SponsorCRMService } from "../SponsorCRM/sponsor-crm.service";

@Injectable()
export class SponsorshipDashboardService{

    constructor(
        private readonly crm:SponsorCRMService
    ){}

    getSummary(){

        const sponsors=this.crm.getSponsors();

        return{

            totalSponsors:sponsors.length,

            qualified:sponsors.filter(x=>x.status==="qualified").length,

            contacted:sponsors.filter(x=>x.status==="contacted").length,

            system:"operational"

        };

    }

}
