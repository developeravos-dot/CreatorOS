import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreativeProductionService } from "../services/creative-production.service";

@Controller("media/creative-production")
export class CreativeProductionController {
  constructor(
    private readonly service: CreativeProductionService,
  ) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Post("plan")
  create(@Body() dto:any) {
    return this.service.create(dto);
  }
}
