import { Module } from "@nestjs/common";

import { SponsorCRMModule } from "../SponsorCRM/sponsor-crm.module";

import { SponsorshipDashboardService } from "./sponsorship-dashboard.service";

@Module({

imports:[SponsorCRMModule],

providers:[SponsorshipDashboardService],

exports:[SponsorshipDashboardService]

})

export class SponsorshipDashboardModule{}
