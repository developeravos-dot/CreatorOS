import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../persistence/prisma.service';
import { IntegrationDeliveryStatus, IntegrationSagaStatus } from '../../../generated/prisma/enums';
import { CreateEventDefinitionDto, CreateIntegrationEndpointDto, CreateSagaDto, CreateWebhookDto, PublishIntegrationEventDto, TransitionDeliveryDto, TransitionSagaDto, UpdateIntegrationEndpointDto } from './dto/integrations.dto';

type IntegrationWebhookMatch = {
  id: string;
  eventNames: unknown;
};

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async audit(action: string, resourceType: string, resourceId?: string, payload?: object) {
    await this.prisma.auditLog.create({ data: { eventType: `integration.${action}`, actorType: 'SYSTEM', resourceType, resourceId, action, payload: payload ?? undefined } });
  }
  private conflict(error: unknown): never {
    if ((error as { code?: string }).code === 'P2002') throw new ConflictException('An integration record with this key already exists.');
    throw error;
  }

  async dashboard() {
    const [endpoints, activeEndpoints, events, webhooks, activeWebhooks, pending, retrying, deadLetter, sagas, runningSagas] = await Promise.all([
      this.prisma.integrationEndpoint.count(),
      this.prisma.integrationEndpoint.count({ where: { status: 'ACTIVE' } }),
      this.prisma.integrationEventDefinition.count({ where: { active: true } }),
      this.prisma.integrationWebhook.count(),
      this.prisma.integrationWebhook.count({ where: { active: true } }),
      this.prisma.integrationDelivery.count({ where: { status: 'PENDING' } }),
      this.prisma.integrationDelivery.count({ where: { status: 'RETRYING' } }),
      this.prisma.integrationDelivery.count({ where: { status: 'DEAD_LETTER' } }),
      this.prisma.integrationSaga.count(),
      this.prisma.integrationSaga.count({ where: { status: 'RUNNING' } }),
    ]);
    return { endpoints, activeEndpoints, events, webhooks, activeWebhooks, deliveries: { pending, retrying, deadLetter }, sagas, runningSagas };
  }

  listEndpoints() { return this.prisma.integrationEndpoint.findMany({ orderBy: { updatedAt: 'desc' } }); }
  async createEndpoint(input: CreateIntegrationEndpointDto) { try { const row=await this.prisma.integrationEndpoint.create({ data: { ...input, configuration: (input.configuration ?? {}) as any } }); await this.audit('endpoint.created','IntegrationEndpoint',row.id,{ endpointKey: row.endpointKey }); return row; } catch(e){ this.conflict(e); } }
  async updateEndpoint(id:string,input:UpdateIntegrationEndpointDto){ const found=await this.prisma.integrationEndpoint.findUnique({where:{id}}); if(!found) throw new NotFoundException('Integration endpoint not found.'); const row=await this.prisma.integrationEndpoint.update({ where: { id }, data: { ...input, ...(input.configuration !== undefined ? { configuration: input.configuration as any } : {}) } }); await this.audit('endpoint.updated','IntegrationEndpoint',id,{status:row.status}); return row; }

  listEventDefinitions(){ return this.prisma.integrationEventDefinition.findMany({orderBy:[{domain:'asc'},{eventName:'asc'}]}); }
  async createEventDefinition(input:CreateEventDefinitionDto){ try { const row=await this.prisma.integrationEventDefinition.create({ data: { ...input, schema: input.schema as any } }); await this.audit('event-definition.created','IntegrationEventDefinition',row.id,{eventName:row.eventName}); return row; } catch(e){this.conflict(e);} }

  listWebhooks(){ return this.prisma.integrationWebhook.findMany({orderBy:{updatedAt:'desc'}}); }
  async createWebhook(input:CreateWebhookDto){ try { const row=await this.prisma.integrationWebhook.create({data:{...input,eventNames:input.eventNames,active:input.active??true}}); await this.audit('webhook.created','IntegrationWebhook',row.id,{webhookKey:row.webhookKey}); return row; } catch(e){this.conflict(e);} }

  async publishEvent(input:PublishIntegrationEventDto){
    const definition=await this.prisma.integrationEventDefinition.findFirst({where:{eventName:input.eventName,active:true}});
    if(!definition) throw new NotFoundException('Active event definition not found.');
    const event=await this.prisma.integrationEvent.create({data:{eventName:input.eventName,aggregateType:input.aggregateType,aggregateId:input.aggregateId,payload: input.payload as any,correlationId:input.correlationId}});
    const hooks=await this.prisma.integrationWebhook.findMany({where:{active:true}});
    const matching = (hooks as IntegrationWebhookMatch[]).filter((hook) =>
      Array.isArray(hook.eventNames) && hook.eventNames.includes(input.eventName),
    );
    if(matching.length){ await this.prisma.integrationDelivery.createMany({data:matching.map((hook) => ({
          eventId: event.id,
          webhookId: hook.id,
          status: 'PENDING',
        }))}); }
    await this.audit('event.published','IntegrationEvent',event.id,{eventName:event.eventName,deliveries:matching.length});
    return this.prisma.integrationEvent.findUnique({where:{id:event.id},include:{deliveries:true}});
  }

  listDeliveries(){ return this.prisma.integrationDelivery.findMany({include:{event:true,webhook:true},orderBy:{createdAt:'desc'},take:200}); }
  async transitionDelivery(id:string,input:TransitionDeliveryDto){
    const found=await this.prisma.integrationDelivery.findUnique({where:{id}}); if(!found) throw new NotFoundException('Integration delivery not found.');
    const terminal: IntegrationDeliveryStatus[]=[IntegrationDeliveryStatus.DELIVERED,IntegrationDeliveryStatus.DEAD_LETTER];
    if(terminal.includes(found.status) && input.status!==found.status) throw new ConflictException('A terminal delivery cannot be transitioned.');
    const attempts= input.status===IntegrationDeliveryStatus.RETRYING || input.status===IntegrationDeliveryStatus.DELIVERED ? {increment:1} : undefined;
    const row=await this.prisma.integrationDelivery.update({where:{id},data:{status:input.status,responseBody:input.responseBody,lastError:input.error,attempts,deliveredAt:input.status===IntegrationDeliveryStatus.DELIVERED?new Date():undefined,nextAttemptAt:input.status===IntegrationDeliveryStatus.RETRYING?new Date(Date.now()+60000):undefined}});
    await this.audit('delivery.transitioned','IntegrationDelivery',id,{status:row.status,attempts:row.attempts}); return row;
  }

  listSagas(){ return this.prisma.integrationSaga.findMany({orderBy:{updatedAt:'desc'}}); }
  async createSaga(input:CreateSagaDto){ try { const row=await this.prisma.integrationSaga.create({ data: { ...input, state: input.state as any, status: 'RUNNING', startedAt: new Date() } }); await this.audit('saga.created','IntegrationSaga',row.id,{sagaKey:row.sagaKey}); return row; } catch(e){this.conflict(e);} }
  async transitionSaga(id:string,input:TransitionSagaDto){ const found=await this.prisma.integrationSaga.findUnique({where:{id}}); if(!found) throw new NotFoundException('Integration saga not found.'); const terminal:IntegrationSagaStatus[]=[IntegrationSagaStatus.COMPLETED,IntegrationSagaStatus.FAILED,IntegrationSagaStatus.COMPENSATED,IntegrationSagaStatus.CANCELLED]; if(terminal.includes(found.status)) throw new ConflictException('Saga is already terminal.'); const row=await this.prisma.integrationSaga.update({where:{id},data:{status:input.status,state: input.state === undefined ? undefined : (input.state as any), error: input.error,completedAt:terminal.includes(input.status)?new Date():undefined}}); await this.audit('saga.transitioned','IntegrationSaga',id,{status:row.status}); return row; }
}
