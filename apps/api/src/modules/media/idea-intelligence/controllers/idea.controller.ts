import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { IdeaService } from "../services/idea.service";
import { CreateIdeaDto } from "../dto/create-idea.dto";
import { UpdateIdeaDto } from "../dto/update-idea.dto";

@Controller("avos/media/ideas")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  create(@Body() dto: CreateIdeaDto) {
    return this.ideaService.create(dto);
  }

  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ideaService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateIdeaDto,
  ) {
    return this.ideaService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ideaService.remove(id);
  }
}
