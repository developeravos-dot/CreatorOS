import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/persistence/prisma.service";

@Injectable()
export class SponsorRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {

    return [];

  }

  async findById(
    id: string,
  ) {

    return null;

  }

  async create(
    dto: unknown,
  ) {

    return dto;

  }

}
