import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/persistence/prisma.service";

@Injectable()
export class SponsorshipCampaignRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {

    return [];

  }

}
