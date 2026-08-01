import { Module } from '@nestjs/common';
import { MediaGalaxyController } from './media-galaxy.controller';
import { MediaGalaxyService } from './media-galaxy.service';
import { ExecutiveCouncilService } from './executive-council.service';
import { OrganizationOsService } from './organization-os.service';
import { KnowledgeFabricService } from './knowledge-fabric.service';
import { WorldModelService } from './world-model.service';
import { DigitalDnaService } from './digital-dna.service';
import { ContentFactoryService } from './content-factory.service';
import { RevenuePlatformService } from './revenue-platform.service';
import { GlobalExpansionService } from './global-expansion.service';
import { SecurityGovernanceService } from './security-governance.service';

@Module({
  controllers: [MediaGalaxyController],
  providers: [
    ExecutiveCouncilService,
    OrganizationOsService,
    KnowledgeFabricService,
    WorldModelService,
    DigitalDnaService,
    ContentFactoryService,
    RevenuePlatformService,
    GlobalExpansionService,
    SecurityGovernanceService,
    MediaGalaxyService,
  ],
  exports: [MediaGalaxyService, KnowledgeFabricService],
})
export class MediaGalaxyModule {}
