import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';
import { CreateEventDefinitionDto, CreateIntegrationEndpointDto, CreateSagaDto, CreateWebhookDto, PublishIntegrationEventDto, TransitionDeliveryDto, TransitionSagaDto, UpdateIntegrationEndpointDto } from './dto/integrations.dto';
import { IntegrationsService } from './integrations.service';

@ApiTags('Integration & Events')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}
  @Get('dashboard') @RequirePermissions(Permissions.IntegrationsDashboardRead) dashboard(){return this.integrations.dashboard();}
  @Get('endpoints') @RequirePermissions(Permissions.IntegrationsRead) endpoints(){return this.integrations.listEndpoints();}
  @Post('endpoints') @RequirePermissions(Permissions.IntegrationsWrite) createEndpoint(@Body() body:CreateIntegrationEndpointDto){return this.integrations.createEndpoint(body);}
  @Patch('endpoints/:id') @RequirePermissions(Permissions.IntegrationsWrite) updateEndpoint(@Param('id') id:string,@Body() body:UpdateIntegrationEndpointDto){return this.integrations.updateEndpoint(id,body);}
  @Get('events/catalog') @RequirePermissions(Permissions.EventCatalogRead) catalog(){return this.integrations.listEventDefinitions();}
  @Post('events/catalog') @RequirePermissions(Permissions.EventCatalogWrite) createDefinition(@Body() body:CreateEventDefinitionDto){return this.integrations.createEventDefinition(body);}
  @Post('events/publish') @RequirePermissions(Permissions.EventsPublish) publish(@Body() body:PublishIntegrationEventDto){return this.integrations.publishEvent(body);}
  @Get('webhooks') @RequirePermissions(Permissions.WebhooksRead) webhooks(){return this.integrations.listWebhooks();}
  @Post('webhooks') @RequirePermissions(Permissions.WebhooksWrite) createWebhook(@Body() body:CreateWebhookDto){return this.integrations.createWebhook(body);}
  @Get('deliveries') @RequirePermissions(Permissions.IntegrationsRead) deliveries(){return this.integrations.listDeliveries();}
  @Patch('deliveries/:id/transition') @RequirePermissions(Permissions.DeliveriesManage) transitionDelivery(@Param('id') id:string,@Body() body:TransitionDeliveryDto){return this.integrations.transitionDelivery(id,body);}
  @Get('sagas') @RequirePermissions(Permissions.IntegrationsRead) sagas(){return this.integrations.listSagas();}
  @Post('sagas') @RequirePermissions(Permissions.SagasManage) createSaga(@Body() body:CreateSagaDto){return this.integrations.createSaga(body);}
  @Patch('sagas/:id/transition') @RequirePermissions(Permissions.SagasManage) transitionSaga(@Param('id') id:string,@Body() body:TransitionSagaDto){return this.integrations.transitionSaga(id,body);}
}
