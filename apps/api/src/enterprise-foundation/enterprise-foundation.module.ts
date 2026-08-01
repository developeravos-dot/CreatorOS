import { Module } from "@nestjs/common";
import { EnterpriseFoundationController } from "./enterprise-foundation.controller";
import { EnterpriseFoundationService } from "./enterprise-foundation.service";

@Module({
  controllers: [EnterpriseFoundationController],
  providers: [EnterpriseFoundationService],
  exports: [EnterpriseFoundationService],
})
export class EnterpriseFoundationModule {}