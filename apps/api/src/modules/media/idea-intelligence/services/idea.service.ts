import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../persistence/prisma.service";
import { CreateIdeaDto } from "../dto/create-idea.dto";
import { UpdateIdeaDto } from "../dto/update-idea.dto";

@Injectable()
export class IdeaService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateIdeaDto) {
    return this.prisma.mediaContentIdea.create({
      data: {
        id: dto.id,
        projectId: dto.projectId,
        channelFamilyId: dto.channelFamilyId,
        title: dto.title,
        summary: dto.summary,
        contentType: dto.contentType,
        targetAudience: dto.targetAudience,
        sourceMode: dto.sourceMode,
        status: dto.status,
        score: dto.score,
      },
    });
  }

  findAll() {
    return this.prisma.mediaContentIdea.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findOne(id: string) {
    return this.prisma.mediaContentIdea.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateIdeaDto) {
    return this.prisma.mediaContentIdea.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.mediaContentIdea.delete({
      where: { id },
    });
  }
}
