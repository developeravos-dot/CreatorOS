import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnterpriseCapabilityFabricService, EnterpriseKnowledgeFabricService, EnterprisePolicyEngineService, EnterpriseServiceMeshService } from '../services';

@Controller('enterprise/fabric')
export class EnterpriseFabricController {
  constructor(
    private readonly knowledge: EnterpriseKnowledgeFabricService,
    private readonly capabilities: EnterpriseCapabilityFabricService,
    private readonly serviceMesh: EnterpriseServiceMeshService,
    private readonly policies: EnterprisePolicyEngineService,
  ) {}

  @Get('snapshot')
  snapshot() {
    return {
      knowledge: this.knowledge.search({}),
      capabilities: this.capabilities.list(),
      serviceMesh: this.serviceMesh.list(),
      policies: this.policies.list(),
      generatedAt: new Date(),
    };
  }

  @Post('knowledge')
  publish(@Body() body: Parameters<EnterpriseKnowledgeFabricService['publish']>[0]) {
    return this.knowledge.publish(body);
  }
}
