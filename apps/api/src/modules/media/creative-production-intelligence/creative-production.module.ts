import { Module } from "@nestjs/common";
import { CreativeProductionController } from "./controllers/creative-production.controller";
import { CreativeProductionService } from "./services/creative-production.service";

@Module({
  controllers:[
    CreativeProductionController
  ],
  providers:[
    CreativeProductionService
  ],
  exports:[
    CreativeProductionService
  ]
})
export class CreativeProductionModule {}
