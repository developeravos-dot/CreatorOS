import { Module } from "@nestjs/common";

import { BrandMatchEngine } from "./brand-match.engine";

@Module({
  providers: [
    BrandMatchEngine,
  ],

  exports: [
    BrandMatchEngine,
  ],
})
export class BrandMatchEngineModule {}
