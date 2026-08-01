import { Module } from "@nestjs/common";
import { SponsorCRMService } from "./sponsor-crm.service";

@Module({
  providers:[SponsorCRMService],
  exports:[SponsorCRMService],
})

export class SponsorCRMModule{}
