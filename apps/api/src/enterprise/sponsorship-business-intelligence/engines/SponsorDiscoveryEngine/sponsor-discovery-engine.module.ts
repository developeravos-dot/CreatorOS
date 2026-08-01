import { Module } from "@nestjs/common";

import { SponsorDiscoveryEngine } from "./sponsor-discovery.engine";

@Module({
  providers: [
    SponsorDiscoveryEngine,
  ],

  exports: [
    SponsorDiscoveryEngine,
  ],
})
export class SponsorDiscoveryEngineModule {}
