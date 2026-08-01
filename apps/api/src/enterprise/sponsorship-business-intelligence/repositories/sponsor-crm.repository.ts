import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/persistence/prisma.service";

@Injectable()
export class SponsorCrmRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getDashboardSummary() {

    return {
      sponsors: 0,
      opportunities: 0,
      campaigns: 0,
      proposals: 0,
    };

  }

  async getPipeline() {

    return [];

  }

}
