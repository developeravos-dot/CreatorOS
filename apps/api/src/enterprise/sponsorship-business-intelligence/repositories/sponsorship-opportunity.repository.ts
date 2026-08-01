import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/persistence/prisma.service";

@Injectable()
export class SponsorshipOpportunityRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {

    return [];

  }

}
