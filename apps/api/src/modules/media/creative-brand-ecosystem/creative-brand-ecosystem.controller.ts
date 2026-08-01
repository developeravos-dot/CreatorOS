import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreativeBrandEcosystemService } from './creative-brand-ecosystem.service';
import { CreativeProjectInput } from './creative-brand-ecosystem.types';

@Controller('media/creative-brand-ecosystem')
export class CreativeBrandEcosystemController {
  constructor(private readonly service: CreativeBrandEcosystemService) {}

  @Get('capabilities') capabilities() { return this.service.capabilities(); }
  @Get('dashboard') dashboard() { return this.service.dashboard(); }
  @Get('projects') list() { return this.service.list(); }
  @Get('projects/:id') get(@Param('id') id: string) { return this.service.get(id); }
  @Post('projects') create(@Body() input: CreativeProjectInput) { return this.service.create(input); }
  @Post('projects/:id/approve') approve(@Param('id') id: string, @Body('approvedBy') approvedBy?: string) { return this.service.approve(id, approvedBy); }
  @Post('projects/:id/activate') activate(@Param('id') id: string) { return this.service.activate(id); }
  @Patch('projects/:id/learn') learn(@Param('id') id: string, @Body('signal') signal: string, @Body('value') value: number) { return this.service.learn(id, signal, value); }
}