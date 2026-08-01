import { Module } from '@nestjs/common';
import { BrandOperatingSystemService } from './brand-operating-system.service';
import { IpRevenueService } from './ip-revenue.service';
import { MediaEnterprisePlatformController } from './media-enterprise-platform.controller';
import { MediaEnterprisePlatformService } from './media-enterprise-platform.service';
import { MediaEventBusService } from './media-event-bus.service';
import { ProductionOperatingSystemService } from './production-operating-system.service';
import { PublishingGrowthService } from './publishing-growth.service';

@Module({
  controllers: [MediaEnterprisePlatformController],
  providers: [
    MediaEventBusService,
    BrandOperatingSystemService,
    ProductionOperatingSystemService,
    PublishingGrowthService,
    IpRevenueService,
    MediaEnterprisePlatformService,
  ],
  exports: [
    MediaEventBusService,
    BrandOperatingSystemService,
    ProductionOperatingSystemService,
    PublishingGrowthService,
    IpRevenueService,
    MediaEnterprisePlatformService,
  ],
})
export class MediaEnterprisePlatformModule {}
