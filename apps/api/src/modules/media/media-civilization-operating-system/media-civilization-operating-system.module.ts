import { Module } from '@nestjs/common';
import { CivilizationCommerceEngineService } from './civilization-commerce-engine.service';
import { CivilizationConstitutionEngineService } from './civilization-constitution-engine.service';
import { CivilizationDiplomacyEngineService } from './civilization-diplomacy-engine.service';
import { CivilizationEconomyEngineService } from './civilization-economy-engine.service';
import { CivilizationExecutionEngineService } from './civilization-execution-engine.service';
import { CivilizationObservabilityEngineService } from './civilization-observability-engine.service';
import { CivilizationResilienceEngineService } from './civilization-resilience-engine.service';
import { CommunityCivilizationEngineService } from './community-civilization-engine.service';
import { CultureCivilizationEngineService } from './culture-civilization-engine.service';
import { DigitalCityEngineService } from './digital-city-engine.service';
import { DigitalIdentityPassportEngineService } from './digital-identity-passport-engine.service';
import { IpCivilizationEngineService } from './ip-civilization-engine.service';
import { KnowledgeCivilizationEngineService } from './knowledge-civilization-engine.service';
import { MediaCivilizationOperatingSystemController } from './media-civilization-operating-system.controller';
import { MediaCivilizationOperatingSystemService } from './media-civilization-operating-system.service';
import { SustainabilityCivilizationEngineService } from './sustainability-civilization-engine.service';

@Module({
  controllers: [MediaCivilizationOperatingSystemController],
  providers: [
    MediaCivilizationOperatingSystemService,
    CivilizationConstitutionEngineService,
    DigitalCityEngineService,
    CivilizationEconomyEngineService,
    DigitalIdentityPassportEngineService,
    IpCivilizationEngineService,
    KnowledgeCivilizationEngineService,
    CultureCivilizationEngineService,
    CommunityCivilizationEngineService,
    CivilizationCommerceEngineService,
    SustainabilityCivilizationEngineService,
    CivilizationResilienceEngineService,
    CivilizationDiplomacyEngineService,
    CivilizationExecutionEngineService,
    CivilizationObservabilityEngineService,
  ],
  exports: [MediaCivilizationOperatingSystemService],
})
export class MediaCivilizationOperatingSystemModule {}