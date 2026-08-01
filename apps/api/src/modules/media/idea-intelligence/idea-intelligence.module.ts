import { Module } from "@nestjs/common";
import { PersistenceModule } from "../../persistence/persistence.module";
import { IdeaController } from "./controllers/idea.controller";
import { IdeaService } from "./services/idea.service";

@Module({
  imports: [PersistenceModule],
  controllers: [IdeaController],
  providers: [IdeaService],
  exports: [IdeaService],
})
export class IdeaIntelligenceModule {}
